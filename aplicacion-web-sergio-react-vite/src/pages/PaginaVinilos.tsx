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
import vinilosData from './data/vinilos.json';
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
    // Adaptar vinilos
    const adaptados: Vinyl[] = vinilosData.map((item, index) => ({
      id: index + 1,
      title: `${item.nombre} - ${item.artista}`,
      image: item.imagen
    }));
    setVinilos(adaptados);
    setLoading(false);

    // Combinar usuarios
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
  }, []);

  const abrirDialogo = () => setIsDialogOpen(true);
  const cerrarDialogo = () => setIsDialogOpen(false);

  const confirmarUsuario = () => {
    const encontrado = usuariosCompletos.find((u) => u.dni === usuarioSeleccionado);
    setUsuarioActivo(encontrado || null);
    cerrarDialogo();
  };

  return (
    <div className="pagina-vinilos">
      <div className="encabezado">
        <h1 className="titulo">Lista de registros</h1>

        {/* Mostrar botón solo si el usuario activo es empleado */}
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
                {/* Botón de editar solo visible para empleados */}
                {usuarioActivo?.tipo === 'Empleado' && (
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

      {/* Modal de selección de usuario */}
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