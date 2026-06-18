using EyeDiseaseAI.Application.DTOs.MedicalHistory;

namespace EyeDiseaseAI.Application.Interfaces;

public interface IMedicalHistoryService
{
    Task<MedicalHistoryDto> CreateAsync(string doctorId, CreateMedicalHistoryDto dto);
    Task<IEnumerable<MedicalHistoryDto>> GetAllByDoctorAsync(string doctorId);
    Task<MedicalHistoryDto?> GetByIdAsync(string doctorId, int id);
}
