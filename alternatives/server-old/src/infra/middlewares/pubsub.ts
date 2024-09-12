// Example of how to create a pubsub instance using Redis

// import { RedisPubSub } from 'graphql-redis-subscriptions';
// import Redis from 'ioredis';
// import { getSecrets } from '../../common/setup/config';

// export default async function create(host: string, port: number) {
//   const secrets = await getSecrets();

//   const options = {
//     host,
//     port,
//     password: secrets.REDIS_PASSWORD,
//     retryStrategy: (times: number) => {
//       // reconnect after
//       return Math.min(times * 50, 2000);
//     },
//   };

//   return new RedisPubSub({
//     publisher: new Redis(options),
//     subscriber: new Redis(options),
//   });
// }

// ------------- Usage in resolver -------------

// You can then use the pubsub instance in your resolvers like this in your resolver:

// const topic = 'NEW_MESSAGE';
// let pubsub: RedisPubSub;

// createPubSub(config.REDIS_HOST, config.REDIS_PORT)
//   .then((ps) => {
//     pubsub = ps;
//   })
//   .catch((err) => {
//     console.error(`Failed to create pubsub: ${err}`);
//   });

// Then to trigger a subscription event, you can do something like this:
// @Mutation(() => ID, {
//   description: 'Creates a new message to an existing thread',
// })
// @Authorize('admin', 'user')
// async createMessage(
//   @Ctx() ctx: Context,
//   @Arg('input', () => CreateMessageInput) input: CreateMessageInput
// ): Promise<string> {
//   if (ctx.state.user?.role === 'user') {
//     ...
//     await pubsub.publish(topic, payload);
//   }

//   return id;
// }

// ------ Subscription ------

// And then in your subscription resolver, you can do something like this:

// @Subscription(() => MessageSubscription, {
//   subscribe: () => pubsub.asyncIterator(topic),
// })
// messageSubscription(
//   @Root() payload: MessageSubscription
// ): MessageSubscription {
//   return {
//     threadId: payload.threadId,
//     content: payload.content,
//   };
// }
