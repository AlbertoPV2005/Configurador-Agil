using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_form.Domain.Entities
{
    [Table("Usuarios")]
    public class Usuario
    {
        [Key]
        [Column("DNI")]
        public string DNI { get; set; }
        [Column("Email")]
        public string Email { get; set; }
        [Column("Nombre")]
        public string Nombre { get; set; }
        [Column("Contrasena")]
        public string Contrasena { get; set; }

        public Usuario(string dni, string email, string nombre, string contrasena)
        {
            DNI = dni;
            Email = email;
            Nombre = nombre;
            Contrasena = contrasena;
        }

        public Usuario() { }
    }
}
