module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^~common(.*)$': '<rootDir>/src/common$1',
    '^~ui(.*)$': '<rootDir>/src/common/ui',
    '^~theme(.*)$': '<rootDir>/src/common/theme',
    '^~styled(.*)$': '<rootDir>/src/common/styled',
    '^~utils(.*)$': '<rootDir>/src/common/utils$1',
    '^~services(.*)$': '<rootDir>/src/common/services$1',
  },
};
