using AutoMapper;
using EyeDiseaseAI.Application.DTOs.MedicalHistory;
using EyeDiseaseAI.Application.Interfaces;
using EyeDiseaseAI.Domain.Entities;
using EyeDiseaseAI.Domain.Interfaces;

namespace EyeDiseaseAI.Application.Services;

public class MedicalHistoryService : IMedicalHistoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public MedicalHistoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<MedicalHistoryDto> CreateAsync(string doctorId, CreateMedicalHistoryDto dto)
    {
        var entity = _mapper.Map<MedicalHistory>(dto);
        entity.DoctorId = doctorId;
        entity.CreatedAt = DateTime.UtcNow;

        await _unitOfWork.MedicalHistories.AddAsync(entity);
        await _unitOfWork.CompleteAsync();

        return _mapper.Map<MedicalHistoryDto>(entity);
    }

    public async Task<IEnumerable<MedicalHistoryDto>> GetAllByDoctorAsync(string doctorId)
    {
        var histories = await _unitOfWork.MedicalHistories
            .FindAsync(h => h.DoctorId == doctorId);

        return _mapper.Map<IEnumerable<MedicalHistoryDto>>(histories);
    }

    public async Task<MedicalHistoryDto?> GetByIdAsync(string doctorId, int id)
    {
        var history = await _unitOfWork.MedicalHistories
            .FirstOrDefaultAsync(h => h.Id == id && h.DoctorId == doctorId);

        return history == null ? null : _mapper.Map<MedicalHistoryDto>(history);
    }
}
