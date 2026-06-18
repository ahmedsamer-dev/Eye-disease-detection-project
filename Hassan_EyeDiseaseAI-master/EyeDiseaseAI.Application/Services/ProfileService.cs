using AutoMapper;
using EyeDiseaseAI.Application.DTOs.Profile;
using EyeDiseaseAI.Application.Interfaces;
using EyeDiseaseAI.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace EyeDiseaseAI.Application.Services;

public class ProfileService : IProfileService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;

    public ProfileService(UserManager<ApplicationUser> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<ProfileDto> GetProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        return _mapper.Map<ProfileDto>(user);
    }

    public async Task<ProfileDto> UpdateProfileAsync(string userId, UpdateProfileDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        // Update only non-null fields
        if (dto.FullName != null) user.FullName = dto.FullName;
        if (dto.PreferredName != null) user.PreferredName = dto.PreferredName;
        if (dto.PhoneNumber != null) user.PhoneNumber = dto.PhoneNumber;
        if (dto.DateOfBirth.HasValue) user.DateOfBirth = dto.DateOfBirth;
        if (dto.Gender.HasValue) user.Gender = dto.Gender;
        if (dto.Address != null) user.Address = dto.Address;
        if (dto.ProfileImageUrl != null) user.ProfileImageUrl = dto.ProfileImageUrl;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new Exception($"Failed to update profile: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        return _mapper.Map<ProfileDto>(user);
    }

    public async Task<string> UploadProfileImageAsync(string userId, IFormFile file)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        // Create uploads directory
        var uploadsDir = System.IO.Path.Combine("wwwroot", "uploads", "profiles");
        System.IO.Directory.CreateDirectory(uploadsDir);

        // Optional: delete old image from server to clean up disk space
        if (!string.IsNullOrEmpty(user.ProfileImageUrl) && user.ProfileImageUrl.StartsWith("/uploads/profiles/"))
        {
            var oldFilePath = System.IO.Path.Combine("wwwroot", user.ProfileImageUrl.TrimStart('/'));
            if (System.IO.File.Exists(oldFilePath))
            {
                try
                {
                    System.IO.File.Delete(oldFilePath);
                }
                catch
                {
                    // Ignore physical file delete errors
                }
            }
        }

        // Save new image
        var fileName = $"{Guid.NewGuid()}{System.IO.Path.GetExtension(file.FileName)}";
        var filePath = System.IO.Path.Combine(uploadsDir, fileName);

        using (var stream = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Update database record
        user.ProfileImageUrl = $"/uploads/profiles/{fileName}";
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new Exception($"Failed to update profile image: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        return user.ProfileImageUrl;
    }
}
