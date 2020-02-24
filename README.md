# Beni Lunigiana

## Project setup
Prima di tutto scaricare Node.js, assicurarsi di selezionare l'installazione di npm. Poi aprire il terminale, piazzarsi nella directory di questo progetto e impartire:
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Shows a brief documentation about Vue Components
```
npm run showDoc
```
## Struttura progetto
* Vedi intanto [Vue Cli](https://cli.vuejs.org/)
* src
  * assets. Qui ci stanno risorse Javascript, CSS o SCSS
  * components. La cartella dove sono presenti tutti i componenti di Vue. All'interno c'è la cartella pages (contiene le pagine pronte da mostrare a schermo; tali pagine non si possono inserire dentro altri componenti). Abbiamo poi la cartella UI (contiene i singoli blocchetti della UI che vanno a comporre le pagine)
  * router. File per la configurazione degli url. Si rimanda a [Vue Router](https://router.vuejs.org/) per il funzionamento.
  * store. File per memorizzare lo stato della web application mentre è in esecuzione. Si rimanda a [Vuex](https://vuex.vuejs.org/)

La creazione dell'interfaccia utente è fortemente legata a [Vue Bootstrap](https://bootstrap-vue.js.org/), si consiglia di capirne il funzionamento. Per la gestione delle tabelle è stata usata la libreria [Vue Tables 2](https://github.com/matfish2/vue-tables-2#readme), si rimanda alla documentazione. Per le mappe [Leaflet](https://leafletjs.com/) e [Vue Leaflet](https://github.com/vue-leaflet/Vue2Leaflet) sono stati usati. Mentre per le icone è stata usata [Vue-FontAwesome](https://github.com/FortAwesome/vue-fontawesome).

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
