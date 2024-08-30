import ShopifyService from "../services/shopify-service.js";
import { Discount, Shop } from "../models/index.js";

export const createDiscount = async (req, res) => {
  const { id, shop_name, accessToken } = req.shop;
  const data = req.body;

  const service = new ShopifyService({
    shop_name,
    accessToken,
  });
  const getFnId = await service.getShopifyFunctionId("order-discount");
  await Discount.getByTitle(data.title, id);
  const discountId = await service.createDiscount(getFnId, data);
  const discount = await Discount.create({
    shop_id: id,
    discount_id: discountId,
    function_id: getFnId,
    ...data,
  });
  res.status(200).json({
    message: `Discount Created!!`,
    discount,
  });
};

export const getAllDiscount = async (req, res) => {
  try {
    let shopId;
    if (req.shop) {
      shopId = req.shop.id;
    } else {
      const { shop_name } = req.params;
      const shop = await Shop.findByName(shop_name);
      shopId = shop.id;
    }
    const getAll = await Discount.findAll(shopId);
    res.status(200).json({ allDiscount: getAll });
  } catch (error) {
    res.status(500).json({ error: "Error Getting All Discounts" });
  }
};

export const getByIdDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const getByID = await Discount.getByID(id);
    res.status(200).json({ getByID });
  } catch (error) {
    res.status(500).json({ error: "Error Getting Discount by Id:" });
  }
};

export const updateDiscount = async (req, res) => {
  try {
    const { shop_name, accessToken } = req.shop;
    const { id } = req.params;
    const data = req.body;
    const service = new ShopifyService({
      shop_name,
      accessToken,
    });
    const getByID = await Discount.getByID(id);
    if (getByID.enabled) {
      await service.activateDiscount(getByID.discount_id);
    } else {
      await service.deActivateDiscount(getByID.discount_id);
    }
    await service.deleteDiscount(getByID.discount_id);
    const discountId = await service.createDiscount(getByID.function_id, data);

    // await service.updateDiscount(getByID, data);

    const updateDiscount = await Discount.update({
      id,
      discount_id: discountId,
      ...data,
    });
    res.status(200).json({
      message: `Discount  Updated Successfully`,
      updateDiscount,
    });
  } catch (error) {
    res.status(500).json({ error: "Error Updating Discount :" });
  }
};
export const deleteDiscount = async (req, res) => {
  try {
    const { shop_name, accessToken } = req.shop;
    const { id } = req.params;
    const service = new ShopifyService({
      shop_name,
      accessToken,
    });
    const getByID = await Discount.getByID(id);
    await service.deleteDiscount(getByID.discount_id);
    const deletedPaymentCustomization = await Discount.delete(id);
    return res.status(200).json({
      message: `${deletedPaymentCustomization.title} is Successfully Deleted`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error Deleting Discount:" });
  }
};
