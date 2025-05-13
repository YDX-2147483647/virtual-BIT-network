import type { JestConfigWithTsJest } from 'ts-jest'

export default {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
} as JestConfigWithTsJest
