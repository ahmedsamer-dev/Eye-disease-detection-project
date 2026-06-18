using EyeDiseaseAI.Application.DTOs.Scan;
using Microsoft.AspNetCore.Http;

namespace EyeDiseaseAI.Application.Interfaces;

public interface IScanService
{
    Task<ScanResultDto> UploadAndAnalyzeAsync(string doctorId, IFormFile file, string? eyeSide);
    Task<ScanResultDto?> GetByIdAsync(string doctorId, int scanId);
}
