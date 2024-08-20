import { CustomField } from "../models/index.js";

export const createCustomFields = async (req, res) => {
  console.log("ss");
  const { id } = req.shop;
  const data = req.body;

  await CustomField.getByTitle(data.title);
  const createCustomFIeld = await CustomField.create({
    shop_id: id,
    ...data,
  });
  res.status(200).json({
    message: `CustomFields Created Successfully  !! `,
    createCustomFIeld,
  });
};

export const getAllCustomFields = async (req, res) => {
  try {
    const getAll = await CustomField.findAll();
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
      message: `Custom Field Updated Successfully  `,
      updatedCustomField,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating Custom field:" });
  }
};
export const deleteFields = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomFields = await CustomField.delete(id);
    res.status(200).json({
      message: `${deletedCustomFields.title} is successfully deleted`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating Custom field" });
  }
};
