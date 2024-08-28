import prismaClient from "../db/prisma/index.js";

export class Validation {
  static async create(validation) {
    const newValidation = await prismaClient.validation.create({
      data: {
        ...validation,
      },
    });
    return newValidation;
  }

  // static async getByTitle(title) {
  //   const titleFound = await prismaClient.validation.findUnique({
  //     where: {
  //       title,
  //     },
  //   });
  //   if (titleFound) {
  //     throw new Error(`Title already exist  `);
  //   }

  //   return titleFound;
  // }
  static async getByTitle(title, shop_id) {
    const titleFound = await prismaClient.validation.findFirst({
      where: {
        title,
        shop_id,
      },
    });
    if (titleFound) {
      throw new Error(`Title already exist. Please choose a different title.`);
    }

    return titleFound;
  }
  static async getByID(id) {
    const validationFound = await prismaClient.validation.findUnique({
      where: {
        id,
      },
    });

    if (!validationFound) {
      throw new Error(`No validation found by this ID: ${id} `);
    }

    return validationFound;
  }

  static async findAll(shop_id) {
    const validations = await prismaClient.validation.findMany({
      where: { shop_id },
    });
    return validations;
  }

  static async update(validationData) {
    const updatedValidation = await prismaClient.validation.update({
      where: { id: validationData.id },
      data: validationData,
    });
    return updatedValidation;
  }

  static async delete(id) {
    const deletedValidation = await prismaClient.validation.delete({
      where: { id },
    });
    return deletedValidation;
  }

  static async deleteAll(id) {
    const deleteShop = await prismaClient.validation.deleteMany({
      where: { shop_id: id },
    });
    return deleteShop;
  }
}
