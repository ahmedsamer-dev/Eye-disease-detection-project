using AutoMapper;
using EyeDiseaseAI.Application.DTOs.Report;
using EyeDiseaseAI.Application.Interfaces;
using EyeDiseaseAI.Domain.Interfaces;

namespace EyeDiseaseAI.Application.Services;

public class ReportService : IReportService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ReportService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ReportSummaryDto>> GetAllSavedAsync(string doctorId)
    {
        var reports = await _unitOfWork.DiagnosisReports
            .FindAsync(r => r.DoctorId == doctorId && r.IsSaved);

        var summaries = new List<ReportSummaryDto>();
        foreach (var report in reports.OrderByDescending(r => r.CreatedAt))
        {
            var scan = await _unitOfWork.ScanImages.GetByIdAsync(report.ScanImageId);
            summaries.Add(new ReportSummaryDto
            {
                Id = report.Id,
                Condition = report.Condition,
                Confidence = report.Confidence,
                Severity = report.Severity,
                CreatedAt = report.CreatedAt,
                ImagePath = scan?.ImagePath
            });
        }

        return summaries;
    }

    public async Task<int> GetSavedCountAsync(string doctorId)
    {
        return await _unitOfWork.DiagnosisReports
            .CountAsync(r => r.DoctorId == doctorId && r.IsSaved);
    }

    public async Task<DiagnosisReportDto?> GetByIdAsync(string doctorId, int reportId)
    {
        var report = await _unitOfWork.DiagnosisReports
            .FirstOrDefaultAsync(r => r.Id == reportId && r.DoctorId == doctorId);

        if (report == null) return null;

        var scan = await _unitOfWork.ScanImages.GetByIdAsync(report.ScanImageId);
        var recommendations = await _unitOfWork.Recommendations
            .FindAsync(r => r.DiagnosisReportId == report.Id);

        return new DiagnosisReportDto
        {
            Id = report.Id,
            ScanImageId = report.ScanImageId,
            ImagePath = scan?.ImagePath ?? string.Empty,
            Condition = report.Condition,
            Confidence = report.Confidence,
            Severity = report.Severity,
            IopEstimate = report.IopEstimate,
            RetinalCupDiscRatio = report.RetinalCupDiscRatio,
            Summary = report.Summary,
            IsSaved = report.IsSaved,
            CreatedAt = report.CreatedAt,
            Recommendations = recommendations
                .OrderBy(r => r.OrderIndex)
                .Select(r => new RecommendationDto
                {
                    OrderIndex = r.OrderIndex,
                    Text = r.Text
                }).ToList()
        };
    }

    public async Task<bool> SaveReportAsync(string doctorId, int reportId)
    {
        var report = await _unitOfWork.DiagnosisReports
            .FirstOrDefaultAsync(r => r.Id == reportId && r.DoctorId == doctorId);

        if (report == null) return false;

        report.IsSaved = true;
        _unitOfWork.DiagnosisReports.Update(report);
        await _unitOfWork.CompleteAsync();

        return true;
    }

    public async Task<byte[]?> DownloadPdfAsync(string doctorId, int reportId)
    {
        var report = await GetByIdAsync(doctorId, reportId);
        if (report == null) return null;

        // Simple PDF generation placeholder
        // In production, use a library like QuestPDF or iTextSharp
        var content = $"""
            AI Eye Disease Detection Report
            ================================
            Date: {report.CreatedAt:yyyy-MM-dd HH:mm}
            Condition: {report.Condition}
            Confidence: {report.Confidence}%
            Severity: {report.Severity}
            IOP Estimate: {report.IopEstimate ?? "N/A"}
            Cup-to-Disc Ratio: {report.RetinalCupDiscRatio ?? "N/A"}
            
            Summary:
            {report.Summary}
            
            Recommendations:
            {string.Join("\n", report.Recommendations.Select(r => $"  {r.OrderIndex}. {r.Text}"))}
            """;

        return System.Text.Encoding.UTF8.GetBytes(content);
    }

    public async Task<bool> DeleteReportAsync(string doctorId, int reportId)
    {
        var report = await _unitOfWork.DiagnosisReports
            .FirstOrDefaultAsync(r => r.Id == reportId && r.DoctorId == doctorId);

        if (report == null) return false;

        var scanImage = await _unitOfWork.ScanImages.GetByIdAsync(report.ScanImageId);

        // Delete Report (Recommendations are Cascade Deleted via foreign key)
        _unitOfWork.DiagnosisReports.Delete(report);

        // Delete Scan Image if it exists
        if (scanImage != null)
        {
            _unitOfWork.ScanImages.Delete(scanImage);

            // Delete physical file
            var filePath = System.IO.Path.Combine("wwwroot", scanImage.ImagePath.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
            {
                try
                {
                    System.IO.File.Delete(filePath);
                }
                catch
                {
                    // Ignore physical file delete errors (e.g. if locked)
                }
            }
        }

        await _unitOfWork.CompleteAsync();
        return true;
    }
}
