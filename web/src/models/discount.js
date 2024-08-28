import prismaClient from "../db/prisma/index.js";

export class Discount {
  static async create(discountData) {
    const newDiscount = await prismaClient.discount.create({
      data: {
        ...discountData,
      },
    });
    return newDiscount;
  }

  static async getByTitle(title, shop_id) {
    const titleFound = await prismaClient.discount.findFirst({
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
    const discountFound = await prismaClient.discount.findUnique({
      where: {
        id,
      },
    });

    if (!discountFound) {
      throw new Error(`No reOrder found by this ID: ${id} `);
    }

    return discountFound;
  }

  static async findAll(shop_id) {
    const allDiscount = await prismaClient.discount.findMany({
      where: { shop_id },
    });
    return allDiscount;
  }

  static async update(discountData) {
    const updatedDiscount = await prismaClient.discount.update({
      where: { id: discountData.id },
      data: discountData,
    });
    return updatedDiscount;
  }
  static async delete(id) {
    const deletedDiscount = await prismaClient.discount.delete({
      where: { id },
    });
    return deletedDiscount;
  }

  static async deleteAll(id) {
    const deleteAll = await prismaClient.discount.deleteMany({
      where: { shop_id: id },
    });
    return deleteAll;
  }
}
