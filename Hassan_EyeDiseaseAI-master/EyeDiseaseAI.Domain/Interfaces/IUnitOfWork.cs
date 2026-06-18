using EyeDiseaseAI.Domain.Entities;

namespace EyeDiseaseAI.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IGenericRepository<MedicalHistory> MedicalHistories { get; }
    IGenericRepository<ScanImage> ScanImages { get; }
    IGenericRepository<DiagnosisReport> DiagnosisReports { get; }
    IGenericRepository<Recommendation> Recommendations { get; }

    Task<int> CompleteAsync();
}
