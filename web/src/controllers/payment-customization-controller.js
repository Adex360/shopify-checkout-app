import ShopifyService from "../services/shopify-service.js";
import { PaymentCustomization } from "../models/index.js";

export const createPaymentCustomization = async (req, res) => {
  try {
    const { id, shop_name, accessToken } = req.shop;
    const data = req.body;

    await PaymentCustomization.getByTitle(data.title);
    const createReOrder = await PaymentCustomization.create({
      shop_id: id,
      ...data,
    });
    const service = new ShopifyService({
      shop_name,
      accessToken,
    });

    // create
    const getFnId = await service.getShopifyFunctionId("payment-customization");
    await service.createPaymentCustomization(getFnId, data);

    res.status(200).json({
      message: `Customization Setting for ${req.body.type} Created !! `,
      createReOrder,
    });
  } catch (error) {
    console.error("Error creating Customization:", error);
    res.status(500).json({ error: "Error creating Customization" });
  }
};

export const getByIdPaymentCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const getByID = await PaymentCustomization.getByID(id);

    res.status(200).json({ getByID });
  } catch (error) {
    console.error("Error Getting Customization by Id:", error);
    res.status(500).json({ error: "Error Getting Customization by Id:" });
  }
};

export const getAllPaymentCustomization = async (req, res) => {
  try {
    const getAll = await PaymentCustomization.findAll();
    res.status(200).json({ getAll });
  } catch (error) {
    console.error("Error Getting All Customization:", error);
    res.status(500).json({ error: "Error Getting All Customization :" });
  }
};

export const updatePaymentCustomization = async (req, res) => {
  try {
    const { shop_name, accessToken } = req.shop;
    const { id } = req.params;
    const data = req.body;

    const service = new ShopifyService({
      shop_name,
      accessToken,
    });
    const getByID = await PaymentCustomization.getByID(id);
    const paymentId = await service.getPaymentCustomizationNodes(getByID.title);
    const getFnId = await service.getShopifyFunctionId("payment-customization");
    await service.updatePaymentCustomization(getFnId, paymentId, data);

    const updatedReOrder = await PaymentCustomization.update({
      id,
      ...data,
    });
    res
      .status(200)
      .json({ message: `Customization id: ${id} is Updated `, updatedReOrder });
  } catch (error) {
    console.error("Error updating Customization:", error);
    res.status(500).json({ error: "Error updating Customization :" });
  }
};
export const deletePaymentCustomization = async (req, res) => {
  try {
    const { shop_name, accessToken } = req.shop;
    const { id } = req.params;
    const service = new ShopifyService({
      shop_name,
      accessToken,
    });
    const getByID = await PaymentCustomization.getByID(id);
    const pId = await service.getPaymentCustomizationNodes(getByID.title);
    await service.deletePaymentCustomization(pId);

    const deletedPaymentCustomization = await PaymentCustomization.delete(id);
    return res.status(200).json({
      message: `Validation id : ${deletedPaymentCustomization.id} deleted`,
    });
  } catch (error) {
    console.error("Error Deleting Validation:", error);
    res.status(500).json({ error: "Error Deleting Validation:" });
  }
};
