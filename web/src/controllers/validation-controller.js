import ShopifyService from "../services/shopify-service.js";
import { Validation } from "../models/index.js";

export const createValidation = async (req, res) => {
  try {
    const { id } = req.shop;
    const data = req.body;
    const createValidation = await Validation.create({
      shop_id: id,
      ...data,
    });

    res.status(200).json({
      message: `Validation  Setting  Created !! `,
      createValidation,
    });
  } catch (error) {
    console.error("Error creating Validation:", error);
    res.status(500).json({ error: "Error creating Validation" });
  }
};

export const getByIdValidation = async (req, res) => {
  try {
    const { id } = req.params;
    const getByID = await Validation.getByID(id);
    res.status(200).json({ getByID });
  } catch (error) {
    console.error("Error Getting Validation by Id:", error);
    res.status(500).json({ error: "Error Getting Validation by Id:" });
  }
};

export const getAllValidation = async (req, res) => {
  try {
    const getAll = await Validation.findAll();
    res.status(200).json({ getAll });
  } catch (error) {
    console.error("Error Getting All Validation:", error);
    res.status(500).json({ error: "Error Getting All Validation:" });
  }
};

export const updateValidation = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedReOrder = await Validation.update({
      id,
      ...data,
    });
    res
      .status(200)
      .json({ message: `Validation id: ${id} is Updated `, updatedReOrder });
  } catch (error) {
    console.error("Error updating Validation:", error);
    res.status(500).json({ error: "Error updating Validation :" });
  }
};

export const deleteValidation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedValidation = await Validation.delete(id);
    return res
      .status(200)
      .json({ message: `Validation id : ${deletedValidation.id} deleted` });
  } catch (error) {
    console.error("Error Deleting Validation:", error);
    res.status(500).json({ error: "Error Deleting Validation:" });
  }
};
