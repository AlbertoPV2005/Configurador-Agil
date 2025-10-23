using Microsoft.EntityFrameworkCore;
using api_form.Modelo;

namespace api_form.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Empleado> Empleados { get; set; }
        public DbSet<Producto> Productos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>().ToTable("Usuarios");
            modelBuilder.Entity<Cliente>().ToTable("clientes");
            modelBuilder.Entity<Empleado>().ToTable("empleado");
            modelBuilder.Entity<Producto>().ToTable("Productos");
        }
    }
}