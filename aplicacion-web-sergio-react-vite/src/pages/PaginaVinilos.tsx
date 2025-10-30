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
import api from '../api/client';
import type { Producto } from '../api/producto';
import { UsuarioApi, UsuarioTipoDTO } from '../api/usuario';

interface Vinyl {
  id: number;
  title: string;
  image: string;
}

type UsuarioExtendido = UsuarioTipoDTO;

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
        const { data } = await api.get<Producto[]>('/Producto');

        if (!mounted) return;

        const adaptados: Vinyl[] = (Array.isArray(data) ? data : []).map((item, index) => ({
          id: item.id ?? index + 1,
          title: item.nombre && item.artista ? `${item.nombre} - ${item.artista}` : item.nombre ?? `Vinilo ${index + 1}`,
          image: item.imagen ?? ''
        }));

        setVinilos(adaptados);
      } catch (error) {
        console.error('Error fetching vinilos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVinilos();

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

  const isEmpleado = usuarioActivo?.esEmpleado === true || usuarioActivo?.tipo === 'Empleado';

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