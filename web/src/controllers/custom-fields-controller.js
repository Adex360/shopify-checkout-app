import ShopifyService from "../services/shopify-service.js";
import { CustomField } from "../models/index.js";

export const createCustomFields = async (req, res) => {
  try {
    res.status(200).json({
      message: `Customization Setting for ${req.body.type} Created !! `,
      createReOrder,
    });
  } catch (error) {
    console.error("Error creating Customization:", error);
    res.status(500).json({ error: "Error creating Customization" });
  }
};

export const getAllCustomFields = async (req, res) => {
  try {
    res.status(200).json({
      message: `Customization Setting for ${req.body.type} Created !! `,
      createReOrder,
    });
  } catch (error) {
    console.error("Error creating Customization:", error);
    res.status(500).json({ error: "Error creating Customization" });
  }
};
export const getByIdCustomFields = async (req, res) => {
  try {
    res.status(200).json({
      message: `Customization Setting for ${req.body.type} Created !! `,
      createReOrder,
    });
  } catch (error) {
    console.error("Error creating Customization:", error);
    res.status(500).json({ error: "Error creating Customization" });
  }
};
export const updateCustomFields = async (req, res) => {
  try {
    res.status(200).json({
      message: `Customization Setting for ${req.body.type} Created !! `,
      createReOrder,
    });
  } catch (error) {
    console.error("Error creating Customization:", error);
    res.status(500).json({ error: "Error creating Customization" });
  }
};
export const deleteFields = async (req, res) => {
  try {
    res.status(200).json({
      message: `Customization Setting for ${req.body.type} Created !! `,
      createReOrder,
    });
  } catch (error) {
    console.error("Error creating Customization:", error);
    res.status(500).json({ error: "Error creating Customization" });
  }
};
