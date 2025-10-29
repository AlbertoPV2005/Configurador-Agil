import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditVinilo.css';

interface VinylFormData {
  id: string;
  titulo: string;
  artista: string;
  genero: string;
  descripcion: string;
  imagen: string;
  precio: string;
  unidades: string;
}

const InfoVinilo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VinylFormData>({
    id: '',
    titulo: '',
    artista: '',
    genero: '',
    descripcion: '',
    imagen: '',
    precio: '',
    unidades: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditingImage, setIsEditingImage] = useState(false);

  // Cargar datos del vinilo según el id desde la API
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

        // Mapear respuesta API a los campos del form (soportando PascalCase y camelCase)
        setFormData({
          id: vinilo.ID != null ? String(vinilo.ID ?? vinilo.id ?? vinilo.idProducto ?? '') : String(vinilo.id ?? vinilo.idProducto ?? ''),
          titulo: vinilo.Nombre ?? vinilo.nombre ?? vinilo.titulo ?? '',
          artista: vinilo.Artista ?? vinilo.artista ?? '',
          genero: vinilo.Genero ?? vinilo.genero ?? '',
          descripcion: vinilo.Descripcion ?? vinilo.descripcion ?? '',
          imagen: vinilo.Imagen ?? vinilo.imagen ?? '',
          precio: (vinilo.Precio ?? vinilo.precio ?? '')?.toString?.() ?? '',
          unidades: (vinilo.Unidades ?? vinilo.unidades ?? '')?.toString?.() ?? '',
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

  const handleSave = () => {
    console.log('Guardando cambios:', formData);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleDelete = () => {
    console.log('Eliminando vinilo:', id);
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
  };

  if (loading) {
    return (
      <div className="container">
        <div className="formContainer">
          <h1 className="title">Informacion de Vinilo</h1>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="formContainer">
          <h1 className="title">Informacion de Vinilo</h1>
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
        <h1 className="title">Informacion de Vinilo</h1>

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
                disabled
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
                disabled
              />
            </div>

              <div className="field">
                <label className="label">Precio</label>
                <input
                  type="text"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  className="input"
                  disabled
                />
              </div>

              <div className="field">
                <label className="label">Unidades</label>
                <input
                  type="text"
                  name="unidades"
                  value={formData.unidades}
                  onChange={handleInputChange}
                  className="input"
                  disabled
                />
              </div>

            <div className="field">
              <label className="label">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="textarea"
                disabled
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="rightPanel">
            <div className="field">
              <label className="label">Imagen del Vinilo</label>
              {isEditingImage ? (
                <input
                  type="text"
                  value={formData.imagen}
                  onChange={handleImageUrlChange}
                  onBlur={handleImageEditConfirm}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleImageEditConfirm();
                  }}
                  className="input"
                  placeholder="URL de la imagen"
                  autoFocus
                />
              ) : (
                <img
                  src={formData.imagen || 'https://pngimg.com/uploads/vinyl/small/vinyl_PNG59.png'}
                  alt="Imagen del Vinilo"
                  className="image"
                />
              )}
            </div>
            <div className="field">
              <label className="label">Género</label>
              <input
                type="text"
                name="genero"
                value={formData.genero}
                onChange={handleInputChange}
                className="input"
                disabled
              />
            </div>

          </div>
        </div>

        <div className="buttonContainer">
          <button onClick={handleCancel} className="button cancelButton">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoVinilo;