using backend.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Business> Businesses { get; set; }
    public DbSet<BusinessAddress> BusinessAddresses { get; set; }
    public DbSet<BusinessRepresentative> BusinessRepresentatives { get; set; }
    public DbSet<BusinessRequirementInfo> BusinessRequirementInfos { get; set; }
    public DbSet<CbOption> CbOptions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure table names to match your database
        modelBuilder.Entity<User>().ToTable("tb_users");
        modelBuilder.Entity<Business>().ToTable("tb_business_name_info");
        modelBuilder.Entity<BusinessAddress>().ToTable("tb_business_address");
        modelBuilder.Entity<BusinessRepresentative>().ToTable("tb_business_representative");
        modelBuilder.Entity<BusinessRequirementInfo>().ToTable("tb_business_requirement_info");
        modelBuilder.Entity<CbOption>().ToTable("tb_cboptions");

        // Configure primary keys
        modelBuilder.Entity<User>().HasKey(u => u.Id);
        modelBuilder.Entity<Business>().HasKey(b => b.Id);
        modelBuilder.Entity<BusinessAddress>().HasKey(ba => ba.Id);
        modelBuilder.Entity<BusinessRepresentative>().HasKey(br => br.Id);
        modelBuilder.Entity<BusinessRequirementInfo>().HasKey(bri => bri.Id);
        modelBuilder.Entity<CbOption>().HasKey(co => co.Id);
    }
}