using Microsoft.AspNetCore.Mvc;
using api_form.Domain.Entities;
using api_form.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api_form.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductoController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ProductoController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            var list = await _db.Productos.ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _db.Productos.FindAsync(id);

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

            var productos = await _db.Productos
                                     .OrderBy(p => p.ID)
                                     .Skip(inicio)
                                     .Take(final - inicio)
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
            await _db.Productos.AddAsync(producto);
            await _db.SaveChangesAsync();
            return CreatedAtAction("GetProducto", new { id = producto.ID }, producto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, Producto producto)
        {
            if (id != producto.ID)
            {
                return BadRequest();
            }

            _db.Productos.Update(producto);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var entity = await _db.Productos.FindAsync(id);
            if (entity is null) return NotFound();
            _db.Productos.Remove(entity);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}