using Microsoft.AspNetCore.Mvc;
using api_form.Modelo;
using api_form.Services;

namespace api_form.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VinilosController : ControllerBase
    {
        private readonly ViniloService _service;

        public VinilosController(ViniloService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> PostVinilo([FromBody] Vinilo vinilo)
        {
            await _service.InsertViniloAsync(vinilo);
            return Ok("Vinilo insertado correctamente");
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vinilo>>> GetVinilos()
        {
            var vinilos = await _service.GetAllVinilosAsync();
            return Ok(vinilos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutVinilo(int id, [FromBody] Vinilo vinilo)
        {
            if (id != vinilo.Id)
            {
                return BadRequest("El ID del vinilo no coincide.");
            }

            var actualizado = await _service.UpdateViniloAsync(vinilo);
            if (!actualizado)
            {
                return NotFound("Vinilo no encontrado.");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVinilo(int id)
        {
            var eliminado = await _service.DeleteViniloAsync(id);
            if (!eliminado)
            {
                return NotFound("Vinilo no encontrado.");
            }

            return NoContent();
        }
    }
}