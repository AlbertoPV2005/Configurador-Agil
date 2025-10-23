using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_form.Domain.Entities
{
    [Table("clientes")]
    public class Cliente
    {
        [Key]
        [Column("id_cliente")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdCliente { get; set; }

        [Column("membresia")]
        public string Membresia { get; set; }

        [Column("dni")]
        public string DNI { get; set; }

        public Cliente() { }
    }
}
