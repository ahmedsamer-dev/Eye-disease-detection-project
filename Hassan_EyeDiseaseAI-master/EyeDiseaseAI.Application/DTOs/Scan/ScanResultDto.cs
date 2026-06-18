namespace EyeDiseaseAI.Application.DTOs.Scan;

public class ScanResultDto
{
    public int ScanImageId { get; set; }
    public int ReportId { get; set; }
    public string ImagePath { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string Severity { get; set; } = string.Empty;
    public string? IopEstimate { get; set; }
    public string? RetinalCupDiscRatio { get; set; }
    public string Summary { get; set; } = string.Empty;
    public List<string> Recommendations { get; set; } = new();
    public DateTime AnalyzedAt { get; set; }
}
