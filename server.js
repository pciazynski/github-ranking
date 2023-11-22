/* eslint-disable no-console */
import build from './build/app.js'

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}

const server = build({
  logger: envToLogger[process.env.NODE_ENV],
  ignoreTrailingSlash: true,
})

server.listen({ port: 3000 }, (err) => {
  if (err) {
    console.log(err)
    throw err
  }
})
