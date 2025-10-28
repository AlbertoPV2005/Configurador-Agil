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
// removed: import vinilosData from './data/vinilos.json';
import usuarios from './data/usuarios.json';
import clientes from './data/clientes.json';
import empleados from './data/empleados.json';

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

    // Combinar usuarios (igual que antes)
    const combinados: UsuarioExtendido[] = usuarios.map((usuario) => {
      const cliente = clientes.find((c) => c.dni === usuario.dni);
      const empleado = empleados.find((e) => e.dni === usuario.dni);

      return {
        ...usuario,
        tipo: cliente ? 'Cliente' : empleado ? 'Empleado' : 'Sin rol',
        detalles: cliente || empleado || null
      };
    });
    setUsuariosCompletos(combinados);

    // Restaurar usuario activo desde localStorage si existe
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

  return (
    <div className="pagina-vinilos">
      <div className="encabezado">
        <h1 className="titulo">Lista de registros</h1>

        {usuarioActivo?.tipo === 'Empleado' && (
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
                {usuarioActivo?.tipo === 'Empleado' && (
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