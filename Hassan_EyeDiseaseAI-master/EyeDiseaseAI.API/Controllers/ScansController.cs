using System.Security.Claims;
using EyeDiseaseAI.Application.DTOs.Scan;
using EyeDiseaseAI.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EyeDiseaseAI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ScansController : ControllerBase
{
    private readonly IScanService _scanService;

    public ScansController(IScanService scanService)
    {
        _scanService = scanService;
    }

    /// <summary>
    /// رفع صورة → AI يحلل → يرجع النتيجة
    /// </summary>
    [HttpPost("upload")]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB max
    public async Task<ActionResult<ScanResultDto>> Upload(IFormFile file, [FromForm] string? eyeSide)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded" });

        // Validate file type
        var allowedTypes = new[] { "image/jpeg", "image/png", "image/jpg" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
            return BadRequest(new { message = "Only JPEG and PNG images are allowed" });

        try
        {
            var result = await _scanService.UploadAndAnalyzeAsync(userId, file, eyeSide);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            // Validation errors (e.g. non-fundus image) → 400
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error analyzing image", detail = ex.Message });
        }
    }

    /// <summary>
    /// تفاصيل صورة معينة
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ScanResultDto>> GetById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _scanService.GetByIdAsync(userId, id);
        if (result == null) return NotFound(new { message = "Scan not found" });

        return Ok(result);
    }
}
