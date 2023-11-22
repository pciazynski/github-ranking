# github-ranking

An endpoint that returns the GitHub top-rated repositories.

The endpoint has 3 input parameters:

- Date: the date of the ranking. Ex: 2019-02-22
- Language: the programming language that you will filter by
- Limit: The max amount of values your endpoint will return

## How to start?

0. Make sure you have Node.js v20
1. Install dependencies: `npm i`
2. To run tests: `npm test`
3. To start with development logs: `NODE_ENV=development npm start`
4. You can use the endpoint for example with by going to the following URL: `http://[::1]:3000/ranking?date=2023-07-13&language=javascript&limit=2`
