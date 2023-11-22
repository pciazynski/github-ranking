/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  verbose: true,
  transform: {
    '^.+\\.ts': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
}

export default jestConfig
