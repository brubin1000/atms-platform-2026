import IORedis from 'ioredis';

let redisClient: IORedis | null = null;

export function getRedisConnection(): IORedis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new IORedis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: null });
  }

  return redisClient;
}
