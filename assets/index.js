const fs = require('fs');
//const path = require('path');
//const mdLinks = require('md-links');
//const argv = require('yargs').argv;
//const colors = require('colors');

fs.readFile('ejemplos.md', 'utf-8', (err, data) => {
  if (err) throw err;
  return data;
// Al poner console.log(data) me devuelve
//[VTR](https://vtr.com/)
//[Wom](https://www.wom.cl/)
//[Facebook](https://www.facebook.com/)
//[Google](https://www.google.com/)
//[Error](https://www.error.net)
})

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


// Es necesario que instales marked como dependencia de tu proyecto
// npm install --save marked
/*const Marked = require('marked');

// Función necesaria para extraer los links usando marked
// Recibe texto en markdown y retorna sus links en un arreglo
function markdownLinkExtractor(markdown) {
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

process.cwd();// Me muestra la carpeta en la que estoy ejecutando el script no dónde está el script*/