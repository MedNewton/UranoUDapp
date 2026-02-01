import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { pathToFileURL } from 'url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  const apiHandlers = {
    '/api/kyc-status': pathToFileURL(path.resolve(__dirname, 'api/kyc-status.js')).href,
    '/api/ushare-create': pathToFileURL(path.resolve(__dirname, 'api/ushare-create.js')).href,
    '/api/ushare-upload': pathToFileURL(path.resolve(__dirname, 'api/ushare-upload.js')).href,
    '/api/ushare-list': pathToFileURL(path.resolve(__dirname, 'api/ushare-list.js')).href,
    '/api/ushare-detail': pathToFileURL(path.resolve(__dirname, 'api/ushare-detail.js')).href,
  }

  const apiMiddlewarePlugin = {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const handlerUrl = apiHandlers[url.pathname]
        if (!handlerUrl) {
          return next()
        }

        req.query = Object.fromEntries(url.searchParams)
        req.url = url.pathname + url.search

        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (payload) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
        }
        res.send = (payload) => {
          if (payload === undefined) {
            res.end()
            return
          }
          if (typeof payload === 'object') {
            res.json(payload)
            return
          }
          res.end(payload)
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', async () => {
          req.body = body || null
          try {
            const module = await import(handlerUrl)
            const handler = module?.default
            if (typeof handler !== 'function') {
              res.status(500).send('invalid_handler')
              return
            }
            await handler(req, res)
          } catch (error) {
            res.status(500).json({ error: 'api_handler_failed' })
          }
        })
      })
    },
  }

  return {
    plugins: [apiMiddlewarePlugin, react(), tailwindcss()],
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
