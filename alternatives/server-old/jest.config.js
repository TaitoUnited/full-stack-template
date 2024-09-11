module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 10000,
  setupFilesAfterEnv: ['../jest.setup.js'],
};
