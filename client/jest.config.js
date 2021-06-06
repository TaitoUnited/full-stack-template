module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^~constants(.*)$': '<rootDir>/src/constants$1',
    '^~services(.*)$': '<rootDir>/src/services$1',
    '^~shared(.*)$': '<rootDir>/shared$1',
    '^~graphql(.*)$': '<rootDir>/src/graphql$1',
    '^~uikit(.*)$': '<rootDir>/src/components/uikit$1',
    '^~components(.*)$': '<rootDir>/src/components$1',
    '^~utils(.*)$': '<rootDir>/src/utils$1',
  },
};
