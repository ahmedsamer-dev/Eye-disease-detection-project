using EyeDiseaseAI.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace EyeDiseaseAI.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public string? PreferredName { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public string? Address { get; set; }
    public string? ProfileImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public ICollection<MedicalHistory> MedicalHistories { get; set; } = new List<MedicalHistory>();
    public ICollection<ScanImage> ScanImages { get; set; } = new List<ScanImage>();
    public ICollection<DiagnosisReport> DiagnosisReports { get; set; } = new List<DiagnosisReport>();
}
