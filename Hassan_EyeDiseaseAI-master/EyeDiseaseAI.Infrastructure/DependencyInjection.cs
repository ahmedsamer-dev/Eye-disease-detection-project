using EyeDiseaseAI.Application.Interfaces;
using EyeDiseaseAI.Application.Services;
using EyeDiseaseAI.Domain.Entities;
using EyeDiseaseAI.Domain.Interfaces;
using EyeDiseaseAI.Infrastructure.Data;
using EyeDiseaseAI.Infrastructure.Repositories;
using EyeDiseaseAI.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EyeDiseaseAI.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database (SQLite)
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection")));

        // Identity
        services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.SignIn.RequireConfirmedEmail = false;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        // Repositories
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProfileService, ProfileService>();
        services.AddScoped<IMedicalHistoryService, MedicalHistoryService>();
        services.AddScoped<IScanService, ScanService>();
        services.AddScoped<IReportService, ReportService>();

        // AI Model HTTP Client
        services.AddHttpClient<IAiModelService, AiModelService>(client =>
        {
            var baseUrl = configuration["AiModel:BaseUrl"] ?? "http://localhost:5000";
            client.BaseAddress = new Uri(baseUrl);
            client.Timeout = TimeSpan.FromSeconds(60);
        });

        // AutoMapper
        services.AddAutoMapper(typeof(Application.Mappings.MappingProfile).Assembly);

        return services;
    }
}
