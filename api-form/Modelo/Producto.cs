using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_form.Modelo
{
    [Table("Productos")]
    public class Producto
    {
        [Key]
        [Column("ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; }

        [Column("Unidades")]
        public string Unidades { get; set; }

        [Column("Artista")]
        public string Artista { get; set; }

        [Column("Imagen")]
        public string Imagen { get; set; }

        [Column("Precio")]
        public string Precio { get; set; }

        [Column("Genero")]
        public string Genero { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; }

        public Producto() { }
    }
}