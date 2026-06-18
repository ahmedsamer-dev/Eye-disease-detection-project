namespace EyeDiseaseAI.Application.DTOs.MedicalHistory;

public class MedicalHistoryDto
{
    public int Id { get; set; }
    public string DoctorId { get; set; } = string.Empty;
    public bool HasDiabetes { get; set; }
    public bool HasGlaucoma { get; set; }
    public bool HasCataracts { get; set; }
    public bool HasOther { get; set; }
    public string? OtherSpecification { get; set; }
    public bool NormalEye { get; set; }
    public string? CurrentMedications { get; set; }
    public string? AllergiesToMedications { get; set; }
    public string? WearGlassesOrContacts { get; set; }
    public string? ContactsBrandType { get; set; }
    public DateTime? LastEyeExam { get; set; }
    public string? PastEyeSurgeries { get; set; }
    public bool PrivacyConsent { get; set; }
    public DateTime CreatedAt { get; set; }
}
