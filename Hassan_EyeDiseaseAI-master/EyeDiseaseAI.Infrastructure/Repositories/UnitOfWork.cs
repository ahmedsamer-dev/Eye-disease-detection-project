using EyeDiseaseAI.Domain.Entities;
using EyeDiseaseAI.Domain.Interfaces;
using EyeDiseaseAI.Infrastructure.Data;

namespace EyeDiseaseAI.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public IGenericRepository<MedicalHistory> MedicalHistories { get; }
    public IGenericRepository<ScanImage> ScanImages { get; }
    public IGenericRepository<DiagnosisReport> DiagnosisReports { get; }
    public IGenericRepository<Recommendation> Recommendations { get; }

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        MedicalHistories = new GenericRepository<MedicalHistory>(context);
        ScanImages = new GenericRepository<ScanImage>(context);
        DiagnosisReports = new GenericRepository<DiagnosisReport>(context);
        Recommendations = new GenericRepository<Recommendation>(context);
    }

    public async Task<int> CompleteAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
