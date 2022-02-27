# js-portfolio

# Intalando Webpack

## Instalacion de Webpack via npm

    npm i -D webpack webpack-cli

## Inicializar webpack

Dependera el modo que se requiera

    npx webpack --mode production/ development

## Configuracion a base de un archivo 

Se genera un archivo **webpack.config.js** con la siguiente estructura:

    const path = require('path');

    module.exports = {
       entry: './src/index.js', //Punto de entrada de la aplicacion
        output: { //Salida de los archivos
            path: path.resolve(__dirname, 'dist'), //path donde se guarda el proyecto con webpack
            filename: 'main.js' //nombre del archivo resultante
        },
        resolve: {
            extensions: ['.js'] //Que extensiones trabajara webpack
        },
    }

### Para inicializar webpack con el archivo de configuraciones

Se inicializa con el modo y se agrega la configuracion con `--config` y el archivo de configuracion

    npx webpack --mode production --config webpack.config.js


Se puede agregar esta instruccion con un script de node

El nombre del script seguido de `webpack --mode` y tipo de modo

    "build": "webpack --mode production",

Ya no es necesario establecer el archivo de configuracion.

___

## Loaders
Fuera de contexto, webpack solamente entiende JavaScript y JSON. Los loaders nos permite procesar archivos de otros tipos para convertirnos en módulos válidos que serán consumidos por nuestras aplicaciones y agregadas como dependencias.

En alto nivel, los loaders poseen 2 configuraciones principales:

`test` - propiedad que identifica cuáles archivos deberán ser transformados

`use` - propiedad que identifica el loader que será usado para transformar a dichos archivos

## Plugins
Mientras los loaders transforman ciertos tipos de módulos, los plugins _son utilizados para extender tareas específicas, como la optimización de paquetes, la gestión de activos y la inyección de variables de entorno.

Una vez importado el plugin, podemos desear el personalizarlos a través de opciones.

# Instalacion de Loaders y Plugins en webpack

## Babel loader y plugin, transpilar JS

Babel sirve para transpilar el codigo de javascript y sea compatible con todos los navegadores.

### Instalacion via npm

Para poder transpilar el codigo con webpack se requieren 3 dependencias:

- `babel-loader` - Loader
- `@babel/core` - Core de todo el recurso de babel
- `@babel/preset-env` - Ayuda para trabajar con JS moderno
- `@babel/plugin-transform-runtime` - Sirve para trabajar con custiones de asincronismo

        npm install -D babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime

### Configuracion Babel

Se necesita crear un archivo *.babelrc* para realizar la configuracion de babel.

#### Archivo *.babelrc*
Deberar contener la configuracion de los `presets` y `plugins` con la siguiente estructura

    {
    "presets": [
        "@babel/preset-env"
    ],
    "plugins": [
        "@babel/plugin-transform-runtime"
    ]
}

#### Configuracion en archivo webpack

Se añade propiedad `module` en un objeto las reglas de los loaders a trabajar

     module: {
        rules: [
            { //Intregracion de babel, babel-loader
                test: /\.m?js$/,  //Expresion regular, donde archivos .m o .js son los archivos a trabajar
                exclude: /node_modules/, //Carpeta a excluir
                use: {
                    loader: 'babel-loader' //Que loader
                }
            },
        ]
     }

---

## HTML con webpack, plugin para html

Preparar HTMl para su transpilacion con webpack

### Instalacion via npm

- `html-webpack-plugin` - Plugin para traspilar HTML

        npm i -D html-webpack-plugin

## Configuracion

Se añade el recurso al archivo de configuracion de webpack.

    const HtmlWebpackPlugin = require('html-webpack-plugin');

Se añade propiedad de `plugins` al archivo de configuracion

     plugins: [ //Configuracion para html webpack plugin
        new HtmlWebpackPlugin({ //Se inicializa const de HtmlWebpackPlugin
            inject: true, // Insercion de todos los elementos
            template: './public/index.html', //Archivo a transpilar
            filename: './index.html' //Archivo resultante
        }),
    ]

En el archivo HTML se debera eliminar las etiquetas `<script>` que tengan referencia a los archivos js

---
## CSS con webpack, plugin y loader para CSS

Preparar la transpilacion de archivos CSS con webpack

### Instalacion via npm

- `css-loader`- Loader para reconocer CSS
- `mini-css-extract-plugin` - Extrae el CSS en archivos

        npm i -D mini-css-extract-plugin css-loader

