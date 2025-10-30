import React, { useState } from 'react';
import { Stack, TextField, Image, IStackTokens } from '@fluentui/react';

export interface VinylFormData {
  titulo: string;
  artista: string;
  genero: string;
  descripcion: string;
  imagen: string;
  precio: string; // keep as string for backend compatibility
  unidades: string; // keep as string for backend compatibility
}

export type VinylFormMode = 'view' | 'edit' | 'create';

export interface VinylFormProps {
  value: VinylFormData;
  mode: VinylFormMode;
  errors?: Partial<Record<keyof VinylFormData, string>>;
  onChange: (patch: Partial<VinylFormData>) => void;
}

const columnTokens: IStackTokens = { childrenGap: 12 };

const VinylForm: React.FC<VinylFormProps> = ({ value, mode, errors = {}, onChange }) => {
  const readOnly = mode === 'view';
  const [editingImage, setEditingImage] = useState(false);

  return (
    <Stack horizontal horizontalAlign="stretch" tokens={{ childrenGap: 24 }} wrap>
      {/* Left column */}
      <Stack grow styles={{ root: { minWidth: 280 } }} tokens={columnTokens}>
        <TextField
          label="Nombre del vinilo"
          value={value.titulo}
          onChange={(_, v) => onChange({ titulo: v ?? '' })}
          disabled={readOnly}
          errorMessage={errors.titulo}
        />
        <TextField
          label="Artista"
          value={value.artista}
          onChange={(_, v) => onChange({ artista: v ?? '' })}
          disabled={readOnly}
          errorMessage={errors.artista}
        />
        <TextField
          label="Precio"
          type="text"
          value={value.precio}
          onChange={(_, v) => onChange({ precio: v ?? '' })}
          disabled={readOnly}
          errorMessage={errors.precio}
        />
        <TextField
          label="Unidades"
          type="text"
          value={value.unidades}
          onChange={(_, v) => onChange({ unidades: v ?? '' })}
          disabled={readOnly}
          errorMessage={errors.unidades}
        />
        <TextField
          label="Descripción"
          value={value.descripcion}
          onChange={(_, v) => onChange({ descripcion: v ?? '' })}
          disabled={readOnly}
          multiline
          autoAdjustHeight
          errorMessage={errors.descripcion}
        />
      </Stack>

      {/* Right column */}
      <Stack grow styles={{ root: { minWidth: 280 } }} tokens={columnTokens}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Imagen del Vinilo</label>
          {readOnly || !editingImage ? (
            <Image
              src={value.imagen || 'https://pngimg.com/uploads/vinyl/small/vinyl_PNG59.png'}
              alt="Imagen del Vinilo"
              width={260}
              height={260}
              imageFit={2 /* cover */}
              onClick={() => {
                if (!readOnly) setEditingImage(true);
              }}
              styles={{ root: { cursor: readOnly ? 'default' : 'pointer', borderRadius: 6, overflow: 'hidden' } }}
            />
          ) : (
            <TextField
              placeholder="Ingresa la URL de la imagen"
              value={value.imagen}
              onChange={(_, v) => onChange({ imagen: v ?? '' })}
              onBlur={() => setEditingImage(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setEditingImage(false);
              }}
              errorMessage={errors.imagen}
            />
          )}
        </div>

        <TextField
          label="Género"
          value={value.genero}
          onChange={(_, v) => onChange({ genero: v ?? '' })}
          disabled={readOnly}
          errorMessage={errors.genero}
        />
      </Stack>
    </Stack>
  );
};

export default VinylForm;
