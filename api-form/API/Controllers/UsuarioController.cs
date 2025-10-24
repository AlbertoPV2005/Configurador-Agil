using Microsoft.AspNetCore.Mvc;
using api_form.Domain.Entities;
using api_form.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api_form.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public UsuarioController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            var list = await _db.Usuarios.ToListAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(string id)
        {
            var usuario = await _db.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        // Endpoint para conocer si el usuario es cliente y/o empleado
        [HttpGet("{id}/tipo")]
        public async Task<ActionResult<object>> GetUsuarioTipo(string id)
        {
            var usuarioExiste = await _db.Usuarios.AnyAsync(u => u.DNI == id);
            if (!usuarioExiste)
            {
                return NotFound();
            }

            var esCliente = await _db.Clientes.AnyAsync(c => c.DNI == id);
            var esEmpleado = await _db.Empleados.AnyAsync(e => e.DNI == id);

            var tipo = esCliente && esEmpleado
                ? "ClienteEmpleado"
                : esCliente
                    ? "Cliente"
                    : esEmpleado
                        ? "Empleado"
                        : "Ninguno";

            return Ok(new { dni = id, esCliente, esEmpleado, tipo });
        }

        [HttpGet("tipo")]
        public async Task<ActionResult<IEnumerable<object>>> GetTiposUsuarios()
        {
            var usuarios = await _db.Usuarios
                .Select(u => new { u.DNI, u.Nombre })
                .ToListAsync();

            var clienteDnis = await _db.Clientes.Select(c => c.DNI).ToListAsync();
            var empleadoDnis = await _db.Empleados.Select(e => e.DNI).ToListAsync();

            var clienteSet = new HashSet<string>(clienteDnis);
            var empleadoSet = new HashSet<string>(empleadoDnis);

            var result = usuarios.Select(u =>
            {
                var esCliente = clienteSet.Contains(u.DNI);
                var esEmpleado = empleadoSet.Contains(u.DNI);
                var tipo = esCliente && esEmpleado
                    ? "ClienteEmpleado"
                    : esCliente
                        ? "Cliente"
                        : esEmpleado
                            ? "Empleado"
                            : "Ninguno";

                return new { dni = u.DNI, nombre = u.Nombre, esCliente, esEmpleado, tipo };
            });

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            await _db.Usuarios.AddAsync(usuario);
            await _db.SaveChangesAsync();
            return CreatedAtAction("GetUsuario", new { id = usuario.DNI }, usuario);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(string id, Usuario usuario)
        {
            if (id != usuario.DNI)
            {
                return BadRequest();
            }

            _db.Usuarios.Update(usuario);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(string id)
        {
            var entity = await _db.Usuarios.FindAsync(id);
            if (entity is null) return NotFound();
            _db.Usuarios.Remove(entity);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}