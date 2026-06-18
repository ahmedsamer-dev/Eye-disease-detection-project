namespace EyeDiseaseAI.Application.DTOs.MedicalHistory;

public class CreateMedicalHistoryDto
{
    // Medical Conditions
    public bool HasDiabetes { get; set; }
    public bool HasGlaucoma { get; set; }
    public bool HasCataracts { get; set; }
    public bool HasOther { get; set; }
    public string? OtherSpecification { get; set; }
    public bool NormalEye { get; set; }

    // Additional Info
    public string? CurrentMedications { get; set; }
    public string? AllergiesToMedications { get; set; }
    public string? WearGlassesOrContacts { get; set; }
    public string? ContactsBrandType { get; set; }
    public DateTime? LastEyeExam { get; set; }
    public string? PastEyeSurgeries { get; set; }
    public bool PrivacyConsent { get; set; }
}
