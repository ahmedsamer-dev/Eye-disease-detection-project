using System.Security.Claims;
using EyeDiseaseAI.Application.DTOs.Report;
using EyeDiseaseAI.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EyeDiseaseAI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    /// <summary>
    /// كل الـ Reports المحفوظة (صفحة History) + العدد
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var reports = await _reportService.GetAllSavedAsync(userId);
        var count = await _reportService.GetSavedCountAsync(userId);

        return Ok(new { count, reports });
    }

    /// <summary>
    /// Report كامل + Recommendations
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<DiagnosisReportDto>> GetById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var report = await _reportService.GetByIdAsync(userId, id);
        if (report == null) return NotFound(new { message = "Report not found" });

        return Ok(report);
    }

    /// <summary>
    /// حفظ الـ Report + الصورة في الـ History
    /// </summary>
    [HttpPost("{id}/save")]
    public async Task<IActionResult> SaveReport(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var success = await _reportService.SaveReportAsync(userId, id);
        if (!success) return NotFound(new { message = "Report not found" });

        return Ok(new { message = "Report saved to history successfully" });
    }

    /// <summary>
    /// تحميل الـ Report كـ PDF
    /// </summary>
    [HttpGet("{id}/download")]
    public async Task<IActionResult> Download(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var pdfBytes = await _reportService.DownloadPdfAsync(userId, id);
        if (pdfBytes == null) return NotFound(new { message = "Report not found" });

        return File(pdfBytes, "text/plain", $"report_{id}.txt");
    }

    /// <summary>
    /// حذف تقرير من التاريخ وقاعدة البيانات
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var success = await _reportService.DeleteReportAsync(userId, id);
        if (!success) return NotFound(new { message = "Report not found" });

        return Ok(new { message = "Report deleted successfully" });
    }
}
