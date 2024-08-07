import ShopifyApp from "../shopify/index.js";
import prismaClient from "../db/prisma/index.js";

// import { startShopInstallQueue } from "../jobs/queue/shop-install.js";
// import { Plan } from "./Plan.js";

export class Shop {
  static async create(shopData) {
    const shopExist = await this.findByName(shopData.shop_name);

    if (shopExist) {
      return;
    }

    // const freePlan = await Plan.getFreePlan();

    const newShopCreated = await prismaClient.shop.create({
      data: {
        ...shopData,
      },
    });
    // await startShopInstallQueue(newShopCreated);

    return newShopCreated;
  }

  static async findByName(shop_name) {
    if (!shop_name)
      throw new Error("Please Provide the [shop_name] as an argument");
    const shopFound = await prismaClient.shop.findFirst({
      where: { shop_name },
    });
    if (!shopFound) {
      return;
    }
    return shopFound;
  }

  static async findById(id) {
    if (!id) throw new Error("Please Provide the [shop id] as an argument");

    const shopFound = await prismaClient.shop.findFirst({
      where: { id },
    });
    return shopFound;
  }

  static async update(shop) {
    const updatedShop = await prismaClient.shop.update({
      where: { id: shop.id },
      data: shop,
      include: {
        _count: {
          select: {
            subscribers: true,
          },
        },
        shop_settings: true,
        plan: true,
      },
    });

    return updatedShop;
  }
}
