module.exports = {
  client: {
    name: 'full-stack-template-server',
    includes: ['./test/**/*.{ts,tsx}'],
    service: {
      name: 'full-stack-template-server',
      url: 'http://localhost:9999/api',
    },
  },
};
