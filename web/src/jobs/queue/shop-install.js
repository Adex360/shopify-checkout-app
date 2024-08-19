import Queue from "bull";
import { redisClient } from "../../db/redis/index.js";
import { CityList } from "../../models/index.js";
import ShopifyService from "../../services/shopify-service.js";

const QUEUE_NAME = `${process.env.APP_NAME}:SHOP_INSTALL_QUEUE`;

const CONCURRENT = 50;
const JOB_FAIL_RETRIES = 3;

const options = {
  redis: redisClient,
  removeOnFailure: true,
  removeOnSuccess: true,
};

const queue = new Queue(QUEUE_NAME, options);

export const startShopInstallQueue = async (shop) => {
  return queue.add(
    { shop },
    {
      attempts: JOB_FAIL_RETRIES,
      priority: 1,
      jobId: `${QUEUE_NAME}-${shop.shop_name}-${Date.now()}`,
    }
  );
};

export async function getShopInstallQueueDetails() {
  const [
    activeCount,
    completedCount,
    delayedCount,
    failedCount,
    jobByTypes,
    jobCount,
    waitingCount,
  ] = await Promise.all([
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getDelayedCount(),
    queue.getFailedCount(),
    queue.getJobCountByTypes(),
    queue.getJobCounts(),
    queue.getWaitingCount(),
  ]);

  return {
    activeCount,
    completedCount,
    delayedCount,
    failedCount,
    jobByTypes,
    jobCount,
    waitingCount,
  };
}
queue.on("active", () => {
  console.log(`[${QUEUE_NAME}] is active`);
});

queue.on("cleaned", () => {
  console.log(`[${QUEUE_NAME}] is cleaned`);
});

queue.on("completed", () => {
  console.log(`[${QUEUE_NAME}] is completed`);
});

queue.on("drained", () => {
  console.log(`[${QUEUE_NAME}] is drained`);
});

queue.on("error", () => {
  console.log(`[${QUEUE_NAME}] is error`);
});

queue.on("failed", () => {
  console.log(`[${QUEUE_NAME}] is failed`);
});

queue.on("paused", () => {
  console.log(`[${QUEUE_NAME}] is paused`);
});

queue.on("progress", () => {
  console.log(`[${QUEUE_NAME}] is progress`);
});

queue.on("removed", () => {
  console.log(`[${QUEUE_NAME}] is removed`);
});

queue.on("resumed", () => {
  console.log(`[${QUEUE_NAME}] is resumed`);
});

queue.on("stalled", () => {
  console.log(`[${QUEUE_NAME}] is stalled`);
});

queue.on("waiting", () => {
  console.log(`[${QUEUE_NAME}] is waiting`);
});

queue.process(CONCURRENT, async (job) => {
  try {
    console.log("######## SHOP INSTALL QUEUE STARTED #######");
    const { shop } = job.data;
    await CityList.defaultSetting(shop.id);
  } catch (error) {
    console.log(error);
  }
  return;
});
