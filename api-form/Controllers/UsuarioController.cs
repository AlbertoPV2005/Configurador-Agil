using Microsoft.AspNetCore.Mvc;
using api_form.Modelo;

namespace api_form.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        [HttpGet]
        public ActionResult<Usuario> GetUsuario()
        {
            // Usuario de prueba incrustado
            var usuario = new Usuario(
                "123456789T",
                "emai@email.com",
                "juanito",
                "juanito123"
            );

            return Ok(usuario);
        }
    }
}