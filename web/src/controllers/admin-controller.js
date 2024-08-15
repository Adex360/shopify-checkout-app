import { getShopInstallQueueDetails } from "../jobs/queue/index.js";

export async function getQueueDetails(req, res) {
  const shopInstallDetails = await getShopInstallQueueDetails();

  return res.status(200).send({
    message: "Here are the details",
    queueDetails: {
      shopInstallDetails,
    },
  });
}
