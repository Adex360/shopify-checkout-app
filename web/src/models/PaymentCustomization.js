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

  static async findAll() {
    const reOrders = await prismaClient.payment_customization.findMany();
    return reOrders;
  }

  static async update(reOrderData) {
    // const upsertUser = await prisma.payment_customization.upsert({
    //   where: {
    //     shop_id: data.shop_id,
    //   },
    //   update: {
    //     ...reOrderData,
    //   },
    //   create: {
    //     ...reOrderData,
    //   },
    // });

    const updatedReorder = await prismaClient.payment_customization.update({
      where: { id: reOrderData.id },
      data: reOrderData,
    });
    return updatedReorder;
  }
}