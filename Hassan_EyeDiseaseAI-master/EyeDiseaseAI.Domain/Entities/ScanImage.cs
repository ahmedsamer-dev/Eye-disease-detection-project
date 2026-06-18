namespace EyeDiseaseAI.Domain.Entities;

public class ScanImage
{
    public int Id { get; set; }
    public string DoctorId { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;
    public string? OriginalFileName { get; set; }
    public string? EyeSide { get; set; }          // Right / Left
    public int? ResolutionWidth { get; set; }
    public int? ResolutionHeight { get; set; }
    public string? ImageQuality { get; set; }
    public DateTime CapturedAt { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public ApplicationUser Doctor { get; set; } = null!;
    public DiagnosisReport? DiagnosisReport { get; set; }
}
