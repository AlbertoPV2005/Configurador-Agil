using api_form.Modelo;
using api_form.Data;
using Microsoft.EntityFrameworkCore;

namespace api_form.Services
{
    public class ViniloService
    {
        private readonly ApplicationDbContext _context;

        public ViniloService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task InsertViniloAsync(Vinilo vinilo)
        {
            _context.Vinilos.Add(vinilo);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Vinilo>> GetAllVinilosAsync()
        {
            return await _context.Vinilos.ToListAsync();
        }

        public async Task<bool> UpdateViniloAsync(Vinilo vinilo)
        {
            var existente = await _context.Vinilos.FindAsync(vinilo.Id);
            if (existente == null) return false;

            existente.Titulo = vinilo.Titulo;
            existente.Autor = vinilo.Autor;
            existente.Descripcion = vinilo.Descripcion;
            existente.Imagen = vinilo.Imagen;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteViniloAsync(int id)
        {
            var vinilo = await _context.Vinilos.FindAsync(id);
            if (vinilo == null) return false;

            _context.Vinilos.Remove(vinilo);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}