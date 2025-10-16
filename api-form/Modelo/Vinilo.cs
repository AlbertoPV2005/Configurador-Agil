namespace api_form.Modelo
{
    public class Vinilo
    {
        public string ID_Vinilo { get; set; }
        public string Nombre { get; set; }
        public string Unidades { get; set; }
        public string Artista { get; set; }
        public string Imagen { get; set; }
        public string Precio { get; set; }
        public string Genero { get; set; }
        public string Descripcion { get; set; }

       

        // Constructor con parámetros
        public Vinilo(string idVinilo, string nombre, string unidades, string artista,
                      string imagen, string precio, string genero, string descripcion)
        {
            ID_Vinilo = idVinilo;
            Nombre = nombre;
            Unidades = unidades;
            Artista = artista;
            Imagen = imagen;
            Precio = precio;
            Genero = genero;
            Descripcion = descripcion;
        }
    }
}
