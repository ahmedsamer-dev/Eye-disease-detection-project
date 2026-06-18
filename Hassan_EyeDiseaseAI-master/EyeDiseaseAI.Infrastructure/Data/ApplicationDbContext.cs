using EyeDiseaseAI.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EyeDiseaseAI.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<MedicalHistory> MedicalHistories { get; set; }
    public DbSet<ScanImage> ScanImages { get; set; }
    public DbSet<DiagnosisReport> DiagnosisReports { get; set; }
    public DbSet<Recommendation> Recommendations { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ApplicationUser
        builder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(u => u.FullName).IsRequired().HasMaxLength(200);
            entity.Property(u => u.PreferredName).HasMaxLength(100);
            entity.Property(u => u.Address).HasMaxLength(500);
            entity.Property(u => u.ProfileImageUrl).HasMaxLength(500);
        });

        // MedicalHistory
        builder.Entity<MedicalHistory>(entity =>
        {
            entity.HasKey(m => m.Id);

            entity.HasOne(m => m.Doctor)
                  .WithMany(u => u.MedicalHistories)
                  .HasForeignKey(m => m.DoctorId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Property(m => m.OtherSpecification).HasMaxLength(500);
            entity.Property(m => m.CurrentMedications).HasMaxLength(1000);
            entity.Property(m => m.AllergiesToMedications).HasMaxLength(500);
            entity.Property(m => m.WearGlassesOrContacts).HasMaxLength(100);
            entity.Property(m => m.ContactsBrandType).HasMaxLength(200);
            entity.Property(m => m.PastEyeSurgeries).HasMaxLength(1000);
        });

        // ScanImage
        builder.Entity<ScanImage>(entity =>
        {
            entity.HasKey(s => s.Id);

            entity.HasOne(s => s.Doctor)
                  .WithMany(u => u.ScanImages)
                  .HasForeignKey(s => s.DoctorId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Property(s => s.ImagePath).IsRequired().HasMaxLength(500);
            entity.Property(s => s.OriginalFileName).HasMaxLength(300);
            entity.Property(s => s.EyeSide).HasMaxLength(20);
            entity.Property(s => s.ImageQuality).HasMaxLength(50);
        });

        // DiagnosisReport
        builder.Entity<DiagnosisReport>(entity =>
        {
            entity.HasKey(d => d.Id);

            entity.HasOne(d => d.ScanImage)
                  .WithOne(s => s.DiagnosisReport)
                  .HasForeignKey<DiagnosisReport>(d => d.ScanImageId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Doctor)
                  .WithMany(u => u.DiagnosisReports)
                  .HasForeignKey(d => d.DoctorId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Property(d => d.Condition).IsRequired().HasMaxLength(200);
            entity.Property(d => d.Severity).IsRequired().HasMaxLength(200);
            entity.Property(d => d.IopEstimate).HasMaxLength(100);
            entity.Property(d => d.RetinalCupDiscRatio).HasMaxLength(100);
            entity.Property(d => d.Summary).IsRequired().HasMaxLength(2000);
        });

        // Recommendation
        builder.Entity<Recommendation>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.HasOne(r => r.DiagnosisReport)
                  .WithMany(d => d.Recommendations)
                  .HasForeignKey(r => r.DiagnosisReportId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.Property(r => r.Text).IsRequired().HasMaxLength(1000);
        });
    }
}
