import api from './client';

export interface UsuarioTipoDTO {
  dni: string;
  nombre: string;
  esCliente: boolean;
  esEmpleado: boolean;
  tipo: string; // 'Cliente' | 'Empleado' | other
}

export const UsuarioApi = {
  async listTipo(): Promise<UsuarioTipoDTO[]> {
    const res = await api.get('/Usuario/tipo');
    // API returns an array of user+role objects
    return res.data ?? [];
  },
};
