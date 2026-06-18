using EyeDiseaseAI.Application.DTOs.Report;

namespace EyeDiseaseAI.Application.Interfaces;

public interface IReportService
{
    Task<IEnumerable<ReportSummaryDto>> GetAllSavedAsync(string doctorId);
    Task<int> GetSavedCountAsync(string doctorId);
    Task<DiagnosisReportDto?> GetByIdAsync(string doctorId, int reportId);
    Task<bool> SaveReportAsync(string doctorId, int reportId);
    Task<byte[]?> DownloadPdfAsync(string doctorId, int reportId);
    Task<bool> DeleteReportAsync(string doctorId, int reportId);
}
