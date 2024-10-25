import path, { normalize } from 'path';
import getCode from './loader-get-code'; // Import the existing loader function

interface AutoRoutePluginOptions {
  root?: string;
  skip?: RegExp;
  extension?: string;
  getRoutesFile?: RegExp; // Added option
}

export default function ViteReactAutoRoutePlugin(options: AutoRoutePluginOptions = {}): any {
  const resolvedOptions = {
    root: options.root || './src/pages',
    skip: options.skip || /^\$/,
    extension: options.extension || '.tsx',
    getRoutesFile: options.getRoutesFile || /get-routes\.js/, // Default to get-routes.js
  };
  const loadedIds: Set<string> = new Set

  return {
    name: 'vite-react-auto-route-plugin',
    configureServer(server: any) {
      function handleFileChange(pathStr: string) {
        let p = normalize(pathStr)
        let pRoot = normalize(path.join(process.cwd(), resolvedOptions.root))

        if (p.includes(pRoot)) {
          for (let id of loadedIds) {
            const mod = server.moduleGraph.getModuleById(id)
            if (mod) {
              server.moduleGraph.invalidateModule(mod)
            }
          }
          server.ws.send({ type: 'full-reload' })
        }
      }

      server.watcher.on('add', handleFileChange)
      server.watcher.on('unlink', handleFileChange)
    },
    async load(id: string) {
      // console.log({load:id})
      // Check if the ID matches the specified pattern
      if (resolvedOptions.getRoutesFile.test(id)) {
        loadedIds.add(id)
        const root = path.join(process.cwd(), resolvedOptions.root); // Absolute path
        const code = await getCode(root, resolvedOptions.skip, resolvedOptions.extension, id);
        return code;
      }
    },
  };
}

