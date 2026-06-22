using EyeDiseaseAI.Application.DTOs.Scan;
using EyeDiseaseAI.Application.Interfaces;
using EyeDiseaseAI.Domain.Entities;
using EyeDiseaseAI.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace EyeDiseaseAI.Application.Services;

public class ScanService : IScanService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAiModelService _aiModelService;

    public ScanService(IUnitOfWork unitOfWork, IAiModelService aiModelService)
    {
        _unitOfWork = unitOfWork;
        _aiModelService = aiModelService;
    }

    public async Task<ScanResultDto> UploadAndAnalyzeAsync(string doctorId, IFormFile file, string? eyeSide)
    {
        // 1. Save the image
        var uploadsDir = Path.Combine("wwwroot", "uploads", "scans");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // 2. Send saved image to AI model (read from saved file, not from upload stream)
        using var imageStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
        var prediction = await _aiModelService.PredictAsync(imageStream, file.FileName);

        // ── Fundus Image Validation ──────────────────────────────────────────
        // Strategy 1: top confidence must be ≥ 60%
        bool lowConfidence = prediction.Confidence < 60.0;

        // Strategy 2 (only when all_predictions is available):
        // margin = (max_prob − second_max_prob) × 100
        // If margin < 20 pp the model is confused — image is not a recognisable fundus photo.
        bool lowMargin = false;
        if (prediction.AllPredictions.Count >= 2)
        {
            var sorted = prediction.AllPredictions.OrderByDescending(p => p).ToList();
            double marginPct = (sorted[0] - sorted[1]) * 100.0;
            lowMargin = marginPct < 20.0;
        }

        if (lowConfidence || lowMargin)
        {
            try { File.Delete(filePath); } catch { /* best-effort cleanup */ }
            throw new ArgumentException(
                "The uploaded image does not appear to be a valid fundus/retinal eye photograph. " +
                "Please upload a clear fundus image captured by a fundus camera or OCT device. " +
                $"Model result: \"{prediction.Condition}\" — {prediction.Confidence:F1}% confidence.");
        }
        // ────────────────────────────────────────────────────────────────────

        // 3. Save ScanImage entity
        var scanImage = new ScanImage
        {
            DoctorId = doctorId,
            ImagePath = $"/uploads/scans/{fileName}",
            OriginalFileName = file.FileName,
            EyeSide = eyeSide,
            CapturedAt = DateTime.UtcNow,
            UploadedAt = DateTime.UtcNow
        };

        await _unitOfWork.ScanImages.AddAsync(scanImage);
        await _unitOfWork.CompleteAsync();

        // 4. Save DiagnosisReport entity (IsSaved = false initially)
        var report = new DiagnosisReport
        {
            ScanImageId = scanImage.Id,
            DoctorId = doctorId,
            Condition = prediction.Condition,
            Confidence = prediction.Confidence,
            Severity = prediction.Severity,
            IopEstimate = prediction.IopEstimate,
            RetinalCupDiscRatio = prediction.RetinalCupDiscRatio,
            Summary = prediction.Summary,
            IsSaved = false,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.DiagnosisReports.AddAsync(report);
        await _unitOfWork.CompleteAsync();

        // 5. Save Recommendations
        for (int i = 0; i < prediction.Recommendations.Count; i++)
        {
            var rec = new Recommendation
            {
                DiagnosisReportId = report.Id,
                OrderIndex = i + 1,
                Text = prediction.Recommendations[i]
            };
            await _unitOfWork.Recommendations.AddAsync(rec);
        }
        await _unitOfWork.CompleteAsync();

        // 6. Return result
        return new ScanResultDto
        {
            ScanImageId = scanImage.Id,
            ReportId = report.Id,
            ImagePath = scanImage.ImagePath,
            Condition = report.Condition,
            Confidence = report.Confidence,
            Severity = report.Severity,
            IopEstimate = report.IopEstimate,
            RetinalCupDiscRatio = report.RetinalCupDiscRatio,
            Summary = report.Summary,
            Recommendations = prediction.Recommendations,
            AnalyzedAt = report.CreatedAt
        };
    }

    public async Task<ScanResultDto?> GetByIdAsync(string doctorId, int scanId)
    {
        var scan = await _unitOfWork.ScanImages
            .FirstOrDefaultAsync(s => s.Id == scanId && s.DoctorId == doctorId);

        if (scan == null) return null;

        var report = await _unitOfWork.DiagnosisReports
            .FirstOrDefaultAsync(r => r.ScanImageId == scanId);

        if (report == null) return null;

        var recommendations = await _unitOfWork.Recommendations
            .FindAsync(r => r.DiagnosisReportId == report.Id);

        return new ScanResultDto
        {
            ScanImageId = scan.Id,
            ReportId = report.Id,
            ImagePath = scan.ImagePath,
            Condition = report.Condition,
            Confidence = report.Confidence,
            Severity = report.Severity,
            IopEstimate = report.IopEstimate,
            RetinalCupDiscRatio = report.RetinalCupDiscRatio,
            Summary = report.Summary,
            Recommendations = recommendations.OrderBy(r => r.OrderIndex).Select(r => r.Text).ToList(),
            AnalyzedAt = report.CreatedAt
        };
    }
}
