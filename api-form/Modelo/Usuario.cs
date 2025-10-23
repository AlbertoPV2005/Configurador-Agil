using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_form.Modelo
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

        // Constructor vacío (necesario para serialización JSON)
        public Usuario() { }
    }
}