import prismaClient from "../db/prisma/index.js";
import { DEFAULT_CITY_LIST } from "../constants/index.js";
export class CityList {
  static async create(cityFields) {
    const newCityField = await prismaClient.city_list.create({
      data: {
        ...cityFields,
      },
    });
    return newCityField;
  }

  static async getByTitle(name, id) {
    const titleFound = await prismaClient.city_list.findUnique({
      where: {
        shop_id_country_name: {
          shop_id: id,
          country_name: name,
        },
      },
    });
    if (titleFound) {
      throw new Error(`City list with the given name already exist`);
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

  static async findAll(shop_id) {
    const customFields = await prismaClient.city_list.findMany({
      where: { shop_id },
    });
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
    const defaultSetting = await prismaClient.city_list.create({
      data: {
        shop_id,
        ...DEFAULT_CITY_LIST,
      },
    });
    return defaultSetting;
  }
  static async activeCountries() {
    const active = await prismaClient.city_list.findMany({
      where: { enabled: true },
      select: { country_name: true },
    });
    return active;
  }
  static async deleteAll(id) {
    const deleteAll = await prismaClient.city_list.deleteMany({
      where: { shop_id: id },
    });
    return deleteAll;
  }
}
