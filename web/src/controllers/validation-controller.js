import ShopifyService from "../services/shopify-service.js";
import { Validation } from "../models/index.js";

export const createValidation = async (req, res) => {
  const { id, shop_name, accessToken } = req.shop;
  const data = req.body;
  const service = new ShopifyService({
    shop_name,
    accessToken,
  });

  await Validation.getByTitle(data.title);
  const getFnId = await service.getShopifyFunctionId(
    "cart-checkout-validation"
  );
  await service.createValidation(getFnId, data);
  const createValidation = await Validation.create({
    shop_id: id,
    ...data,
  });

  res.status(200).json({
    message: `Validation  Setting  Created !! `,
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
    const getAll = await Validation.findAll();
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

    const validationId = await service.getValidationNodes(getByID.title);

    await service.updateValidation(validationId, data);

    const updatedValidation = await Validation.update({
      id,
      ...data,
    });
    res
      .status(200)
      .json({ message: `Validation id: ${id} is Updated `, updatedValidation });
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
    const pId = await service.getValidationNodes(getByID.title);
    await service.deleteValidation(pId);

    const deletedValidation = await Validation.delete(id);
    return res
      .status(200)
      .json({ message: `${deletedValidation.title} is successfully deleted` });
  } catch (error) {
    res.status(500).json({ error: "Error Deleting Validation:" });
  }
};
