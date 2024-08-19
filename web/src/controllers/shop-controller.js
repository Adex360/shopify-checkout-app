import { Shop } from "../models/Shop.js";
export const getShop = async (req, res) => {
  const shop = req.shop;
  const updatedShop = Shop.formatShopForApp(shop);
  return res.status(200).send({ ...updatedShop });
};
