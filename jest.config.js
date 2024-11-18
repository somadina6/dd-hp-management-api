module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    setupFilesAfterEnv: ['./tests/setup.js'],
    testMatch: [
      '**/tests/**/*.test.js'
    ],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/server.js'
    ]
  };