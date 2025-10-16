// npm install axios cheerio fs
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://rockntipo.com/21-discos-metal-heavy';

// Function to fetch the album description from the detail page
async function getAlbumDescription(albumUrl) {
  try {
    const response = await axios.get(albumUrl);
    const $ = cheerio.load(response.data);

    // Try to find the description (adjust selector as needed)
    let description = $('#product-description').text().trim();
    if (!description) description = $('.product-description').text().trim();
    if (!description) description = $('.rte').text().trim();
    if (!description) description = $('.product-information p').first().text().trim();

    return description;
  } catch (err) {
    console.error('Error fetching album detail page:', albumUrl, err.message);
    return '';
  }
}

(async () => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const albums = [];

    const albumBlocks = $('li.ajax_block_product').toArray();

    for (const elem of albumBlocks) {
      const img = $(elem).find('img').attr('src');
      const detailUrl = $(elem).find('a.product_img_link').attr('href');

      // Extract album and band name from the anchor text
      const anchor = $(elem).find('h5 a');
      let [albumName, bandName] = anchor.html()
        ? anchor.html().split('<br>')
        : [anchor.text(), ''];
      albumName = albumName ? albumName.replace(/<[^>]+>/g, '').trim() : '';
      bandName = bandName ? bandName.replace(/<[^>]+>/g, '').trim() : '';

      // Extract number of LPs from album name (e.g., (1 LP), (2 LP), (1 LP - Verde))
      let numLPs = null;
      const lpMatch = albumName.match(/\((\d+)\s*LP/i);
      if (lpMatch) {
        numLPs = parseInt(lpMatch[1], 10);
      }

      // Remove the (1 LP) or similar from the album name
      albumName = albumName.replace(/\s*\(\d+\s*LP[^\)]*\)/i, '').trim();

      // Get description from detail page
      let description = '';
      if (detailUrl) {
        description = await getAlbumDescription(detailUrl);
      }

      if (img && albumName && bandName) {
        albums.push({ name: albumName, band: bandName, img, description, numLPs });
        console.log(`Fetched: ${albumName} | Band: ${bandName} | LPs: ${numLPs}`);
      }
    }

    fs.writeFileSync('albums.json', JSON.stringify(albums, null, 2));
    console.log('Saved albums.json with', albums.length, 'albums');
  } catch (error) {
    console.error('Error fetching the main page:', error);
  }
})();