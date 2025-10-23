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