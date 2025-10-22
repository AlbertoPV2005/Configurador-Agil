import React, { useState } from 'react';
import '../styles/AddVinylScreen.css'; // Importa el archivo CSS
import { useNavigate } from 'react-router-dom';

interface VinylFormData {
  titulo: string;
  artista: string;
  anio: string; // Asumiendo que "unidades" es "Año"
  genero: string;
  precio: string;
  descripcion: string;
  imagen: string;
}

const AddVinylScreen: React.FC = () => {
  const [formData, setFormData] = useState<VinylFormData>({
    titulo: '',
    artista: '',
    anio: '',
    genero: '',
    precio: '',
    descripcion: '',
    imagen: '',
  });
  const navigate = useNavigate();

  const [isEditingImage, setIsEditingImage] = useState(false); // Estado para controlar si se está editando la URL de la imagen

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
    console.log('Añadiendo vinilo:', formData);
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
              <label className="label">Año (Unidades):</label> {/* Asumí que "unidades" es "Año"; cámbialo si es otro campo */}
              <input
                type="number"
                name="anio"
                value={formData.anio}
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
          <button onClick={handleAdd} className="button addButton">
            Añadir
          </button>
          <button onClick={handleCancel} className="button cancelButton">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVinylScreen;