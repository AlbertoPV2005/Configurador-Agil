import React, { useState, useEffect } from 'react';
import {
  PrimaryButton,
  Dialog,
  DialogType,
  DialogFooter,
  DefaultButton
} from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import '../styles/catalogo.css';
// ...existing code...
// NOTE: previously this file used local JSON fixtures. They are removed and replaced
// with API calls to the SQL-backed endpoints as requested.

interface Vinyl {
  id: number;
  title: string;
  image: string;
}

interface UsuarioBase {
  dni: string;
  email: string;
  nombre: string;
  contrasena: string;
}

interface Cliente {
  idCliente: number;
  membresia: string;
  dni: string;
}

interface Empleado {
  idEmpleado: number;
  dni: string;
  cargo: string;
  sueldo: number;
}

interface UsuarioExtendido extends UsuarioBase {
  tipo: string;
  detalles: Cliente | Empleado | null;
}

const PaginaVinilos: React.FC = () => {
  const navigate = useNavigate();
  const [vinilos, setVinilos] = useState<Vinyl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string | null>(null);
  const [usuariosCompletos, setUsuariosCompletos] = useState<UsuarioExtendido[]>([]);
  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioExtendido | null>(null);
  // Estado para el tipo de usuario obtenido desde la API
  const [userType, setUserType] = useState<string | null>(null);
  const [userTypeLoading, setUserTypeLoading] = useState<boolean>(true);
  const [userTypeError, setUserTypeError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchVinilos = async () => {
      try {
        const res = await fetch('http://localhost:5273/api/Producto');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!mounted) return;

        // Adaptar respuesta de la API al tipo Vinyl esperado
        const adaptados: Vinyl[] = (Array.isArray(data) ? data : []).map((item: any, index: number) => ({
          id: item.id ?? item.idProducto ?? index + 1,
          title:
            item.nombre && item.artista
              ? `${item.nombre} - ${item.artista}`
              : item.title ?? item.nombre ?? `Vinilo ${index + 1}`,
          image: item.imagen ?? item.imagenUrl ?? item.image ?? ''
        }));

        setVinilos(adaptados);
      } catch (error) {
        console.error('Error cargando vinilos desde la API:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchVinilos();

    // Obtener usuarios, clientes y empleados desde la API (SQL) y combinarlos
    const fetchUsuariosYRelaciones = async () => {
      try {
        const [resUsuarios, resClientes, resEmpleados] = await Promise.all([
          fetch('http://localhost:5273/api/Usuario'),
          fetch('http://localhost:5273/api/Cliente'),
          fetch('http://localhost:5273/api/Empleado')
        ]);

        const usuariosData = resUsuarios.ok ? await resUsuarios.json() : [];
        const clientesData = resClientes.ok ? await resClientes.json() : [];
        const empleadosData = resEmpleados.ok ? await resEmpleados.json() : [];

        const combinados: UsuarioExtendido[] = Array.isArray(usuariosData)
          ? usuariosData.map((usuario: any) => {
              const cliente = Array.isArray(clientesData) ? clientesData.find((c: any) => c.dni === usuario.dni) : null;
              const empleado = Array.isArray(empleadosData) ? empleadosData.find((e: any) => e.dni === usuario.dni) : null;

              return {
                ...usuario,
                tipo: cliente ? 'Cliente' : empleado ? 'Empleado' : 'Sin rol',
                detalles: cliente || empleado || null
              };
            })
          : [];

        if (mounted) setUsuariosCompletos(combinados);

        // Restaurar usuario activo desde localStorage si existe y aún está presente en la lista
        try {
          const stored = localStorage.getItem('usuarioActivo');
          if (stored) {
            const parsed: UsuarioExtendido = JSON.parse(stored);
            const existe = combinados.find((u: UsuarioExtendido) => u.dni === parsed.dni);
            if (existe) {
              setUsuarioActivo(parsed);
            } else {
              localStorage.removeItem('usuarioActivo');
            }
          }
        } catch (e) {
          localStorage.removeItem('usuarioActivo');
        }
      } catch (err) {
        console.error('Error cargando usuarios/clientes/empleados desde la API:', err);
        if (mounted) setUsuariosCompletos([]);
      }
    };

    fetchUsuariosYRelaciones();

    return () => {
      mounted = false;
    };
  }, []);

  // Obtener el tipo de usuario desde la API y usarlo para condicionar permisos
  useEffect(() => {
    let mounted = true;

    const fetchUserType = async () => {
      try {
        setUserTypeLoading(true);
        const res = await fetch('http://localhost:5273/api/Usuario/tipo');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // La API puede devolver un string plano o un JSON; intentamos leer como texto y limpiar comillas
        const raw = await res.text();
        const tipo = raw ? raw.replace(/^\"|\"$/g, '').trim() : null;

        if (!mounted) return;
        setUserType(tipo);
      } catch (err) {
        console.error('Error obteniendo tipo de usuario desde API:', err);
        if (mounted) setUserTypeError('No se pudo obtener el tipo de usuario desde la API.');
      } finally {
        if (mounted) setUserTypeLoading(false);
      }
    };

    fetchUserType();

    return () => {
      mounted = false;
    };
  }, []);

  const abrirDialogo = () => setIsDialogOpen(true);
  const cerrarDialogo = () => setIsDialogOpen(false);

  const confirmarUsuario = () => {
    const encontrado = usuariosCompletos.find((u) => u.dni === usuarioSeleccionado);
    setUsuarioActivo(encontrado || null);
    try {
      if (encontrado) {
        localStorage.setItem('usuarioActivo', JSON.stringify(encontrado));
      } else {
        localStorage.removeItem('usuarioActivo');
      }
    } catch (e) {}
    cerrarDialogo();
  };

  // Determina si el usuario tiene rol de empleado: ya sea desde la API o desde la selección local
  const isEmpleado = (userType === 'Empleado') || (usuarioActivo?.tipo === 'Empleado');

  return (
    <div className="pagina-vinilos">
      <div className="encabezado">
        <h1 className="titulo">Lista de registros</h1>

        {isEmpleado && (
          <PrimaryButton
            text="Añadir producto"
            className="boton-anadir"
            onClick={() => navigate('/add')}
          />
        )}

        <PrimaryButton
          text="Elegir usuario"
          className="boton-anadir"
          onClick={abrirDialogo}
        />
      </div>

  {userTypeLoading && <p className="cargando">Verificando permisos...</p>}
  {userTypeError && <p style={{ color: 'red' }}>{userTypeError}</p>}

      {usuarioActivo && (
        <p className="usuario-activo">
          Usuario activo: <strong>{usuarioActivo.nombre}</strong> ({usuarioActivo.tipo})
        </p>
      )}

      {loading ? (
        <p className="cargando">Cargando vinilos...</p>
      ) : (
        <div className="lista-vinilos">
          {vinilos.map((vinilo) => (
            <div
              key={vinilo.id}
              className="tarjeta-vinilo"
              onClick={() => navigate(`/${vinilo.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img src={vinilo.image} alt={vinilo.title} className="imagen-vinilo" />
              <div className="vinilo-info">
                <p className="nombre-vinilo">{vinilo.title}</p>
                {isEmpleado && (
                  <PrimaryButton
                    text="Editar"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit/${vinilo.id}`);
                    }}
                    styles={{ root: { fontSize: '12px', padding: '4px 8px' } }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        hidden={!isDialogOpen}
        onDismiss={cerrarDialogo}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: 'Selecciona un usuario',
        }}
        modalProps={{ isBlocking: false }}
      >
        <div>
          {usuariosCompletos.map((usuario, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <input
                type="radio"
                id={`usuario-${index}`}
                name="usuario"
                value={usuario.dni}
                checked={usuarioSeleccionado === usuario.dni}
                onChange={() => setUsuarioSeleccionado(usuario.dni)}
              />
              <label htmlFor={`usuario-${index}`} style={{ marginLeft: '8px' }}>
                {usuario.nombre} ({usuario.tipo})
              </label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <PrimaryButton onClick={confirmarUsuario} text="Confirmar" />
          <DefaultButton onClick={cerrarDialogo} text="Cancelar" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default PaginaVinilos;