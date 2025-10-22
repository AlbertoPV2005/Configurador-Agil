// src/pages/PaginaVinilos.tsx
import React, { useState, useEffect } from 'react';
import { PrimaryButton } from '@fluentui/react';
import '../styles/catalogo.css';
import vinilosData from './data/vinilos.json';

interface Vinyl {
  id: number;
  title: string;
  image: string;
}

const PaginaVinilos: React.FC = () => {
  const [vinilos, setVinilos] = useState<Vinyl[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      const adaptados: Vinyl[] = vinilosData.map((item, index) => ({
        id: index + 1,
        title: `${item.name} - ${item.band}`,
        image: item.img
      }));
      setVinilos(adaptados);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="pagina-vinilos">
      <div className="encabezado">
        <h1 className="titulo">Lista de registros</h1>
        <PrimaryButton text="Añadir producto" className="boton-anadir" />
      </div>

      {loading ? (
        <p className="cargando">Cargando vinilos...</p>
      ) : (
        <div className="lista-vinilos">
          {vinilos.map(vinilo => (
            <div key={vinilo.id} className="tarjeta-vinilo">
              <img src={vinilo.image} alt={vinilo.title} className="imagen-vinilo" />
              <p className="nombre-vinilo">{vinilo.title}</p>
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
    </div>
  );
};

export default PaginaVinilos;