import { CityList } from "../models/index.js";

export const createCityList = async (req, res) => {
  const { id } = req.shop;
  const data = req.body;
  const t = await CityList.getByTitle(data.country_name);
  const createCityList = await CityList.create({
    shop_id: id,
    ...data,
  });
  res.status(200).json({
    message: `City list Created !! `,
    createCityList,
  });
};

export const getAllCityList = async (req, res) => {
  try {
    const getAll = await CityList.findAll();
    res.status(200).json({ getAll });
  } catch (error) {
    res.status(500).json({ error: "Error Getting City List" });
  }
};
export const getByIdCityList = async (req, res) => {
  try {
    const { id } = req.params;
    const getByID = await CityList.getByID(id);
    res.status(200).json({
      getByID,
    });
  } catch (error) {
    res.status(500).json({ error: "Error Getting City List by Id:" });
  }
};
export const updateCityList = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedCityList = await CityList.update({
      id,
      ...data,
    });
    res.status(200).json({
      message: `City list for id: ${id} is Updated `,
      updatedCityList,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating City List:" });
  }
};
export const deleteCityList = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCityList = await CityList.delete(id);
    res.status(200).json({
      message: `City list for ${deletedCityList.country_name} successfully deleted`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating City List" });
  }
};
