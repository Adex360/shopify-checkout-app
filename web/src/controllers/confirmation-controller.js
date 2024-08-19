import { Shop } from "../models/index.js";

export const planConfirmation = async (req, res) => {
  const { shop_name, plan_type } = req.params;
  const { charge_id } = req.query;
  await Shop.subscribedToPlan(shop_name, plan_type, charge_id);
  return res.redirect(
    `https://${shop_name}/admin/apps/${process.env.SHOPIFY_API_KEY}`
  );
};
