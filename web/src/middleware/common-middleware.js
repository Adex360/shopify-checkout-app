import { Shop } from "../models/index.js";

export const commonMiddleware = async (req, res, next) => {
  const session = res.locals.shopify.session;
  // const session = {
  //   shop: "checkout-ui-testing.myshopify.com",
  //   accessToken: "shpua_96bb0facb7083548e2acd97555b9a521",
  // };

  const shop = await Shop.findByName(session.shop);
  if (!shop)
    return res.status(404).send({ success: false, message: "Shop Not Found" });

  req.session = session;
  req.shop = shop;
  return next();
};
