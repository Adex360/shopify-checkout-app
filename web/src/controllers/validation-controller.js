import ShopifyService from "../services/shopify-service.js";
import { Validation } from "../models/index.js";

export const createValidation = async (req, res) => {
  const { id, shop_name, accessToken } = req.shop;
  const data = req.body;
  const service = new ShopifyService({
    shop_name,
    accessToken,
  });
  const getFnId = await service.getShopifyFunctionId(
    "cart-checkout-validation"
  );
  await Validation.getByTitle(data.title);

  const validationId = await service.createValidation(getFnId, data);
  const createValidation = await Validation.create({
    shop_id: id,
    validation_id: validationId,
    function_id: getFnId,
    ...data,
  });

  res.status(200).json({
    message: `Validation Setting  Created Successfully !! `,
    createValidation,
  });
};

export const getByIdValidation = async (req, res) => {
  try {
    const { id } = req.params;
    const getByID = await Validation.getByID(id);
    res.status(200).json({ getByID });
  } catch (error) {
    res.status(500).json({ error: "Error Getting Validation by Id:" });
  }
};

export const getAllValidation = async (req, res) => {
  try {
    const shop = req.shop;
    const getAll = await Validation.findAll(shop.id);
    if (getAll.length >= 5) {
      return res.status(200).json({
        message:
          "You have reached the maximum limit of 5 Validations. No additional Validation can be added.",
        validations: getAll,
      });
    }
    res.status(200).json({ getAll });
  } catch (error) {
    res.status(500).json({ error: "Error Getting All Validation:" });
  }
};

export const updateValidation = async (req, res) => {
  try {
    const { shop_name, accessToken } = req.shop;
    const { id } = req.params;
    const data = req.body;
    const service = new ShopifyService({
      shop_name,
      accessToken,
    });
    const getByID = await Validation.getByID(id);
    await service.updateValidation(getByID, data);
    const updatedValidation = await Validation.update({
      id,
      ...data,
    });
    res.status(200).json({
      message: `Validation  Updated Successfully `,
      updatedValidation,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating Validation :" });
  }
};

export const deleteValidation = async (req, res) => {
  try {
    const { shop_name, accessToken } = req.shop;
    const { id } = req.params;
    const service = new ShopifyService({
      shop_name,
      accessToken,
    });
    const getByID = await Validation.getByID(id);
    await service.deleteValidation(getByID.validation_id);
    const deletedValidation = await Validation.delete(id);
    return res
      .status(200)
      .json({ message: `${deletedValidation.title} is Successfully Deleted` });
  } catch (error) {
    res.status(500).json({ error: "Error Deleting Validation:" });
  }
};
