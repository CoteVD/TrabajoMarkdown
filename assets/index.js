const fs = require('fs');
const Marked = require('marked');
const fetch = require('node-fetch');
const path = require('path');
//const argv = require('yargs').argv;
const colors = require('colors');

// Función para extraer los links del archivo
const mdlinks = function markdownLinkExtractor(markdown) {
  // Es necesario que instales marked como dependencia de tu proyecto
  // npm install --save marked
  // Función necesaria para extraer los links usando marked
  // Recibe texto en markdown y retorna sus links en un arreglo
  const links = [];
  const renderer = new Marked.Renderer();

  // Tomado desde https://github.com/markedjs/marked/issues/1279
  const linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;

  Marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;

  renderer.link = function (href, title, text) {
    links.push({
      href: href,
      text: text,
      title: title,
    });
  };
  renderer.image = function (href, title, text) {
    // Remueve el porte de la imagen, ejemplo ' =20%x50'
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push({
      href: href,
      text: text,
      title: title,
    });
  };
  Marked(markdown, { renderer: renderer });

  return links;
};

// Busco dónde se está ejecutando el archivo (directorio)
let dir = process.cwd();

// Lee el contenido del directorio
fs.readdir(dir, (err, files) => {
  if (err) throw err;
  return files.forEach(file => {
    // Sólo seleccionamos los archivos con la extensión .md
    if (path.extname(file) === '.md') {
      // Nos metemos en éstos archivos
      fs.readFile(file, 'utf-8', (err, data) => {
        if (err) throw err;
        // Retorna un aray de objetos
        return mdlinks(data).forEach(element => {
          fetch(`${element.href}`)
            .then((answer) => {
              let array = {
                link: answer.url,
                text: element.text,
                title: file,
                status: answer.status
              }
              console.log(array)
            })
            .catch(err => console.log(`El link ${element.href} está roto`.red))
        })
      })
    }
  })
})

//let readFile = fs.readFile('ejemplos.md', 'utf-8', (err, data) => {
//  if (err) throw err;
//  return data;
// Al poner console.log(data) me devuelve
//[VTR](https://vtr.com/)
//[Wom](https://www.wom.cl/)
//[Facebook](https://www.facebook.com/)
//[Google](https://www.google.com/)
//[Error](https://www.error.net)
//});





/*mdLinks('ejemplos.md', err)
  .then(links => {
    // => [{ href, text, file }]
  })
  .catch(console.error);

mdLinks('./some/example.md', { validate: true })
  .then(links => {
    // => [{ href, text, file, status, ok }]
  })
  .catch(console.error);

// HACKER EDITION
mdLinks("./some/dir")
  .then(links => {
    // => [{ href, text, file }]
  })
  .catch(console.error);
*/