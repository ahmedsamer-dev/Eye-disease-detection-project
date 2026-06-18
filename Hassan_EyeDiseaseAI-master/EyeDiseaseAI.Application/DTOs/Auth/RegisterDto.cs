using EyeDiseaseAI.Domain.Enums;

namespace EyeDiseaseAI.Application.DTOs.Auth;

public class RegisterDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public Gender? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
}
