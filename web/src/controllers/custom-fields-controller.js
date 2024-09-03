import { CustomField, Shop } from "../models/index.js";

export const createCustomFields = async (req, res) => {
  const { id } = req.shop;
  const data = req.body;

  await CustomField.getByTitle(data.title);
  const createCustomFIeld = await CustomField.create({
    shop_id: id,
    ...data,
  });
  res.status(200).json({
    message: `CustomFields for Title:${data.title}  Created Successfully  !! `,
    createCustomFIeld,
  });
};

export const getAllCustomFields = async (req, res) => {
  try {
    let shopId;
    if (req.shop) {
      shopId = req.shop.id;
    } else {
      const { shop_name } = req.params;
      const shop = await Shop.findByName(shop_name);
      shopId = shop.id;
    }
    const getAll = await CustomField.findAll(shopId);
    res.status(200).json({ getAll });
  } catch (error) {
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
      message: `Custom Field Form for Title:${data.title} Updated Successfully  `,
      updatedCustomField,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating Custom field:" });
  }
};
export const deleteFields = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedForm = await CustomField.delete(id);
    res.status(200).json({
      message: `Custom Field Form for Title:${deletedForm.title} is deleted successfully `,
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting customField Form" });
  }
};
