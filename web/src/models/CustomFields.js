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
      throw new Error(`Title already exist  `);
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

  static async findAll() {
    const customFields = await prismaClient.custom_field.findMany();
    return customFields;
  }

  static async update(fieldData) {
    const updatedCustomField = await prismaClient.custom_field.update({
      where: { id: fieldData.id },
      data: validationData,
    });
    return updatedCustomField;
  }

  static async delete(id) {
    const deletedCustomField = await prismaClient.custom_field.delete({
      where: { id },
    });
    return deletedCustomField;
  }
}
