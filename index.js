#!/usr/bin/env node
const fs = require('fs');
const Marked = require('marked');
const fetch = require('node-fetch');
const path = require('path');
const argv = require('yargs')
  .command('validate', 'Imprime la validación de los links en consola', {
    validate: {
      demand: true,
      alias: 'val'
    }
  })
  .help()
  .argv;
const colors = require('colors');

// Función para extraer los links del archivo
const mdlinks = function markdownLinkExtractor(markdown) {
  // Recibe texto en markdown y retorna sus links en un arreglo
  const links = [];
  const renderer = new Marked.Renderer();

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

// Para dar la opción del validate, hay que rescatar el comando que pone el usuario
//let argv2 = process.argv;
//let val = argv[2];

// Lee el contenido del directorio
fs.readdir(dir, (err, files) => {
  if (err) throw err;
  return files.forEach(file => {
    // Sólo seleccionamos los archivos con la extensión .md
    if (path.extname(file) === '.md') {
      // Nos metemos en éstos archivos y leemos cada uno, toda la información se guarda en data
      fs.readFile(file, 'utf-8', (err, data) => {
        if (err) throw err;
        // La función mdlinks extrae de data cada uno de los links y me los devuelve en objetos que guardo en element
        return mdlinks(data).forEach(element => {
          // Se hace un fetch con los links para ver si hay respuesta o no
          fetch(`${element.href}`)
            // Se extrae de la respuesta el status para ver si es 200 (funciona) o no (está roto)
            .then(answer => {
              // Caso de link responsivo (success)
              if (answer.status === 200) {
                console.log(`${element.href}`, 'OK'.green)
              }
            })
            // Caso de link roto
            .catch((err) => console.log(`${element.href}`, 'BROKEN'.red))
        })
      })
    }
  })
})

// Lee el contenido del directorio
fs.readdir(dir, (err, files) => {
  if (err) throw err;
  return files.forEach(file => {
    // Sólo seleccionamos los archivos con la extensión .md
    if (path.extname(file) === '.md') {
      // Nos metemos en éstos archivos y leemos cada uno, toda la información se guarda en data
      fs.readFile(file, 'utf-8', (err, data) => {
        if (err) throw err;
        // La función mdlinks extrae de data cada uno de los links y me los devuelve en objetos que guardo en element
        return mdlinks(data).forEach(element => {
          // Se hace un fetch con los links para obtener información sobre la url
          fetch(`${element.href}`)
            .then((answer) => {
              // Se guarda la información obtenida de answer en un objeto para poder imprimirla más abajo 
              let obj = {
                link: answer.url,
                text: element.text,
                title: file
              }
              // Caso de link que existe y funciona
              console.log(`LINK: ${obj.link}`.underline.cyan, `TEXT: ${obj.text}`, `TITLE: ${obj.title}`.yellow)
            })
            // Caso de link roto
            .catch(err => console.log(`El link ${element.href} está roto o no existe`.red))
        })
      })
    }
  })
})

module.exports = {

}