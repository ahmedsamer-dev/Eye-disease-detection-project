namespace EyeDiseaseAI.Domain.Interfaces;

public interface IAiModelService
{
    /// <summary>
    /// Sends the eye image to the AI model and returns the prediction result.
    /// </summary>
    Task<AiPredictionResult> PredictAsync(Stream imageStream, string fileName);
}

public class AiPredictionResult
{
    public string Condition { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string Severity { get; set; } = string.Empty;
    public string? IopEstimate { get; set; }
    public string? RetinalCupDiscRatio { get; set; }
    public string Summary { get; set; } = string.Empty;
    public List<string> Recommendations { get; set; } = new();
    /// <summary>Raw per-class probabilities (0–1) returned by the AI server, e.g. [0.85, 0.08, 0.04, 0.03]</summary>
    public List<double> AllPredictions { get; set; } = new();
}
