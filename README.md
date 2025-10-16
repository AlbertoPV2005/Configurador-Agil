# Configurador-Agil

## Base de datos

La información de la base de datos la hemos obtenido haciendo web scraping a [enlace](https://rockntipo.com/19-comprar-vinilos-musica-online)

### Configuracion postman

El [postman](https://marcsastreinetum-2466560.postman.co/workspace/marcsastreinetum's-Workspace~a8c010e0-69b5-4020-820e-253e96161e69/request/48331114-5d5e9f0c-c773-45f7-85b4-56c349bcde50?action=share&creator=48331114&ctx=documentationhttps:/) postman hemos descargado todos los datos de la [web de vinilos](https://rockntipo.com/19-comprar-vinilos-musica-online) usando "?p={pagina}&n={numero de discos por pagina}" para añadir el numero de datos que queriamos para limpiar los datos hemos usado un script post-response en postman

```js
const html = pm.response.text();
function decodeHtml(str) {
if (!str) return '';
return str.replace(/&&/g, '&')
.replace(/""/g, '"')
.replace(/''/g, "'")
.replace(/</g, '>');
}
const ulMatch = html.match(/ul[^]*id=["']product_list["'][^>]*>([\s\S]*?)<\/ul>/i);
let ulContent = ulMatch ? ulMatch[1] : '';
const liRegex = /li[^]*>([\s\S]*?)<\/li>/gi;
let match;
const discos = [];
while ((match = liRegex.exec(ulContent)) !== null) {
const li = match[1];
let nombre = '', unidades = '', artista = '', precio = '', descripcion = '', enlace = '', imagen = '';
// Nombre, unidades y artista
const nombreMatch = li.match(/a[^]*class=["']product-name["'][^>]*>([\s\S]*?)<\/a>/i);
if (nombreMatch) {
let raw = decodeHtml(nombreMatch[1]);
let parts = raw.split(/br\s*\|\n/).map(p => p.replace(/<[^>]+>/g, '').trim()).filter(Boolean);
if (parts.length > 0) {
let nombreUnidades = parts[0].match(/^(.+?)(?:\s*\(([^)]*)\))?$/);
if (nombreUnidades) {
nombre = nombreUnidades[1] ? nombreUnidades[1].trim() : '';
unidades = nombreUnidades[2] ? nombreUnidades[2].trim() : '';
} else {
nombre = parts[0];
}
}
if (parts.length > 1) {
artista = parts[1];
}
}
// Enlace
const enlaceMatch = li.match(/a[^]*class=["']product-name["'][^>]*href=["']([^"']+)["']/i);
if (enlaceMatch) {
enlace = decodeHtml(enlaceMatch[1]);
}
// Imagen
const imgMatch = li.match(/img[^]*src=["']([^"']+)["']/i);
if (imgMatch) {
imagen = decodeHtml(imgMatch[1]);
}
// Precio
const precioMatch = li.match(/span[^]*class=["']price product-price["'][^>]*>([\s\S]*?)<\/span>/i);
if (precioMatch) {
precio = decodeHtml(precioMatch[1].replace(/<[^>]+>/g, '').trim());
}
// Descripcion dentro de .pro_second_box > .product-desc
let descMatch = li.match(/div[^]*class=["'][^"']*pro_second_box[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
if (descMatch) {
let proSecondBox = descMatch[1];
//descripcion = proSecondBox;    let descInnerMatch = proSecondBox.match(/meta[^]+itemprop="description"[^>]+content="([^"]+)"[^>]*>/);
    descripcion = descInnerMatch ? decodeHtml(descInnerMatch[1].replace(/<[^>]+>/g, '').trim()) : '';
    //descripcion = descInnerMatch;
    /*if (descInnerMatch) {
        descripcion = decodeHtml(descInnerMatch[1].replace(/<[^>]+>/g, '').trim());
    }*/
}
discos.push({ nombre, unidades, artista, enlace, imagen, precio, descripcion });
    let descInnerMatch = proSecondBox.match(/meta[^]+itemprop="description"[^>]+content="([^"]+)"[^>]*>/);
    descripcion = descInnerMatch ? decodeHtml(descInnerMatch[1].replace(/<[^>]+>/g, '').trim()) : '';
    //descripcion = descInnerMatch;
    /*if (descInnerMatch) {
        descripcion = decodeHtml(descInnerMatch[1].replace(/<[^>]+>/g, '').trim());
    }*/
}
discos.push({ nombre, unidades, artista, enlace, imagen, precio, descripcion });
}
// Visualización JSON pura
const template = '';
function createPayload() {
return { json: JSON.stringify(discos, null, 2) };
}
pm.visualizer.set(template, createPayload());
// Tests para verificar extracción de precio y descripción
pm.test('Todos los discos tienen campo descripcion extraído', function () {
discos.forEach(disco => {
pm.expect(disco).to.have.property('descripcion');
});
});
pm.test('Todos los discos tienen campo precio extraído', function () {
discos.forEach(disco => {
pm.expect(disco).to.have.property('precio');
});
});
```
