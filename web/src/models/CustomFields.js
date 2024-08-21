import prismaClient from "../db/prisma/index.js";

export class CustomField {
  static async create(customFields) {
    const newCustomField = await prismaClient.custom_field.create({
      data: {
        ...customFields,
      },
    });
    return newCustomField;
  }

  static async getByTitle(title) {
    const titleFound = await prismaClient.custom_field.findUnique({
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
    const customFieldFound = await prismaClient.custom_field.findUnique({
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
    const customFields = await prismaClient.custom_field.findMany({
      where: { shop_id },
    });
    return customFields;
  }

  static async update(fieldData) {
    const updatedCustomField = await prismaClient.custom_field.update({
      where: { id: fieldData.id },
      data: fieldData,
    });
    return updatedCustomField;
  }

  static async delete(id) {
    const deleteAll = await prismaClient.custom_field.delete({
      where: { id },
    });
    return deleteAll;
  }
  static async deleteAll(id) {
    const deleteAll = await prismaClient.custom_field.deleteMany({
      where: { shop_id: id },
    });
    return deleteAll;
  }
}
