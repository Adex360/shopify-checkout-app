import ShopifyApp from "../shopify/index.js";
import prismaClient from "../db/prisma/index.js";

export class PaymentCustomization {
  static async create(reOrderData) {
    const newReorder = await prismaClient.payment_customization.create({
      data: {
        ...reOrderData,
      },
    });
    return newReorder;
  }

  static async getByTitle(title) {
    const titleFound = await prismaClient.payment_customization.findUnique({
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
    const reOrderfound = await prismaClient.payment_customization.findUnique({
      where: {
        id,
      },
    });

    if (!reOrderfound) {
      throw new Error(`No reOrder found by this ID: ${id} `);
    }

    return reOrderfound;
  }

  static async findAll(shop_id) {
    const reOrders = await prismaClient.payment_customization.findMany({
      where: { shop_id },
    });
    return reOrders;
  }

  static async update(reOrderData) {
    const updatedReorder = await prismaClient.payment_customization.update({
      where: { id: reOrderData.id },
      data: reOrderData,
    });
    return updatedReorder;
  }
  static async delete(id) {
    const deletedPaymentCustomization =
      await prismaClient.payment_customization.delete({
        where: { id },
      });
    return deletedPaymentCustomization;
  }

  static async count(options = {}) {
    const whereClause = {
      shop_id: options.shop_id,
    };

    if (options.type) {
      whereClause.type = options.type;
    }

    if (options.rule_status === true) {
      whereClause.rule_status = options.rule_status;
    }

    const count = await prisma.payment_customization.count({
      where: whereClause,
    });

    return count;
  }
  static async deleteAll(id) {
    const deleteAll = await prismaClient.payment_customization.deleteMany({
      where: { shop_id: id },
    });
    return deleteAll;
  }
}
