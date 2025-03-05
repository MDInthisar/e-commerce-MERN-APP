import redis from 'redis';

const redisClient = redis.createClient({
    host: '127.0.0.1',  
    port: 6379,
  });
redisClient.on('connect', ()=>{
    console.log('Connected to Redis');
});

redisClient.on('error', (err)=>{
    console.log('Error in Redis ',err);
});

redisClient.connect();

export default redisClient;