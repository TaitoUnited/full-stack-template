import Boom from 'boom';
import jwt from 'jsonwebtoken';
import config from '../common/common.config';

const createAuthService = () => ({
  async authenticate({ username = '', password = '' }) {
    // NOTE: Use environment variable passwords only for a simple
    // 'shared username and password' use case. Passwords of real users should
    // always be hashed, salted and stored elsewhere
    const pw = config.passwords[username];
    if (!pw || pw !== password || username !== 'admin') {
      throw Boom.unauthorized('Invalid credentials');
    }

    // TODO 2FA support or at least lock account on too many tries?
    const customJWT = jwt.sign(
      {
        iat: Math.floor(Date.now() / 1000), // now
        /* eslint-disable no-mixed-operators */
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
        iss: 'companyname',
        aud: 'server-template',
        sub: username,
        // NOTE: assuming that there are only two users: admin and user
        role: username,
      },
      config.JWT_SECRET
    );
    return { token: customJWT };
  },
});

export default createAuthService;
