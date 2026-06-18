using System.Security.Claims;
using EyeDiseaseAI.Application.DTOs.MedicalHistory;
using EyeDiseaseAI.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EyeDiseaseAI.API.Controllers;

[ApiController]
[Route("api/medical-history")]
[Authorize]
public class MedicalHistoryController : ControllerBase
{
    private readonly IMedicalHistoryService _medicalHistoryService;

    public MedicalHistoryController(IMedicalHistoryService medicalHistoryService)
    {
        _medicalHistoryService = medicalHistoryService;
    }

    /// <summary>
    /// الدكتور يسجل بيانات المريض (Referral Form)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<MedicalHistoryDto>> Create([FromBody] CreateMedicalHistoryDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _medicalHistoryService.CreateAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// كل الـ Medical Histories بتاعت الدكتور
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MedicalHistoryDto>>> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _medicalHistoryService.GetAllByDoctorAsync(userId);
        return Ok(result);
    }

    /// <summary>
    /// Medical History معينة
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<MedicalHistoryDto>> GetById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _medicalHistoryService.GetByIdAsync(userId, id);
        if (result == null) return NotFound(new { message = "Medical history not found" });

        return Ok(result);
    }
}
