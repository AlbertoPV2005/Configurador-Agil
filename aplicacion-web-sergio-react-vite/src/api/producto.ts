import api from './client';

// Simplified interface based on the provided API shape
export interface Producto {
  id: number;
  nombre: string;
  unidades: string;
  artista: string;
  imagen: string;
  precio: string;
  genero: string;
  descripcion: string;
}

// Keep payload as-is to match current backend expectations when creating/updating
export interface ProductoPayload {
  Nombre: string;
  Artista: string;
  Genero: string;
  Descripcion: string;
  Imagen: string;
  Precio: string; // Backend expects string per current implementation
  Unidades: string; // Backend expects string
  ID?: number;
}

export const ProductoApi = {
  async list(): Promise<Producto[]> {
    const res = await api.get('/Producto');
    return res.data ?? [];
  },

  async get(id: string | number): Promise<Producto> {
    const res = await api.get(`/Producto/${id}`);
    return res.data;
  },

  async create(payload: ProductoPayload): Promise<any> {
    const res = await api.post('/Producto', payload);
    return res.data;
  },

  async update(id: string | number, payload: ProductoPayload): Promise<any> {
    const res = await api.put(`/Producto/${id}`, payload);
    return res.data;
  },

  async remove(id: string | number): Promise<any> {
    const res = await api.delete(`/Producto/${id}`);
    return res.data;
  },
};
