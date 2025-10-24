import React, { useState, useEffect } from 'react';
import '../styles/EditVinilo.css'; // Importa el archivo CSS
import { useParams, useNavigate } from 'react-router-dom';
import vinilosData from './data/vinilos.json';



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

  const handleCancel = () => {
    navigate('/'); // Redireccion a paginavinilos
  };

  const handleDelete = () => {
    // Lógica para eliminar el vinilo (por ejemplo, resetear el formulario o navegar)
    console.log('Eliminando vinilo');
    // Opcional: resetear el formulario
    setFormData({
      titulo: '',
      artista: '',
      unidades: '',
      genero: '',
      precio: '',
      descripcion: '',
      imagen: '',
    });
  };

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
            <button onClick={handleDelete} className="deleteButton"> {/* Cambié de "btndeleteButton" a "deleteButton" para que coincida con el CSS */}
              Eliminar Vinilo
            </button>
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
            Editar
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