import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditVinilo.css';
import vinilosData from './data/vinilos.json';

interface VinylFormData {
  titulo: string;
  artista: string;
  unidades: string;
  genero: string;
  precio: string;
  descripcion: string;
  imagen: string;
}

const InfoVinilo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VinylFormData>({
    titulo: '',
    artista: '',
    unidades: '',
    genero: '',
    precio: '',
    descripcion: '',
    imagen: '',
  });

  const [isEditingImage, setIsEditingImage] = useState(false);

  // Cargar datos del vinilo según el id
  useEffect(() => {
    if (id) {
      const index = parseInt(id, 10) - 1; // porque en tu catálogo usas index+1
      const vinilo = vinilosData[index];
      if (vinilo) {
        setFormData({
          titulo: vinilo.nombre,
          artista: vinilo.artista,
          unidades: vinilo.unidades || '',
          genero: vinilo.genero || '',
          precio: vinilo.precio || '',
          descripcion: vinilo.descripcion || '',
          imagen: vinilo.imagen || '',
        });
      }
    }
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
    navigate('/');
  };

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