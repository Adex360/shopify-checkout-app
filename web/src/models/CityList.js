import prismaClient from "../db/prisma/index.js";
import { DEFAULT_TEST } from "../constants/index.js";
export class CityList {
  static async create(CityFields) {
    const newCityField = await prismaClient.city_list.create({
      data: {
        ...CityFields,
      },
    });
    return newCityField;
  }

  static async getByTitle(title) {
    const titleFound = await prismaClient.city_list.findUnique({
      where: {
        title,
      },
    });
    if (titleFound) {
      throw new Error(`Title already exist. Please choose a different title.`);
    }

    return titleFound;
  }
  static async getByID(id) {
    const customFieldFound = await prismaClient.city_list.findUnique({
      where: {
        id,
      },
    });

    if (!customFieldFound) {
      throw new Error(`No validation found by this ID: ${id} `);
    }

    return customFieldFound;
  }

  static async findAll() {
    const customFields = await prismaClient.city_list.findMany();
    return customFields;
  }

  static async update(fieldData) {
    const updatedCustomField = await prismaClient.city_list.update({
      where: { id: fieldData.id },
      data: fieldData,
    });
    return updatedCustomField;
  }

  static async delete(id) {
    const deletedCustomField = await prismaClient.city_list.delete({
      where: { id },
    });
    return deletedCustomField;
  }

  static async defaultSetting(shop_id) {
    console.log("hello shop id ", shop_id);
    console.log("qqqqq");
    const defaultSetting = await prismaClient.city_list.create({
      data: {
        shop_id,
        ...DEFAULT_TEST,
      },
    });
    return defaultSetting;
  }
}
