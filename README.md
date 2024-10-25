# vite-react-auto-route-plugin

react auto route base on page file structure, plugin for vite

a vite port for https://github.com/postor/webpack-react-auto-route-plugin

## usage

```
// vite.config.ts
import ViteReactAutoRoutePlugin from 'vite-react-auto-route-plugin'

export default defineConfig({
    ...
    plugins: [
        ViteReactAutoRoutePlugin({
            root: './src/pages', // Optional customization
            getRoutesFile: /auto-get-routes\.ts/,
        }),
        ...
    ],
});

```

auto-get-routes.ts content will be replaced with generated routes

```
// src/auto-get-routes.ts

const getRoutes:()=>any[] = () => {
  throw 'please config ViteReactAutoRoutePlugin in vite'
} 

export default getRoutes

```

use routes

```
// src/index.ts
import getRoutes from './auto-get-routes'

// ** auto get routes you can use **
const routes = getRoutes()

const App = () => {
  return useRoutes(routes)
}
```