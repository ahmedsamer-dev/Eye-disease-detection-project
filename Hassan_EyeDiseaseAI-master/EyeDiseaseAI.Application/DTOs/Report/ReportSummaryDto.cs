namespace EyeDiseaseAI.Application.DTOs.Report;

public class ReportSummaryDto
{
    public int Id { get; set; }
    public string Condition { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string Severity { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? ImagePath { get; set; }
}
