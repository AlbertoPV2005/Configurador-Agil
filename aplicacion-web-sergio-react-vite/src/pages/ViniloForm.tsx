import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditVinilo.css';

interface VinylFormData {
  id: number;
  nombre: string;
  unidades: string;
  artista: string;
  imagen: string;
  precio: string;
  genero: string;
  descripcion: string;
}

interface ViniloFormProps {
  modo: 'add' | 'edit' | 'view';
}

const API_BASE_URL = 'https://localhost:7019/api';

const ViniloForm: React.FC<ViniloFormProps> = ({ modo }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VinylFormData>({
    id: 0,
    nombre: '',
    unidades: '',
    artista: '',
    imagen: '',
    precio: '',
    genero: '',
    descripcion: '',
  });

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isViewMode = modo === 'view';
  const isEditMode = modo === 'edit';
  const isAddMode = modo === 'add';

  // Cargar datos del producto si estamos en modo edición o visualización
  useEffect(() => {
    if ((isEditMode || isViewMode) && id) {
      cargarProducto();
    }
  }, [id, modo]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/Producto/${id}`);
      
      if (!res.ok) throw new Error('Error al cargar el producto');
      
      const producto: VinylFormData = await res.json();
      setFormData(producto);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error cargando producto:', err);
    } finally {
      setLoading(false);
    }
  };

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

  // POST - Crear nuevo producto
  const handleAdd = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/Producto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Error al crear el producto');
      
      console.log('Producto creado exitosamente');
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al añadir');
      console.error('Error añadiendo producto:', err);
    } finally {
      setLoading(false);
    }
  };

  // PUT - Actualizar producto existente
  const handleEdit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/Producto/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Error al actualizar el producto');
      
      console.log('Producto actualizado exitosamente');
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al editar');
      console.error('Error editando producto:', err);
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Eliminar producto
  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este vinilo?')) return;

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`${API_BASE_URL}/Producto/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar el producto');
      
      console.log('Producto eliminado exitosamente');
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
      console.error('Error eliminando producto:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmit = () => {
    if (isAddMode) {
      handleAdd();
    } else if (isEditMode) {
      handleEdit();
    }
  };

  if (loading && !isAddMode) {
    return (
      <div className="container">
        <div className="formContainer">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="title">
          {isAddMode ? 'Añadir Vinilo' : isEditMode ? 'Editar Vinilo' : 'Información de Vinilo'}
        </h1>

        {error && (
          <div style={{ color: 'red', marginBottom: '16px', padding: '8px', border: '1px solid red' }}>
            {error}
          </div>
        )}

        <div className="panelsContainer">
          {/* Columna izquierda */}
          <div className="leftPanel">
            <div className="field">
              <label className="label">Nombre del vinilo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="input"
                disabled={isViewMode}
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
                disabled={isViewMode}
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
                disabled={isViewMode}
              />
            </div>
            <div className="field">
              <label className="label">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="textarea"
                disabled={isViewMode}
              />
            </div>

            {/* Botón eliminar solo en modo edición */}
            {isEditMode && (
              <button onClick={handleDelete} className="deleteButton" disabled={loading}>
                {loading ? 'Eliminando...' : 'Eliminar Vinilo'}
              </button>
            )}
          </div>

          {/* Columna derecha */}
          <div className="rightPanel">
            <div className="field">
              <label className="label">Imagen del Vinilo</label>
              {isEditingImage && !isViewMode ? (
                <input
                  type="text"
                  value={formData.imagen}
                  onChange={handleImageUrlChange}
                  onBlur={handleImageEditConfirm}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleImageEditConfirm();
                  }}
                  className="input"
                  placeholder="Ingresa la URL de la imagen"
                  autoFocus
                />
              ) : (
                <img
                  src={formData.imagen || 'https://pngimg.com/uploads/vinyl/small/vinyl_PNG59.png'}
                  alt="Imagen del Vinilo"
                  className="image"
                  onClick={() => !isViewMode && setIsEditingImage(true)}
                  style={{ cursor: isViewMode ? 'default' : 'pointer' }}
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
                disabled={isViewMode}
              />
            </div>
            <div className="field">
              <label className="label">Precio/U</label>
              <input
                type="text"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                className="input"
                disabled={isViewMode}
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="buttonContainer">
          {!isViewMode && (
            <button onClick={handleSubmit} className="button addButton" disabled={loading}>
              {loading ? 'Procesando...' : isAddMode ? 'Añadir' : 'Editar'}
            </button>
          )}
          <button onClick={handleCancel} className="button cancelButton">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViniloForm;