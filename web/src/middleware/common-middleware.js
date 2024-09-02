import { Shop } from "../models/index.js";

export const commonMiddleware = async (req, res, next) => {
  console.log("common middleware ", res.locals.shopify.session);
  const session = res.locals.shopify.session;

  const shop = await Shop.findByName(session.shop);
  if (!shop)
    return res.status(404).send({ success: false, message: "Shop Not Found" });

  req.session = session;
  req.shop = shop;
  return next();
};
