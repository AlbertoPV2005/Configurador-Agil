import React, { useState } from 'react';
import '../styles/AddVinylScreen.css'; // Importa el archivo CSS
import { useNavigate } from 'react-router-dom';

interface VinylFormData {
  titulo: string;
  artista: string;
  genero: string;
  descripcion: string;
  imagen: string;
}

const AddVinylScreen: React.FC = () => {
  const [formData, setFormData] = useState<VinylFormData>({
    titulo: '',
    artista: '',
    genero: '',
    descripcion: '',
    imagen: '',
  });
  const navigate = useNavigate();

  const [isEditingImage, setIsEditingImage] = useState(false); // Estado para controlar si se está editando la URL de la imagen
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const MAX_IMAGEN_LENGTH = 200; // límite defensivo: ajusta según la columna DB

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
    const save = async () => {
      setSaving(true);
      setError(null);
      try {
          // Validación local: evitar enviar URLs demasiado largas que truncen en la BD
          if (formData.imagen && formData.imagen.length > MAX_IMAGEN_LENGTH) {
            const msg = `La URL de la imagen es demasiado larga (${formData.imagen.length} caracteres). Máximo permitido: ${MAX_IMAGEN_LENGTH}. Acorta la URL o cambia la configuración del servidor.`;
            console.warn(msg);
            setSaveError(msg);
            setSaving(false);
            return;
          }
          // Build payload matching C# Producto model
          const payload: any = {
            Nombre: formData.titulo,
            Artista: formData.artista,
            Imagen: formData.imagen,
            Genero: formData.genero,
            Descripcion: formData.descripcion,
          };

          console.debug('POST payload (Producto):', payload);

          const res = await fetch('http://localhost:5273/api/Producto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
          }

          // Opcional: leer respuesta con el recurso creado
          // const created = await res.json();

          // Ir a la página anterior o al listado
          try {
            if (window.history.length > 1) navigate(-1);
            else navigate('/');
          } catch (e) {
            navigate('/');
          }
        } catch (err: any) {
          console.error('Error creando producto:', err);
          setSaveError(err?.message ?? 'No se pudo crear el vinilo. Comprueba la API.');
        } finally {
          setSaving(false);
        }
    };

    save();
  };

  const handleCancel = () => {
  navigate('/'); // Redireccion a paginavinilos
};

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="title">Añadir Vinilo</h1>
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
              <label className="label">Descripción:</label> {/* Movido abajo de "Año (Unidades)" */}
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="textarea"
              />
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

          </div>
        </div>

        {/* Botones abajo del todo del formulario */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {saveError && <p style={{ color: 'red' }}>{saveError}</p>}
        <div className="buttonContainer">
          <button onClick={handleAdd} className="button addButton" disabled={saving}>
            {saving ? 'Guardando...' : 'Añadir'}
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