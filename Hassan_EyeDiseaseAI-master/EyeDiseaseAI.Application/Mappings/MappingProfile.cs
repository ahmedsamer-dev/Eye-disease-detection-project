using AutoMapper;
using EyeDiseaseAI.Application.DTOs.MedicalHistory;
using EyeDiseaseAI.Application.DTOs.Profile;
using EyeDiseaseAI.Application.DTOs.Report;
using EyeDiseaseAI.Domain.Entities;

namespace EyeDiseaseAI.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // ApplicationUser → ProfileDto
        CreateMap<ApplicationUser, ProfileDto>();

        // CreateMedicalHistoryDto → MedicalHistory
        CreateMap<CreateMedicalHistoryDto, MedicalHistory>();

        // MedicalHistory → MedicalHistoryDto
        CreateMap<MedicalHistory, MedicalHistoryDto>();

        // Recommendation → RecommendationDto
        CreateMap<Recommendation, RecommendationDto>();

        // DiagnosisReport → DiagnosisReportDto
        CreateMap<DiagnosisReport, DiagnosisReportDto>();

        // DiagnosisReport → ReportSummaryDto
        CreateMap<DiagnosisReport, ReportSummaryDto>();
    }
}