### Configuracion

Se deberan eliminar las etiquetas `<style>` del template html.

En el archivo de entrada [`entry`] se debera importar los estilos

    import './styles/main.css'

#### Archivo de configuracion webpack

Se añade el recurso al archivo

    const MiniCssExtractPlugin = require('mini-css-extract-plugin');

Agregar la regla a la seccion de `rules`

    { //Configuracion loader css
        test: /\.css$/i, //Expresion regular, donde archivos .css son los archivos a trabajar
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader' //Que loaders
        ],
    }

En `plugins` se inicializa la constante de `MiniCssExtractPlugin`

    new MiniCssExtractPlugin(),

### Webpack con preprocesadores

#### Instalacion 

##### Stylus

    npm i -D stylus-loader

##### Sass

    npm i sass-loader

### Configuracion

Se añade la extension a la propiedad test

##### Stylus
    test: /\.(css|styl)$/i,

##### Sass
    test: /\.s?css$/,

Añadir el loader en la propiedad `use`

##### Stylus
    use: [MiniCssExtractPlugin.loader,
        'css-loader',
        'stylus-loader'
    ],

##### Sass
    use: [MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader'
    ],

---

## Plugin para copiar archivos

Copiar todos los archivos fuera de .css, .js o .html al la carpeta que exporta webpack.

### Instalacion via npm

    npm i -D copy-webpack-plugin

### Configuracion

Añadir constante al archivo de configuracion de webpack del plugin.

    const CopyPlugin = require('copy-webpack-plugin')

En `plugins` se inicializa la constante de `CopyPlugin`, donde se le pasaran algunos elementos para su configuracion.

    new CopyPlugin({
        patterns: [
            {
                from: path.resolve(__dirname, "src", "assets/images"), //En from se puede mover una carpeta o solo un archivo
                to: "assets/images"
            }
        ]
    }),

**Se debera realizar las modificaciones de los llamado de cada archivo con las nuevas carpetas al transpilar con webpack.**

---
## Loaders para Images

Optimizar el uso de las imagenes donde se podra importar y poder llamarlas como una variable para su uso. Estos se convierten en base 64

### Instalacion via npm

No es necesario un plugin o un loader para usarlo, webpack ya lo tiene incluido.

### Configuracion

Agregar la regla a la seccion de `rules` con lo siguientes parametros

    {
        test: /\.png/,
        type: 'asset/resource'
    }

**Siempre y cuando sea JS el archivo que crea el HTML**

En el archivo de js donde se ocupan los recursos se deberan importar las imagenes.

    import github from '../assets/images/github.png'
    import twitter from '../assets/images/twitter.png'
    import instagram from '../assets/images/instagram.png

y cambiar las rutas de los sources en las etiquetas `<img>` por las variables de los importados

          <a href="https://twitter.com/gndx">
            <img src="${twitter}" />
          </a>
          <a href="https://github.com/gndx">
            <img src="${github}" />
          </a>
          <a href="https://instagram.com/gndx">
            <img src="${instagram}" />
          </a>

Para mover las imagenes optimizadas a la carpeta correspondiente se debera declarar en la propuedad `output` la direccion de la carpeta resultante y `/[hash][ext][query]` para conservar el hash y ext de la imagen optimizada

    assetModuleFilename: 'assets/images/[hash][ext][query]'

---

## Loaders para fuentes

Integrar las fuentes al proyecto para evitar que el proyecto sea mas pesado.

### Preparacion

Identificar que fuentes se estan ocupando para poder descargar o tener en el formaro `.woff`

***Si se tiene alguna url donde se importa la fuente se debe eliminar***

En el archivo style donde se requiere las fuentes de deberan declarar las fuentes a utilizar con lo siguiente.

    @font-face {
	font-family: 'Ubuntu';
	src: url('../assets/fonts/ubuntu-regular.woff2') format('woff2'),
		url('../assets/fonts/ubuntu-regular.woff') format('woff');
	font-weight: 400;
	font-style: normal;
    }

### **Actualizacion de configuracion**

**La instalacion de las dependencias y la propiedad `use` ya no es necesaria, a partir de webpack5 ya se puede copiar estos archivos directamente sin loaders, se puede simplificar con la siguiente configuracion.**

    {
        test: /\.(woff|woff2)$/,
        type: 'asset/resource',
        generator : {
            filename:"assets/fonts/[name][ext]"
        }
    }
