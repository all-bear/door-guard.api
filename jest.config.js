module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.spec.ts'
  ]
};