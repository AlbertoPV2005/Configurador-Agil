// Script para unificar todos los JSON en un solo archivo unificate.json

const fs = require('fs');
const path = require('path');

const files = [
  'pop-rock-nacional.json',
  'pop-rock-internacional.json',
  'metal.json',
  'jazz-blues-soul-reggae.json',
  'hiphop.json'
].map(f => path.join(__dirname, '../Archivos_JSON', f));

function sanitizeJSON(str) {
  // quitar BOM si existe
  str = str.replace(/^\uFEFF/, '');
  // eliminar comas finales antes de ] o }
  str = str.replace(/,(\s*[\]\}])/g, '$1');
  return str;
}

const unified = { name: 'unificate', data: [] };
let totalItems = 0;
let filesWithData = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = sanitizeJSON(content);
    const json = JSON.parse(content);
    const genero = json.name || path.basename(file, '.json');

    if (Array.isArray(json.data)) {
      json.data.forEach(item => {
        if (item && typeof item === 'object') {
          item.genero = genero;
          unified.data.push(item);
          totalItems++;
        }
      });
      filesWithData++;
    } else {
      console.warn(`${path.basename(file)}: no contiene "data" como array, se omite.`);
    }
  } catch (err) {
    console.error(`Error procesando ${path.basename(file)}: ${err.message}`);
  }
});

const outputPath = path.join(__dirname, '../Archivos_JSON/unificate.json');
fs.writeFileSync(outputPath, JSON.stringify(unified, null, 2), 'utf8');

console.log(`Unificados ${totalItems} items de ${filesWithData}/${files.length} archivos en ${outputPath}`);