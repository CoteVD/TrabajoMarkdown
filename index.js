#!/usr/bin/env node
const fs = require('fs');
const Marked = require('marked');
const fetch = require('node-fetch');
const path = require('path');
//const argv = require('yargs').argv;
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

// Lee el contenido del directorio
fs.readdir(dir, (err, files) => {
    if (err) throw err;
    return files.forEach(file => {
      // Sólo seleccionamos los archivos con la extensión .md
      if (path.extname(file) === '.md') {
        // Nos metemos en éstos archivos
        fs.readFile(file, 'utf-8', (err, data) => {
          if (err) throw err;
          // Retorna un array de objetos
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