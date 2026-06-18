using EyeDiseaseAI.Application.DTOs.Profile;
using Microsoft.AspNetCore.Http;

namespace EyeDiseaseAI.Application.Interfaces;

public interface IProfileService
{
    Task<ProfileDto> GetProfileAsync(string userId);
    Task<ProfileDto> UpdateProfileAsync(string userId, UpdateProfileDto dto);
    Task<string> UploadProfileImageAsync(string userId, IFormFile file);
}
