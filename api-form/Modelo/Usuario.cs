using System.ComponentModel.DataAnnotations;

namespace api_form.Modelo
{
    public class Usuario
    {
        [Key]
        public string DNI { get; set; }
        public string Email { get; set; }
        public string Nombre { get; set; }
        public string Contrasena { get; set; }

        // Constructor con parámetros
        public Usuario(string dni, string email, string nombre, string contrasena)
        {
            DNI = dni;
            Email = email;
            Nombre = nombre;
            Contrasena = contrasena;
        }

        // Constructor vacío (necesario para serialización JSON)
        public Usuario() { }
    }
}