---


### Instalacion via npm

Se deberan de instalar dos dependencias `url-loader` y `file-loader` para poder copiar las fuentes al proyecto

    npm i -D url-loader file-loader


### Configuracion

En el archivo de configuracion de webpack se debera añadir el recurso en la propiedad de `rules`

    {
        test: /\.(woff|woff2)$/,
        use: {
            loader: 'url-loader',
            options: {
                limit: 10000, // O LE PASAMOS UN BOOLEANOS TRUE O FALSE
                // Habilita o deshabilita la transformación de archivos en base64.
                mimetype: 'aplication/font-woff',
                // Especifica el tipo MIME con el que se alineará el archivo. 
                // Los MIME Types (Multipurpose Internet Mail Extensions)
                // son la manera standard de mandar contenido a través de la red.
                name: "[name].[ext]",
                // EL NOMBRE INICIAL DEL ARCHIVO + SU EXTENSIÓN
                // PUEDES AGREGARLE [name]hola.[ext] y el output del archivo seria 
                // ubuntu-regularhola.woff
                outputPath: './assets/fonts/', 
                // EL DIRECTORIO DE SALIDA (SIN COMPLICACIONES)
                publicPath: './assets/fonts/',
                // EL DIRECTORIO PUBLICO (SIN COMPLICACIONES)
                esModule: false 
                // AVISAR EXPLICITAMENTE SI ES UN MODULO
            }
        }
    },
---

## Compresion y Minifiacion de archivos

Optimizar y comprimir nuestro proyecto para que sea mas eficiente en su rendimiento

### Instalacion via npm

Se necesitan don depedencias `css-minimizer-webpack-plugin` y `terser-webpack-plugin`

    npm i -D css-minimizer-webpack-plugin terser-webpack-plugin

### Configuracion

Es necesario instanciar las dependencias en el archivo de configuracion de webpack

    const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
    const TerserPlugin = require('terser-webpack-plugin')

Añadir la propiedad de optimizacion (`optimization`)

    optimization : {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    }

Otra de las optimizaciones que se pueden realizar para identificar las versiones que se estan trabajando tienen que ver mucho con los ***hash***, si el hash cambia es por que hay modificaciones.

Modificar en `output` el `filename`

    filename: '[name].[contenthash].js',

#### Modificacion de plugins

En la configruacion de `MiniCssExtractPlugin` se añade lo siguiente

    new MiniCssExtractPlugin({
        filename: 'assets/[name].[contenthash].css'
    }),

### contenthash

`contenthash` nos permite identificar la version del build que se esta haciendo, se puede agregar `[contenthash]` a los archivos resultantes para anexar el hash al nombre.

-JS: `[name].[contenthash].js`
-CSS: `[name].[contenthash].css`
-Fonts: `[name].[contenthash].[ext]`
### Nota
~~~
¿Por qué es importante usar Hashes en nuestros archivos?

Los recursos que se guardan en memoria cache suceden cuando el navegador entra a un sitio por primera vez detecta los recursos y los guarda. Por ello la siguiente vez sera mucho más rápido porque estarán en memoria
La desventaja esta cuando sacamos una nueva versión, porque tendrán un mismo nombre evitando que se descargue los nuevos cambios, por lo tanto, el usuario no recibirá los nuevos cambios.

Para que no haya conflictos con la cache una vez que tengamos nuestro proyecto en producción es importante darles un hash para cada nueva versión
~~~

## Webpack Alias

El **"Alias"** nos permiten otorgar nombres a paths específicos y poder indentificar mucho mejor la forma de traer los archivos. Esto evitara que las rutas de los path sean mas comprensibles y faciles de utilizar.

### Configuracion

En la propiedad de `resolve` se añade un nuevo apartado llamado `alias`. Para poder identificar un alias es necesario agregar ***@*** antes del nombre del alias.

        alias: {
            //'@nombreDeAlias': path.resolve(__dirname, 'src/<directorio>'),
            '@utils': path.resolve(__dirname, 'src/utils/'), //ubicacion de la carpeta
            '@templates': path.resolve(__dirname, 'src/templates/'), //ubicacion de la carpeta
            '@styles': path.resolve(__dirname, 'src/styles/'), //ubicacion de la carpeta
            '@images': path.resolve(__dirname, 'src/assets/images/'), //ubicacion de la carpeta
        }

