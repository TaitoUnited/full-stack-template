import { server } from '~/setup/server';
import { setupServer } from '~/setup/setup';

async function runTestServer() {
  await setupServer(server);

  let isStopping = false;

  async function stopTestServer() {
    if (isStopping) {
      return;
    }

    isStopping = true;

    try {
      await server.close();
    } catch (error) {
      server.log.error(error, 'Failed to stop API test server');
      process.exitCode = 1;
    }
  }

  function stopOnSignal() {
    void stopTestServer();
  }

  process.once('SIGINT', stopOnSignal);
  process.once('SIGTERM', stopOnSignal);
}

void runTestServer().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
