using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using EyeDiseaseAI.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace EyeDiseaseAI.Infrastructure.Services;

public class AiModelService : IAiModelService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AiModelService> _logger;

    private static readonly Dictionary<string, ConditionDetails> _conditionDetails = new()
    {
        ["Cataract"] = new ConditionDetails
        {
            Severity = "Moderate - Surgical evaluation recommended",
            IopEstimate = "14 mmHg (normal)",
            RetinalCupDiscRatio = "0.3 (normal)",
            Summary = "The AI analysis detected signs of cataract in the fundus image. Cataracts cause clouding of the eye lens, leading to decreased vision. Early detection allows for timely surgical intervention.",
            Recommendations = new List<string>
            {
                "Schedule a comprehensive eye examination with an ophthalmologist",
                "Discuss surgical options (phacoemulsification) if vision is significantly affected",
                "Monitor for progression with regular follow-up visits every 3-6 months",
                "Use anti-glare sunglasses and adequate lighting to manage symptoms"
            }
        },
        ["Diabetic Retinopathy"] = new ConditionDetails
        {
            Severity = "High - Immediate follow-up required",
            IopEstimate = "16 mmHg (normal)",
            RetinalCupDiscRatio = "0.4 (normal)",
            Summary = "The AI analysis detected signs of Diabetic Retinopathy. This condition results from damage to the blood vessels of the retina due to diabetes. Early treatment can prevent severe vision loss.",
            Recommendations = new List<string>
            {
                "Refer to a retinal specialist for fluorescein angiography",
                "Ensure strict blood sugar control (HbA1c < 7%)",
                "Consider anti-VEGF injections or laser photocoagulation therapy",
                "Schedule follow-up examination within 2-4 weeks"
            }
        },
        ["Glaucoma"] = new ConditionDetails
        {
            Severity = "High - Monitor and treat promptly",
            IopEstimate = "22 mmHg (elevated)",
            RetinalCupDiscRatio = "0.65 (borderline)",
            Summary = "The AI analysis detected signs of Glaucoma. This condition involves increased intraocular pressure that can damage the optic nerve, leading to irreversible vision loss if untreated.",
            Recommendations = new List<string>
            {
                "Perform visual field testing and OCT of the optic nerve",
                "Initiate IOP-lowering therapy (prostaglandin analogs as first-line)",
                "Monitor intraocular pressure quarterly",
                "Educate patient on the importance of medication adherence"
            }
        },
        ["Normal"] = new ConditionDetails
        {
            Severity = "Low - No abnormalities detected",
            IopEstimate = "15 mmHg (normal)",
            RetinalCupDiscRatio = "0.3 (normal)",
            Summary = "The AI analysis shows a healthy fundus with no signs of disease. The retinal structures appear normal. Continue routine eye examinations for preventive care.",
            Recommendations = new List<string>
            {
                "Continue routine eye examinations annually",
                "Maintain a healthy lifestyle with proper nutrition for eye health",
                "Protect eyes from UV exposure with quality sunglasses",
                "Report any sudden changes in vision immediately"
            }
        }
    };

    public AiModelService(HttpClient httpClient, IConfiguration configuration, ILogger<AiModelService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<AiPredictionResult> PredictAsync(Stream imageStream, string fileName)
    {
        var aiModelUrl = _configuration["AiModel:BaseUrl"]
            ?? throw new InvalidOperationException("AI Model URL not configured");

        var endpoint = _configuration["AiModel:PredictEndpoint"] ?? "/predict";

        try
        {
            using var content = new MultipartFormDataContent();
            var streamContent = new StreamContent(imageStream);
            streamContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");
            content.Add(streamContent, "file", fileName);

            var response = await _httpClient.PostAsync($"{aiModelUrl}{endpoint}", content);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("AI Model Response: {Response}", jsonResponse);

            var jsonDoc = JsonDocument.Parse(jsonResponse);
            var root = jsonDoc.RootElement;

            string condition = "Unknown";
            double confidence = 0.0;

            if (root.TryGetProperty("prediction", out var predProp))
                condition = predProp.GetString() ?? "Unknown";
            else if (root.TryGetProperty("condition", out var condProp))
                condition = condProp.GetString() ?? "Unknown";

            if (root.TryGetProperty("confidence", out var confProp))
            {
                confidence = confProp.GetDouble();
                if (confidence <= 1.0)
                    confidence *= 100.0;
            }

            var details = _conditionDetails.GetValueOrDefault(condition, new ConditionDetails
            {
                Severity = "Unknown",
                IopEstimate = "N/A",
                RetinalCupDiscRatio = "N/A",
                Summary = "Analysis completed. Please consult an ophthalmologist.",
                Recommendations = new List<string> { "Consult an eye care professional for evaluation." }
            });

            return new AiPredictionResult
            {
                Condition = condition,
                Confidence = Math.Round(confidence, 1),
                Severity = details.Severity,
                IopEstimate = details.IopEstimate,
                RetinalCupDiscRatio = details.RetinalCupDiscRatio,
                Summary = details.Summary,
                Recommendations = details.Recommendations
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling AI model");
            throw;
        }
    }

    private class ConditionDetails
    {
        public string Severity { get; set; } = "";
        public string IopEstimate { get; set; } = "";
        public string RetinalCupDiscRatio { get; set; } = "";
        public string Summary { get; set; } = "";
        public List<string> Recommendations { get; set; } = new();
    }
}