En los archivos JS que necesitan estas rutas se deberan cambiar por los alias

**index.js**

    import Template from '@templates/Template.js';
    import '@styles/main.css'

**Template.js**

    import getData from '@utils/getData.js';
    import github from '@images/github.png'
    import twitter from '@images/twitter.png'
    import instagram from '@images/instagram.png'

---

## Variables de entorno

Es importante considerar las variables de entorno va a ser un espacio seguro donde podemos guardar datos sensibles
Por ejemplo, subir llaves al repositorio no es buena idea cuando tienes un proyecto open source, elementos que hacen referencia a un punto especifico del proyecto pero no se quieren exponer al publico

### Instalacion via npm

Es necesaria una dependiencia

    npm i -D dotenv-webpack

### Configuracion

Se debe crear un nuevo archivo llamado `.env`, este archivo no se sube en el repositorio, si se manejan en el proyecto se deberan solicitar al lider del proyecto.

Tambien es necesario agregar un archivo `.env-example` donde tendra los elementos ejemplo de que variables necesita el proyecto, esto es para que se pueda solicitar al lider del proyecto. Este archivo si se puede subir al repositorio.

En `.env` se debera añadir la API que se esta utilizando en una variable con la informacion asignada, ejemplo `NOMBRA_VARIABLE=ASIGNACION_STRING`

    API=https://ramdomuser.me/api/

Para el archivo de `.env-example` solo se debera declarar la variable mas no se debera asignar.

    API=
En el archivo de configuracion de webpack se debera añadir la configuracion, se crea la constante de `Dotenv` con el recurso instalado.

    const Dotenv = require('dotenv-webpack');

En el apartado de `plugins` se debera inicializar esta constante

    new Dotenv(),

En los archivo que necesiten la nueva variable se debera cambiar su valor por `process.env.NOMBRE_VARIABLE`

    const API = process.env.API;

---

## Tipos de modo
## Modo desarrollo

Separar configuraciones de acuerdo a cada modo, crear un archivo para cada modo.

En el archivo debera incluir en su nombre que es dev, `webpack.config.dev.js`

Solo deberam ir las configuraciones que son necesarias. Al archivo se añade el `mode` a la configuracion

    mode: 'development'

**NO SON NECESARIAS:**

-Minificacion

En el script de node se debera realizar la modificacion del llamado eliminando el modo y añadiendo el archivo de configuracion.

    "dev": "webpack --config webpack.config.dev.js"


## Modo Produccion

Se conserva todas las modificaciones que debera realizar webpack.

Para poder limpiar los archivos ya creador y dejar una construccion nueva con los archivos necesarios.

### Instalacion via npm

Se debera instalar un recurso para poder realizar la limpieza de la construccion, `clean-webpack-plugin`

    npm i -D clean-webpack-plugin

### Configuracion

En el archivo de configuracion final, produccion, se debera anexar la constante del recurso

    const { CleanWebpackPlugin } = require('clean-webpack-plugin');

E inicializar la constante en el apartado de `plugins`

    new CleanWebpackPlugin(),

## Modo "watch"

Este modo sirve al igual que SASS para ver todos los cambios e ir compilando los cambios al mismo tiempo.

Se puede agregar propiedad de `watch` al archivo de configuracion de webpack 

    watch: true

o hacer el llamado del script de development agregando el flag `--watch

    "build:watch": "webpack --watch --config webpack.config.js",
    "dev:watch": "webpack --watch --config webpack.config.dev.js"

---

## Deploy

Para deplegar la configuracion a netlify se debera agregar un archivo de configuracion

- Crear el archivo `netlify.toml`
- En el archivo agregar lo siguiente
~~~
    [build]
    publish = "dist"
    command = "npm run build"
~~~

- Se debera de tener declarado todas las dependencias necesarias para el proyecto en caso contrario se debera anexar en modo -D 
- Si se tiene una configuracion de variables para entorno se debera hacer lo siguiente:
    - Crear una carpeta `scripts`
    - Crear el archivo para el script, `create-env.js`
    - Crear el script, este script se encargara de crear y anexar la varible de entorno: 
    ~~~
    const fs = require('fs');

    fs.writeFileSync("./.env", `API=${process.env.API}\n`);
    ~~~
    - En Netlify se debera realizar la configuracion de las variables, en editor de varibles se debera crear la variable reuqerida y asignando el valor.
    - Anidar en el script de node el llamado del script para los env


