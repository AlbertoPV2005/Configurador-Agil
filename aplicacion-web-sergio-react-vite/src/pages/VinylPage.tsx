import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack, PrimaryButton, DefaultButton, MessageBar, MessageBarType, Spinner, SpinnerSize } from '@fluentui/react';
import VinylForm, { VinylFormData, VinylFormMode } from '../components/VinylForm';
import { ProductoApi, ProductoPayload, Producto } from '../api/producto';

const MAX_IMAGEN_LENGTH = 200;

type Mode = VinylFormMode;

interface VinylPageProps {
  mode: Mode;
}

const emptyForm: VinylFormData = {
  titulo: '',
  artista: '',
  genero: '',
  descripcion: '',
  imagen: '',
  precio: '',
  unidades: '',
};

const VinylPage: React.FC<VinylPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<VinylFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof VinylFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState<{ type: MessageBarType; text: string } | null>(null);

  const title = useMemo(() => {
    if (mode === 'create') return 'Añadir Vinilo';
    if (mode === 'edit') return 'Editar Vinilo';
    return 'Información de Vinilo';
  }, [mode]);

  useEffect(() => {
    if (mode === 'create' || !id) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data: Producto = await ProductoApi.get(id);
        if (cancelled) return;
        setForm({
          titulo: data.nombre ?? '',
          artista: data.artista ?? '',
          genero: data.genero ?? '',
          descripcion: data.descripcion ?? '',
          imagen: data.imagen ?? '',
          precio: data.precio ?? '',
          unidades: data.unidades ?? '',
        });
      } catch (e: any) {
        setBanner({ type: MessageBarType.error, text: e?.message || 'No se pudo cargar el vinilo.' });
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, mode]);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof VinylFormData, string>> = {};
    if (!form.titulo.trim()) errs.titulo = 'El nombre es obligatorio.';
    if (!form.artista.trim()) errs.artista = 'El artista es obligatorio.';
    if (!form.genero.trim()) errs.genero = 'El género es obligatorio.';
    if (!form.descripcion.trim()) errs.descripcion = 'La descripción es obligatoria.';
    if (!form.imagen.trim()) errs.imagen = 'La URL de la imagen es obligatoria.';
    if (!form.precio.trim()) errs.precio = 'El precio es obligatorio.';
    if (!form.unidades.trim()) errs.unidades = 'Las unidades son obligatorias.';

    if (form.imagen && form.imagen.length > MAX_IMAGEN_LENGTH) {
      errs.imagen = `La URL de la imagen es demasiado larga. Máximo ${MAX_IMAGEN_LENGTH} caracteres.`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const toPayload = (): ProductoPayload => ({
    Nombre: form.titulo,
    Artista: form.artista,
    Genero: form.genero,
    Descripcion: form.descripcion,
    Imagen: form.imagen,
    Precio: form.precio.trim(),
    Unidades: form.unidades.trim(),
    ...(id ? { ID: Number(id) } : {}),
  });

  const goBack = () => {
    try {
      if (window.history.length > 1) navigate(-1);
      else navigate('/');
    } catch {
      navigate('/');
    }
  };

  const onSave = async () => {
    if (!validate()) {
      setBanner({ type: MessageBarType.error, text: 'Corrige los errores del formulario antes de guardar.' });
      return;
    }

    try {
      setSaving(true);
      if (mode === 'create') {
        await ProductoApi.create(toPayload());
      } else if (mode === 'edit' && id) {
        await ProductoApi.update(id, toPayload());
      }
      goBack();
    } catch (e: any) {
      setBanner({ type: MessageBarType.error, text: e?.message || 'No se pudo guardar. Comprueba la API.' });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!id) return;
    if (!window.confirm('¿Estás seguro de que quieres eliminar este vinilo? Esta acción no se puede deshacer.')) return;

    try {
      setDeleting(true);
      await ProductoApi.remove(id);
      goBack();
    } catch (e: any) {
      setBanner({ type: MessageBarType.error, text: e?.message || 'No se pudo eliminar el vinilo. Comprueba la API.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginBottom: 16 }}>{title}</h1>

      {banner && (
        <MessageBar
          messageBarType={banner.type}
          onDismiss={() => setBanner(null)}
          isMultiline={false}
          styles={{ root: { marginBottom: 12 } }}
        >
          {banner.text}
        </MessageBar>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <Spinner size={SpinnerSize.medium} label="Cargando..." />
        </div>
      ) : (
        <VinylForm
          value={form}
          mode={mode}
          errors={errors}
          onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
        />
      )}

      <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { marginTop: 16 } }}>
        {mode !== 'view' && (
          <PrimaryButton text={saving ? 'Guardando...' : 'Guardar'} disabled={saving || deleting} onClick={onSave} />
        )}
        <DefaultButton text="Cancelar" disabled={saving || deleting} onClick={goBack} />
        {mode === 'edit' && (
          <DefaultButton
            text={deleting ? 'Eliminando...' : 'Eliminar'}
            disabled={deleting || saving}
            onClick={onDelete}
            styles={{ root: { background: '#fdf2f2', color: '#a4262c', borderColor: '#f3c0c0' } }}
          />
        )}
      </Stack>
    </div>
  );
};

export default VinylPage;
