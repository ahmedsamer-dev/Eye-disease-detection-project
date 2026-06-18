using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EyeDiseaseAI.Application.DTOs.Auth;
using EyeDiseaseAI.Application.Interfaces;
using EyeDiseaseAI.Domain.Entities;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EyeDiseaseAI.Application.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthService(UserManager<ApplicationUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    // =============================================
    // Register - إنشاء حساب جديد
    // =============================================
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // Validate passwords match
        if (dto.Password != dto.ConfirmPassword)
            throw new ArgumentException("Passwords do not match");

        // Check if email already exists
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
            throw new ArgumentException("An account with this email already exists");

        // Create new user
        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName,
            Gender = dto.Gender,
            DateOfBirth = dto.DateOfBirth,
            EmailConfirmed = true, // Set to false if you want email confirmation
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new ArgumentException($"Registration failed: {errors}");
        }

        // Generate JWT and return
        var token = GenerateJwtToken(user);
        return new AuthResponseDto
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddDays(7),
            UserId = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            IsNewUser = true
        };
    }

    // =============================================
    // Login - تسجيل دخول بالإيميل والباسورد
    // =============================================
    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            throw new ArgumentException("Invalid email or password");

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isPasswordValid)
            throw new ArgumentException("Invalid email or password");

        var token = GenerateJwtToken(user);
        return new AuthResponseDto
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddDays(7),
            UserId = user.Id,
            Email = user.Email!,
            FullName = user.FullName,
            ProfileImageUrl = user.ProfileImageUrl,
            IsNewUser = false
        };
    }

    // =============================================
    // Google Login - تسجيل دخول بجوجل
    // =============================================
    public async Task<AuthResponseDto> GoogleLoginAsync(GoogleLoginDto dto)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { _configuration["Authentication:Google:ClientId"] }
        };

        var payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, settings);

        var user = await _userManager.FindByEmailAsync(payload.Email);
        bool isNewUser = false;

        if (user == null)
        {
            isNewUser = true;
            user = new ApplicationUser
            {
                UserName = payload.Email,
                Email = payload.Email,
                FullName = payload.Name ?? payload.Email,
                ProfileImageUrl = payload.Picture,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        var token = GenerateJwtToken(user);
        return new AuthResponseDto
        {
            Token = token,
            Expiration = DateTime.UtcNow.AddDays(7),
            UserId = user.Id,
            Email = user.Email!,
            FullName = user.FullName,
            ProfileImageUrl = user.ProfileImageUrl,
            IsNewUser = isNewUser
        };
    }

    // =============================================
    // Forgot Password - إرسال كود إعادة تعيين الباسورد
    // =============================================
    public async Task<string> ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            // Don't reveal that email doesn't exist (security best practice)
            return "If this email is registered, a reset code has been sent.";
        }

        // Generate password reset token
        var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

        // TODO: Send reset token via Email or SMS
        // For now, return it in response (for testing only)
        // In production, send it via email service and return generic message

        return resetToken;
    }

    // =============================================
    // Reset Password - إعادة تعيين الباسورد بالكود
    // =============================================
    public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
    {
        if (dto.NewPassword != dto.ConfirmPassword)
            throw new ArgumentException("Passwords do not match");

        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            throw new ArgumentException("Invalid request");

        var result = await _userManager.ResetPasswordAsync(user, dto.ResetCode, dto.NewPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new ArgumentException($"Reset failed: {errors}");
        }

        return true;
    }

    // =============================================
    // Change Password - تغيير كلمة المرور للمستخدم الحالي
    // =============================================
    public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto)
    {
        if (dto.NewPassword != dto.ConfirmPassword)
            throw new ArgumentException("New password and confirm password do not match");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            throw new ArgumentException("User not found");

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new ArgumentException($"Change password failed: {errors}");
        }

        return true;
    }

    // =============================================
    // Logout
    // =============================================
    public Task LogoutAsync(string userId)
    {
        return Task.CompletedTask;
    }

    // =============================================
    // Helper: Generate JWT Token
    // =============================================
    private string GenerateJwtToken(ApplicationUser user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email!),
            new(ClaimTypes.Name, user.FullName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

