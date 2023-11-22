import fastify from 'fastify'
import { Transform } from 'stream'
import { parse } from 'csv-parse'
import { pipeline } from 'stream'

interface IQuerystring {
  date: string
  language: string
  limit: number
}

const queryStringJsonSchema = {
  type: 'object',
  properties: {
    date: { type: 'string', format: 'date' },
    language: { type: 'string' },
    limit: { type: 'integer' },
  },
  required: ['date', 'language', 'limit'],
}

const schema = {
  querystring: queryStringJsonSchema,
}

function build(opts = {}) {
  const app = fastify(opts)
  app.get<{
    Querystring: IQuerystring
  }>('/ranking', { schema }, async (request, reply) => {
    const { date, language, limit } = request.query
    const result = await fetch(
      `https://raw.githubusercontent.com/EvanLi/Github-Ranking/master/Data/github-ranking-${date}.csv`,
    )
    if (!result.body) {
      return reply.code(500).send('Data provider failed')
    }

    const parser = parse({ columns: true })
    let count = 0
    let filterCount = 0
    let processStream = true

    const transformer = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        if (count === 0) {
          this.push('[')
        }
        count++

        if (processStream && chunk.language.toLowerCase() === language.toLowerCase()) {
          const dataObject = {
            rank: chunk.rank,
            item: chunk.item,
            repo_name: chunk.repo_name,
            stars: chunk.stars,
            forks: chunk.forks,
            language: chunk.language,
            repo_url: chunk.repo_url,
            username: chunk.username,
            issues: chunk.issues,
            last_commit: chunk.last_commit,
            description: chunk.description,
          }
          this.push(`${JSON.stringify(dataObject)}`)

          if (filterCount < limit - 1) {
            this.push(',')
          }
          filterCount++
        }

        if (filterCount >= limit) {
          processStream = false
        }
        callback()
      },

      flush(callback) {
        this.push(']')
        callback()
      },
    })

    pipeline(result.body, parser, transformer, (error) => {
      if (error) {
        console.error('Pipeline error:', error)
        if (!reply.sent) {
          reply.code(500).send('Internal Server Error')
        }
      }
    })

    return reply.code(200).header('Content-Type', 'application/json; charset=utf-8').send(transformer)
  })

  app.get('/test', (request, reply) => {
    reply.code(200).send('pass')
  })

  return app
}

export default build
