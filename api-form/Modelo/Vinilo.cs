namespace api_form.Modelo
{
    public class Vinilo
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Autor { get; set; }
        public string Descripcion { get; set; }
        public string Imagen { get; set; }

        public Vinilo() { }

        public Vinilo(string titulo, string autor, string descripcion, string imagen)
        {
            Titulo = titulo;
            Autor = autor;
            Descripcion = descripcion;
            Imagen = imagen;
        }
    }
}