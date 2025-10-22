// Genera INSERTs en MS SQL Server para la tabla [dbo].[Productos]
// Lee los JSON en ../Archivos_JSON y por cada item genera un INSERT.
// Configurable por fichero: start (0-based) y count (cantidad a procesar).

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuración: modificar aquí para controlar por fichero el rango a procesar
const lineasCount = 1;
const fileConfigs = [
  { file: 'pop-rock-nacional.json', start: 0, count: lineasCount },
  { file: 'pop-rock-internacional.json', start: 0, count: lineasCount  },
  { file: 'metal.json', start: 0, count: lineasCount  },
  { file: 'jazz-blues-soul-reggae.json', start: 0, count: lineasCount },
  { file: 'hiphop.json', start: 0, count: lineasCount }
];

const inputDir = path.join(__dirname, '../Archivos_JSON');
const outputSql = path.join(__dirname, '../SQL/Productos_inserts.sql');

function escapeSql(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/'/g, "''").replace(/\r?\n/g, ' ');
}

function trunc(value, max) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  return s.length > max ? s.slice(0, max) : s;
}

function makeId(prefix, idx) {
  // Crear ID legible y único: prefix_idx
  const p = String(prefix).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20) || 'P';
  return `${p}_${idx}`.slice(0, 50);
}

function mapItemToColumns(item, id, generoFallback) {
  // Mapear claves posibles y normalizar/recortar a 50 chars cuando corresponde
  const nombre = trunc(item.nombre || item.Nombre || item.title || '', 50);
  const unidades = trunc(item.unidades || item.Unidades || item.format || '', 50);
  const artista = trunc(item.artista || item.Artista || item.author || '', 50);
  const imagen = trunc(item.imagen || item.Imagen || item.image || '', 50);
  const precio = trunc(item.precio || item.Precio || item.price || '', 50);
  const genero = trunc(item.genero || item.Genero || item.genero_musical || item.genre || generoFallback || '', 50);
  const descripcion = item.descripcion || item.Descripcion || item.description || '';

  return {
    ID: id,
    Nombre: nombre,
    Unidades: unidades,
    Artista: artista,
    Imagen: imagen,
    Precio: precio,
    Genero: genero,
    Descripcion: descripcion
  };
}

// Crear carpeta destino si no existe
const outDir = path.dirname(outputSql);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let inserts = [];
inserts.push('-- Inserts generados para [dbo].[Productos]');
inserts.push('SET NOCOUNT ON;');
inserts.push('BEGIN TRAN;');

let total = 0;

fileConfigs.forEach(cfg => {
  const filePath = path.join(inputDir, cfg.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`Fichero no encontrado: ${filePath} -> se omite`);
    return;
  }

  let raw = fs.readFileSync(filePath, 'utf8');
  // Intentar saneamiento ligero (BOM, comas finales)
  raw = raw.replace(/^\uFEFF/, '').replace(/,\s*([\]}])/g, '$1');

  let json;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    console.error(`Error parseando ${cfg.file}: ${err.message}`);
    return;
  }

  const arr = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
  if (!Array.isArray(arr) || arr.length === 0) {
    console.warn(`${cfg.file}: no se encontraron elementos en 'data'`);
    return;
  }

  const start = Number.isInteger(cfg.start) && cfg.start >= 0 ? cfg.start : 0;
  const count = cfg.count === null || cfg.count === undefined ? arr.length - start : cfg.count;
  const end = Math.min(arr.length, start + count);

  const prefix = path.basename(cfg.file, path.extname(cfg.file));
  for (let i = start; i < end; i++) {
    const item = arr[i];
    // Generar ID: prefix + index (1-based relative al archivo)
    const id = makeId(prefix, i + 1);
  const generoFallback = (json.name && String(json.name).trim()) || prefix;
  const mapped = mapItemToColumns(item, id, generoFallback);

    const cols = ['ID','Nombre','Unidades','Artista','Imagen','Precio','Genero','Descripcion'];
    const values = cols.map(c => {
      const v = mapped[c];
      // Si descripcion es demasiado larga, la dejamos completa (VARCHAR(MAX) en la tabla)
      return `'${escapeSql(v)}'`;
    }).join(', ');

    const sql = `INSERT INTO [dbo].[Productos] ([ID],[Nombre],[Unidades],[Artista],[Imagen],[Precio],[Genero],[Descripcion]) VALUES (${values});`;
    inserts.push(sql);
    total++;
  }
});

inserts.push('COMMIT;');
inserts.push(`-- Total inserts: ${total}`);

fs.writeFileSync(outputSql, inserts.join('\n') + '\n', 'utf8');

console.log(`Generados ${total} INSERTs en: ${outputSql}`);

// Fin
