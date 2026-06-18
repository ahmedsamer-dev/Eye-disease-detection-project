namespace EyeDiseaseAI.Domain.Entities;

public class DiagnosisReport
{
    public int Id { get; set; }
    public int ScanImageId { get; set; }
    public string DoctorId { get; set; } = string.Empty;

    public string Condition { get; set; } = string.Empty;          // "Glaucoma — Early Stage"
    public double Confidence { get; set; }                         // 94.2
    public string Severity { get; set; } = string.Empty;           // "Low — Monitor quarterly"
    public string? IopEstimate { get; set; }                       // "22 mmHg (elevated)"
    public string? RetinalCupDiscRatio { get; set; }               // "0.65 (borderline)"
    public string Summary { get; set; } = string.Empty;
    public bool IsSaved { get; set; }                              // هل الدكتور ضغط Save؟
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public ScanImage ScanImage { get; set; } = null!;
    public ApplicationUser Doctor { get; set; } = null!;
    public ICollection<Recommendation> Recommendations { get; set; } = new List<Recommendation>();
}
