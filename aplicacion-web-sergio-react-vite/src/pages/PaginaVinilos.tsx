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
interface ProductoApi {
  id: number;
  nombre: string;
  artista: string;
  imagen: string;
  precio: string;
}

interface Vinyl {
  id: number;
  title: string;
  image: string;
}
interface UsuarioTipo {
  dni: string;
  nombre: string;
  esCliente: boolean;
  esEmpleado: boolean;
  tipo: string;
}

const API_BASE_URL = 'https://localhost:7019/api';

const PaginaVinilos: React.FC = () => {
  const navigate = useNavigate();
  const [vinilos, setVinilos] = useState<Vinyl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<string | null>(null);
  const [usuariosCompletos, setUsuariosCompletos] = useState<UsuarioTipo[]>([]);
  
  // Cargar usuario desde localStorage al iniciar
  const [usuarioActivo, setUsuarioActivoState] = useState<UsuarioTipo | null>(() => {
    const saved = localStorage.getItem('usuarioActivo');
    return saved ? JSON.parse(saved) : null;
  });

  // Función para guardar usuario en localStorage
  const setUsuarioActivo = (usuario: UsuarioTipo | null) => {
    setUsuarioActivoState(usuario);
    if (usuario) {
      localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuarioActivo');
    }
  };

  useEffect(() => {
    const cargarVinilos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/Producto/0-20`);
        if (!res.ok) throw new Error('Error al cargar productos');
        const productos: ProductoApi[] = await res.json();

        const adaptados: Vinyl[] = productos.map((p) => ({
          id: p.id,
          title: `${p.nombre} - ${p.artista}`,
          image: p.imagen,
        }));

        setVinilos(adaptados);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    cargarVinilos();
  }, []);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/Usuario/tipo`);
        if (!res.ok) throw new Error('Error al cargar usuarios');
        const usuarios: UsuarioTipo[] = await res.json();
        setUsuariosCompletos(usuarios);
      } catch (e) {
        console.error('Error cargando usuarios:', e);
      }
    };

    cargarUsuarios();
  }, []);

  const abrirDialogo = () => setIsDialogOpen(true);
  const cerrarDialogo = () => setIsDialogOpen(false);

  const confirmarUsuario = () => {
    const encontrado = usuariosCompletos.find((u) => u.dni === usuarioSeleccionado);
    setUsuarioActivo(encontrado || null);
    // Persistir selección para que, al navegar fuera y volver, el rol se mantenga
    try {
      if (encontrado) {
        localStorage.setItem('usuarioActivo', JSON.stringify(encontrado));
      } else {
        localStorage.removeItem('usuarioActivo');
      }
    } catch (e) {
      // ignorar errores de storage
    }
    cerrarDialogo();
  };

  return (
    <div className="pagina-vinilos">
      <div className="encabezado">
        <h1 className="titulo">Lista de registros</h1>

        {usuarioActivo?.esEmpleado && (
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
                {usuarioActivo?.esEmpleado && (
                  <PrimaryButton
                    text="Editar"
                    onClick={(e) => {
                      e.stopPropagation(); // evita que se dispare el click de la tarjeta
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

      <div className="paginacion">
        <PrimaryButton text="Anterior" disabled />
        <div className="numeros-pagina">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>...</span>
          <span>67</span>
          <span>68</span>
        </div>
        <PrimaryButton text="Siguiente" />
      </div>

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