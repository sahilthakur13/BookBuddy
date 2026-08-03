const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

const verifyConnection = async () => {
  try {
    await redis.ping();
    console.log('Upstash Redis: Connection active.');
    return true;
  } catch (err) {
    console.error('Upstash Redis: Connection error ->', err.message);
    return false;
  }
};

module.exports = {redis,verifyConnection};