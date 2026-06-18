using System.Net.Http.Headers;
using System.Text.Json;
using EyeDiseaseAI.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace EyeDiseaseAI.Infrastructure.Services;

public class AiModelService : IAiModelService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AiModelService> _logger;

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

            var result = JsonSerializer.Deserialize<AiModelResponse>(jsonResponse, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (result == null)
                throw new Exception("Failed to deserialize AI model response");

            return new AiPredictionResult
            {
                Condition = result.Condition ?? "Unknown",
                Confidence = result.Confidence,
                Severity = result.Severity ?? "Unknown",
                IopEstimate = result.IopEstimate,
                RetinalCupDiscRatio = result.RetinalCupDiscRatio,
                Summary = result.Summary ?? "Analysis completed.",
                Recommendations = result.Recommendations ?? new List<string>()
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling AI model");
            throw;
        }
    }

    // Internal class to map AI model JSON response
    private class AiModelResponse
    {
        public string? Condition { get; set; }
        public double Confidence { get; set; }
        public string? Severity { get; set; }
        public string? IopEstimate { get; set; }
        public string? RetinalCupDiscRatio { get; set; }
        public string? Summary { get; set; }
        public List<string>? Recommendations { get; set; }
    }
}
