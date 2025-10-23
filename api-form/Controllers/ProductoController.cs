using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api_form.Modelo;
using api_form.Data;

namespace api_form.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductoController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            return await _context.Productos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);

            if (producto == null)
            {
                return NotFound();
            }

            return producto;
        }


        [HttpGet("{inicio}-{final}")]
        public async Task<ActionResult<IEnumerable<Producto>>> GetRangoProductos(int inicio, int final)
        {
            if (inicio < 0 || final < 0 || inicio > final)
            {
                return BadRequest("El rango especificado no es válido.");
            }

            var productos = await _context.Productos
                                          .OrderBy(p => p.ID) // Aseguramos un orden consistente
                                          .Skip(inicio)       // Omitimos los primeros 'inicio' elementos
                                          .Take(final - inicio + 1) // Tomamos los elementos dentro del rango
                                          .ToListAsync();

            if (!productos.Any())
            {
                return NotFound("No se encontraron productos en el rango especificado.");
            }

            return productos;
        }


        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto(Producto producto)
        {
            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProducto", new { id = producto.ID }, producto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, Producto producto)
        {
            if (id != producto.ID)
            {
                return BadRequest();
            }

            _context.Entry(producto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductoExists(int id)
        {
            return _context.Productos.Any(e => e.ID == id);
        }
    }
}