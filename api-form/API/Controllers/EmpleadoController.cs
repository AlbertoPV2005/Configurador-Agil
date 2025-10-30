using Microsoft.AspNetCore.Mvc;
using api_form.Domain.Entities;
using api_form.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api_form.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadoController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public EmpleadoController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Empleado>>> GetEmpleados()
        {
            var list = await _db.Empleados.ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Empleado>> GetEmpleado(int id)
        {
            var empleado = await _db.Empleados.FindAsync(id);

            if (empleado == null)
            {
                return NotFound();
            }

            return empleado;
        }

        [HttpGet("dni/{dni}")]
        public async Task<ActionResult<Empleado>> GetEmpleadoPorDni(string dni)
        {
            var empleado = await _db.Empleados.FirstOrDefaultAsync(e => e.DNI == dni);
            if (empleado == null)
            {
                return NotFound();
            }

            return empleado;
        }

        [HttpPost]
        public async Task<ActionResult<Empleado>> PostEmpleado(Empleado empleado)
        {
            await _db.Empleados.AddAsync(empleado);
            await _db.SaveChangesAsync();
            return CreatedAtAction("GetEmpleado", new { id = empleado.IdEmpleado }, empleado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmpleado(int id, Empleado empleado)
        {
            if (id != empleado.IdEmpleado)
            {
                return BadRequest();
            }

            _db.Empleados.Update(empleado);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmpleado(int id)
        {
            var entity = await _db.Empleados.FindAsync(id);
            if (entity is null) return NotFound();
            _db.Empleados.Remove(entity);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}