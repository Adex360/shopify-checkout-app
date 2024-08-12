import ShopifyService from "../services/shopify-service.js";
import { CustomField } from "../models/index.js";

export const createCustomFields = async (req, res) => {
  try {
    const { id, shop_name, accessToken } = req.shop;
    const data = req.body;
    const service = new ShopifyService({
      shop_name,
      accessToken,
    });
    const createCustomFIeld = await CustomField.create({
      shop_id: id,
      ...data,
    });
    res.status(200).json({
      message: `CustomFields Created !! `,
      createCustomFIeld,
    });
  } catch (error) {
    console.error("Error creating CustomFields:", error);
    res.status(500).json({ error: "Error creating CustomFields" });
  }
};

export const getAllCustomFields = async (req, res) => {
  try {
    const getAll = await CustomField.findAll();
    res.status(200).json({ getAll });
  } catch (error) {
    console.error("Error Getting Custom Fields", error);
    res.status(500).json({ error: "Error Getting Custom Fields" });
  }
};
export const getByIdCustomFields = async (req, res) => {
  try {
    const { id } = req.params;
    const getByID = await CustomField.getByID(id);
    res.status(200).json({
      getByID,
    });
  } catch (error) {
    console.error("Error Getting Custom Field by Id:", error);
    res.status(500).json({ error: "Error Getting Custom Field by Id:" });
  }
};
export const updateCustomFields = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedCustomField = await CustomField.update({
      id,
      ...data,
    });
    res.status(200).json({
      message: `Custom Field id: ${id} is Updated `,
      updatedCustomField,
    });
  } catch (error) {
    console.error("Error updating Custom field:", error);
    res.status(500).json({ error: "Error updating Custom field:" });
  }
};
export const deleteFields = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomFields = await CustomField.delete(id);
    res.status(200).json({
      message: `Custom Field id : ${deletedCustomFields.id} deleted`,
    });
  } catch (error) {
    console.error("Error creating Customization:", error);
    res.status(500).json({ error: "Error creating Customization" });
  }
};
