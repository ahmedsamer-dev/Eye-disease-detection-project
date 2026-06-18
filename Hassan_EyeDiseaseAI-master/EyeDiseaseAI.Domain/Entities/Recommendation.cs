namespace EyeDiseaseAI.Domain.Entities;

public class Recommendation
{
    public int Id { get; set; }
    public int DiagnosisReportId { get; set; }
    public int OrderIndex { get; set; }           // 1, 2, 3, 4
    public string Text { get; set; } = string.Empty;

    // Navigation Properties
    public DiagnosisReport DiagnosisReport { get; set; } = null!;
}
