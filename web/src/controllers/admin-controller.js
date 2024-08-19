import { getShopInstallQueueDetails } from "../jobs/queue/index.js";
import { Plan } from "../models/plan.js";

export async function getQueueDetails(req, res) {
  const shopInstallDetails = await getShopInstallQueueDetails();

  return res.status(200).send({
    message: "Queue details ",
    queueDetails: {
      shopInstallDetails,
    },
  });
}

export async function createPlan(req, res) {
  const { name, price, type } = req.body;
  const plan = await Plan.create({
    name,
    type,
    price,
  });

  return res.status(200).send({ plan });
}
export async function updatePlan(req, res) {
  const plan_id = req.params.id;
  const data = req.body;
  const plan = await Plan.update({
    id: plan_id,
    ...data,
  });

  return res.status(200).send({ plan });
}
