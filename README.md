<h1 align="center">🔡 PlatziWordle 🎲</h1>

<p align="center">
  Proyecto del Curso de Programación Reactiva con RxJS
</p>

👋 ¡Hola! Qué genial que ya estés viendo el proyecto que generaremos en este curso.
Este repositorio es una versión de [Wordle en español](https://wordle.danielfrg.com/) desarrollada con RxJS.

## Guía de instalación del proyecto

1. Instala las dependencias:

```console
npm i rxjs webpack webpack-dev-server
npm i -D webpack-cli
```

2. Genera un `webpack.config.js` dentro del proyecto:

```javascript
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  mode: "development",
};
```

3. Genera las siguientes carpetas y archivos como se muestra en esta estructura:

```console
public/
    index.html
    style.css
src/
    index.js
webpack.config.js
```

4. Añade la fuente JavaScript al `index.html`:

```html
<script src="./bundle.js"></script>
```

Y los estilos `.css`:

```html
<link rel="stylesheet" href="./style.css" />
```

## Ramas disponibles del curso
> 💻 Si estás estancado/a en el desarollo del proyecto también puedes utilizar el sistema de preguntas del curso. 😊 O también puedes revisar las ramas de las clases del curso.

| **Clase**                                                       | **Rama**                      | **Cambio realizado**                                 |
| --------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------- |
| Aplicación de fromEvent en PlatziWordle                         | `9-fromEvent-PlatziWordle`    | Implementamos observables con fromEvent              |
| Aplicación de Subject en PlatziWordle                           | `11-Subject-PlatziWordle`     | Implementamos Subject en fromEvent                   |
| Finalizando el proyecto PlatziWordle                            | `14-Finalizando-PlatziWordle` | Realizamos algunos detalles en PlatziWordle          |
| Operadores: map, reduce y filter (map y filter en PlatziWordle) | `17-map-filter-PlatziWordle`  | Reemplazamos código vanilla con map y filter         |
| Operadores: takeUntil (takeUntil en PlatziWordle)               | `23-takeUntil-PlatziWordle`   | Empleamos takeUntil                                  |
| PlatziWordle con opción de reinicio                             | `28-reinicio-PlatziWordle`    | Habilitamos la opción para reiniciar en PlatziWordle |
