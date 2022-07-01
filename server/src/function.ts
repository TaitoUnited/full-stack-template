import Koa from 'koa';
import serverless from 'serverless-http';
import { createPost } from './cli';

export const initFunctionHandler = (server: Koa, basePath: string) => {
  const serverlessHandler = serverless(server, { basePath });

  const handler = async (event: any, context: any) => {
    if (event.source === 'aws.events') {
      // Event (e.g. scheduled cron job)
      if (event.resources[0].endsWith('create-post')) {
        // EXAMPLE: create-post cron job
        await createPost();
      } else {
        throw new Error(`Unknown event: ${event.resources[0]}`);
      }
    } else {
      // Http request
      return await serverlessHandler(event, context);
    }
  };

  return handler;
};
