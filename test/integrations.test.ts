import fs from 'fs'
import { Readable } from 'stream'
import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import build from '../src/app'

describe('API tests', () => {
  describe('GET /ranking', () => {
    beforeEach(() => {
      fetchMock.mockIf(
        /^https?:\/\/raw.githubusercontent.com\/EvanLi\/Github-Ranking\/master\/Data\/github-ranking-.*$/,
        (req) => {
          if (req.url.endsWith('2019-05-13.csv')) {
            const fileContent = fs.readFileSync('./test/fixtures/github-ranking-2019-05-13.csv', 'utf-8')
            return Promise.resolve({
              status: 200,
              body: Readable.from(fileContent) as unknown as string,
            })
          } else {
            return Promise.resolve({
              status: 404,
              body: 'Not Found',
            })
          }
        },
      )
    })

    it('forwards the data from the endpoint Github-Ranking endpoint ', async () => {
      const app = build()

      const response = await app.inject({
        method: 'GET',
        url: '/ranking?date=2019-05-13&language=javascript&limit=2',
      })

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toEqual('application/json; charset=utf-8')
      expect(response.body).toEqual(
        JSON.stringify([
          {
            rank: '1',
            item: 'top-100-stars',
            repo_name: 'freeCodeCamp',
            stars: '302606',
            forks: '21814',
            language: 'JavaScript',
            repo_url: 'https://github.com/freeCodeCamp/freeCodeCamp',
            username: 'freeCodeCamp',
            issues: '2128',
            last_commit: '2019-05-13T03:45:19Z',
            description:
              'The https://www.freeCodeCamp.org open source codebase and curriculum. Learn to code for free together with millions of people.',
          },
          {
            rank: '3',
            item: 'top-100-stars',
            repo_name: 'vue',
            stars: '138299',
            forks: '19740',
            language: 'JavaScript',
            repo_url: 'https://github.com/vuejs/vue',
            username: 'vuejs',
            issues: '274',
            last_commit: '2019-05-08T15:08:30Z',
            description:
              '🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.',
          },
        ]),
      )
    })
  })
})
