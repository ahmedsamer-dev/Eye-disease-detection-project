namespace EyeDiseaseAI.Application.DTOs.Report;

public class DiagnosisReportDto
{
    public int Id { get; set; }
    public int ScanImageId { get; set; }
    public string ImagePath { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string Severity { get; set; } = string.Empty;
    public string? IopEstimate { get; set; }
    public string? RetinalCupDiscRatio { get; set; }
    public string Summary { get; set; } = string.Empty;
    public bool IsSaved { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<RecommendationDto> Recommendations { get; set; } = new();
}
