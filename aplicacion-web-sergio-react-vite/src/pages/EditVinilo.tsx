import React, { useState, useEffect } from 'react';
import '../styles/EditVinilo.css'; // Importa el archivo CSS
import { useParams, useNavigate } from 'react-router-dom';



interface VinylFormData {
  titulo: string;
  artista: string;
  unidades: string; // Asumiendo que "unidades" es "Año"
  genero: string;
  precio: string;
  descripcion: string;
  imagen: string;
}

const AddVinylScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<VinylFormData>({
    titulo: '',
    artista: '',
    unidades: '',
    genero: '',
    precio: '',
    descripcion: '',
    imagen: '',
  });
  const navigate = useNavigate();

  const [isEditingImage, setIsEditingImage] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const MAX_IMAGEN_LENGTH = 200; // límite defensivo para el campo Imagen (ajusta según DB)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, imagen: e.target.value });
  };

  const handleImageEditConfirm = () => {
    setIsEditingImage(false);
  };

  const handleAdd = () => {
    // Si hay un id, enviar PUT para actualizar
    const save = async () => {
      if (!id) {
        console.warn('No se proporcionó id. No se realizará PUT.');
        return;
      }

      setSaving(true);
      setSaveError(null);
      // Validación local: evitar enviar URLs demasiado largas que truncen en la BD
      if (formData.imagen && formData.imagen.length > MAX_IMAGEN_LENGTH) {
        const msg = `La URL de la imagen es demasiado larga (${formData.imagen.length} caracteres). Máximo permitido: ${MAX_IMAGEN_LENGTH}. Acorta la URL o ajusta la columna Imagen en la base de datos.`;
        console.warn(msg);
        setSaveError(msg);
        setSaving(false);
        return;
      }
      try {
        // Build payload matching C# Producto model
        const payload: any = {
          Nombre: formData.titulo,
          Unidades: String(formData.unidades ?? ''),
          Artista: formData.artista,
          Imagen: formData.imagen,
          Precio: String(formData.precio ?? ''),
          Genero: formData.genero,
          Descripcion: formData.descripcion,
        };

        // Optionally include ID if backend expects it
        const idNum = Number(id);
        if (!Number.isNaN(idNum)) payload.ID = idNum;

        console.debug('PUT payload (Producto):', payload);

        const res = await fetch(`http://localhost:5273/api/Producto/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        console.debug('PUT response ok, status', res.status);

        try {
          if (window.history.length > 1) navigate(-1);
          else navigate('/');
        } catch (e) {
          navigate('/');
        }
      } catch (err: any) {
        console.error('Error actualizando producto:', err);
        setSaveError(err?.message ?? 'No se pudo guardar. Comprueba la API.');
      } finally {
        setSaving(false);
      }
    };

    save();
  };

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchVinilo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5273/api/Producto/${id}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const vinilo = await res.json();

        setFormData({
          titulo: vinilo.Nombre ?? vinilo.nombre ?? vinilo.titulo ?? '',
          artista: vinilo.Artista ?? vinilo.artista ?? '',
          unidades: vinilo.Unidades != null ? String(vinilo.Unidades ?? vinilo.unidades) : '',
          genero: vinilo.Genero ?? vinilo.genero ?? '',
          precio: vinilo.Precio != null ? String(vinilo.Precio ?? vinilo.precio) : '',
          descripcion: vinilo.Descripcion ?? vinilo.descripcion ?? '',
          imagen: vinilo.Imagen ?? vinilo.imagen ?? '',
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching producto:', err);
          setError('No se pudo cargar el vinilo. Comprueba la API.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVinilo();

    return () => controller.abort();
  }, [id]);

  const handleCancel = () => {
    navigate('/'); // Redireccion a paginavinilos
  };

  const handleDelete = () => {
    if (!id) {
      console.warn('No se proporcionó id para eliminar.');
      return;
    }

    // Confirmar antes de eliminar
    if (!window.confirm('¿Estás seguro de que quieres eliminar este vinilo? Esta acción no se puede deshacer.')) {
      return;
    }

    const deleteVinilo = async () => {
      setDeleting(true);
      setDeleteError(null);

      try {
        const res = await fetch(`http://localhost:5273/api/Producto/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        // Después de eliminar, volver a la pantalla anterior si existe, si no ir a '/'
        try {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/');
          }
        } catch (e) {
          navigate('/');
        }
      } catch (err: any) {
        console.error('Error eliminando producto:', err);
        setDeleteError(err?.message ?? 'No se pudo eliminar el vinilo. Comprueba la API.');
      } finally {
        setDeleting(false);
      }
    };

    deleteVinilo();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="formContainer">
          <h1 className="title">Editar Vinilo</h1>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="formContainer">
          <h1 className="title">Editar Vinilo</h1>
          <p style={{ color: 'red' }}>{error}</p>
          <div className="buttonContainer">
            <button onClick={handleCancel} className="button cancelButton">
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="title">Editar Vinilo</h1> {/* Cambié a "Editar Vinilo" como en tu código */}
        {/* Contenedor de las dos columnas */}
        <div className="panelsContainer">
          {/* Columna izquierda */}
          <div className="leftPanel">
            <div className="field">
              <label className="label">Nombre del vinilo</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            <div className="field">
              <label className="label">Artista</label>
              <input
                type="text"
                name="artista"
                value={formData.artista}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            <div className="field">
              <label className="label">Unidades:</label> {/* Asumí que "unidades" es "Año"; cámbialo si es otro campo */}
              <input
                type="number"
                name="unidades"
                value={formData.unidades}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            <div className="field">
              <label className="label">Descripción:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="textarea"
              />
            </div>
            {/* Botón rojo de eliminar vinilo movido aquí, abajo del input de descripción */}
            <div>
              {deleteError && <p style={{ color: 'red', marginBottom: '10px' }}>{deleteError}</p>}
              <button 
                onClick={handleDelete} 
                className="deleteButton" 
                disabled={deleting || saving}
              >
                {deleting ? 'Eliminando...' : 'Eliminar Vinilo'}
              </button>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="rightPanel">
            <div className="field">
              <label className="label">Imagen del Vinilo:</label>
              {isEditingImage ? (
                <input
                  type="text"
                  value={formData.imagen}
                  onChange={handleImageUrlChange}
                  onBlur={handleImageEditConfirm}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleImageEditConfirm();
                    }
                  }}
                  className="input"
                  placeholder="Ingresa la URL de la imagen"
                  autoFocus
                />
              ) : (
                <img
                  src={formData.imagen || 'https://pngimg.com/uploads/vinyl/small/vinyl_PNG59.png'} // Placeholder si no hay URL
                  alt="Imagen del Vinilo"
                  className="image"
                  onClick={() => setIsEditingImage(true)}
                />
              )}
            </div>
            <div className="field">
              <label className="label">Género:</label>
              <input
                type="text"
                name="genero"
                value={formData.genero}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            <div className="field">
              <label className="label">Precio/U:</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Botones abajo del todo del formulario */}
        <div className="buttonContainer">
          {saveError && <p style={{ color: 'red' }}>{saveError}</p>}
          <button onClick={handleAdd} className="button addButton" disabled={saving}>
            {saving ? 'Guardando...' : 'Editar'}
          </button>
          <button onClick={handleCancel} className="button cancelButton" disabled={saving}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVinylScreen;