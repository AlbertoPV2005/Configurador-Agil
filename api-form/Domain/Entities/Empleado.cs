using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_form.Domain.Entities
{
    [Table("empleado")]
    public class Empleado
    {
        [Key]
        [Column("id_empleado")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdEmpleado { get; set; }

        [Column("dni")]
        public string DNI { get; set; }

        [Column("cargo")]
        public string Cargo { get; set; }

        [Column("sueldo")]
        public decimal Sueldo { get; set; }

        public Empleado() { }
    }
}
