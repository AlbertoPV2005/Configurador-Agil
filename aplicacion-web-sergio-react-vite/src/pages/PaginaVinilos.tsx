// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PrimaryButton } from '@fluentui/react';  // Componente de Fluent UI

interface PostData {  // Tipo para los datos de la API
  userId: number;
  id: number;
  title: string;
  body: string;
}

const Home: React.FC = () => {  // Usa React.FC para tipar el componente
  const [data, setData] = useState<PostData | null>(null);  // useState con tipo
  const [loading, setLoading] = useState<boolean>(true);  // useState con tipo

  useEffect(() => {
    axios.get<PostData>('https://jsonplaceholder.typicode.com/posts/1')  // Tipado en la respuesta
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);  // Array vacío para ejecutar una vez

  return (
    <div>
      <h1>Bienvenido a la página de Inicio</h1>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <div>
          {data && <p>Datos obtenidos: {data.title}</p>}
          <PrimaryButton text="Haz clic" onClick={() => alert('Botón de Fluent UI!')} />
        </div>
      )}
    </div>
  );
};

export default Home;