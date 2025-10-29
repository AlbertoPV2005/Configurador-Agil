import React, { useState } from 'react';
import '../styles/AddVinylScreen.css'; // Importa el archivo CSS
import { useNavigate } from 'react-router-dom';

interface VinylFormData {
  titulo: string;
  artista: string;
  genero: string;
  descripcion: string;
  imagen: string;
  precio: string;
  unidades: string;
}

const AddVinylScreen: React.FC = () => {
  const [formData, setFormData] = useState<VinylFormData>({
    titulo: '',
    artista: '',
    genero: '',
    descripcion: '',
    imagen: '',
    precio: '',
    unidades: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
      setFieldErrors({});
      try {
          // Validación local: campos requeridos
          const errors: Record<string, string> = {};
          if (!formData.titulo.trim()) errors.titulo = 'El nombre es obligatorio.';
          if (!formData.artista.trim()) errors.artista = 'El artista es obligatorio.';
          if (!formData.genero.trim()) errors.genero = 'El género es obligatorio.';
          if (!formData.descripcion.trim()) errors.descripcion = 'La descripción es obligatoria.';
          if (!formData.imagen.trim()) errors.imagen = 'La URL de la imagen es obligatoria.';
          if (!formData.precio.trim()) errors.precio = 'El precio es obligatorio.';
          if (!formData.unidades.trim()) errors.unidades = 'Las unidades son obligatorias.';

          // Validación numérica
          const precioNum = formData.precio.trim() === '' ? NaN : Number(formData.precio);
          const unidadesNum = formData.unidades.trim() === '' ? NaN : Number(formData.unidades);
          if (!Number.isFinite(precioNum) || precioNum < 0) errors.precio = 'Precio inválido (>= 0).';
          if (!Number.isFinite(unidadesNum) || unidadesNum < 0 || !Number.isInteger(unidadesNum)) errors.unidades = 'Unidades inválidas (entero >= 0).';

          if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setSaveError('Corrige los errores del formulario antes de enviar.');
            setSaving(false);
            return;
          }

          // Validación adicional: evitar enviar URLs demasiado largas
          if (formData.imagen && formData.imagen.length > MAX_IMAGEN_LENGTH) {
            const msg = `La URL de la imagen es demasiado larga (${formData.imagen.length} caracteres). Máximo permitido: ${MAX_IMAGEN_LENGTH}.`;
            console.warn(msg);
            setSaveError(msg);
            setSaving(false);
            return;
          }

          // Build payload matching C# Producto model - send Precio/Unidades as strings (backend expects strings)
          const payload: any = {
            Nombre: formData.titulo,
            Artista: formData.artista,
            Imagen: formData.imagen,
            Genero: formData.genero,
            Descripcion: formData.descripcion,
            Precio: formData.precio.trim(),
            Unidades: formData.unidades.trim(),
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
                <label className="label">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  className="input"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
                {fieldErrors.precio && <p style={{ color: 'red', marginTop: 6 }}>{fieldErrors.precio}</p>}
              </div>

              <div className="field">
                <label className="label">Unidades</label>
                <input
                  type="number"
                  name="unidades"
                  value={formData.unidades}
                  onChange={handleInputChange}
                  className="input"
                  step="1"
                  min="0"
                  placeholder="0"
                />
                {fieldErrors.unidades && <p style={{ color: 'red', marginTop: 6 }}>{fieldErrors.unidades}</p>}
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