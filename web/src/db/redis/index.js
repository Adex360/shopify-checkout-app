import dotenv from "dotenv";
dotenv.config();
import { createClient } from "redis";

export const redisClient = createClient({
  url: `redis://${process.env.REDIS_CONNECTIONS}:${Number(
    process.env.REDIS_PORT
  )}`,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client connect"));
redisClient.on("reconnecting", (d) => console.log("Redis  reconnecting", d));

await redisClient.connect();
