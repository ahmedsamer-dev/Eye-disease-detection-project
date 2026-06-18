using EyeDiseaseAI.Domain.Enums;

namespace EyeDiseaseAI.Application.DTOs.Profile;

public class UpdateProfileDto
{
    public string? FullName { get; set; }
    public string? PreferredName { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public Gender? Gender { get; set; }
    public string? Address { get; set; }
    public string? ProfileImageUrl { get; set; }
}
