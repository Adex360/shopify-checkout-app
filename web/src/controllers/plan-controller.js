import { PLAN_CONFIRMATION_PREFIX } from "../constants/index.js";
import { Plan, Shop } from "../models/index.js";
import ShopifyService from "../services/shopify-service.js";

export const getAllPlans = async (_req, res) => {
  const plans = await Plan.getAll();
  return res.status(200).send({ plans });
};

export const subscribeToPlan = async (req, res) => {
  const { type } = req.body;
  const { shop_name, accessToken } = req.shop;
  if (!req.shop) return res.status(404).send({ error: "Shop Not Found" });
  const selectedPlan = await Plan.getByType(type);
  if (!selectedPlan) return res.status(404).send({ error: "Plan not found" });

  const service = new ShopifyService({ shop_name, accessToken });

  let test = false;
  const shops = process.env.TEST_SHOPS.split(",");
  const index = shops.findIndex((shop) => shop === shop_name);
  if (process.env.NODE_ENV === "development" || index !== -1) test = true;

  const resp = await service.post("/recurring_application_charges.json", {
    recurring_application_charge: {
      name: `$${selectedPlan.price} for ${selectedPlan.name} Plan`,
      price: selectedPlan.price,
      return_url: `${PLAN_CONFIRMATION_PREFIX}/plan-confirmation/${shop_name}/${type}`,
      test,
      trial_days: 7,
    },
  });
  const details = resp.data.recurring_application_charge;
  return res.status(200).send({ confirmation_url: details.confirmation_url });
};
