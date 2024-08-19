import ShopifyApp from "../shopify/index.js";
import prismaClient from "../db/prisma/index.js";
import { ShopifyService } from "../services/index.js";
import { startShopInstallQueue } from "../jobs/queue/index.js";
import { getNextBillingDate } from "../helpers/index.js";
import { Plan } from "./plan.js";

export class Shop {
  static async storeOrUpdateSession(session) {
    const { shop, accessToken, scope, state, id } = session;
    const shop_exist = await this.findById(shop);
    console.log("shop_exist", shop_exist);
    // this.findByName(shop);

    // checking the shop scope and accessToken if the shop already existed
    if (shop_exist && shop_exist.status === "active") {
      if (
        shop_exist.accessToken !== accessToken ||
        shop_exist.scope !== scope
      ) {
        await Shop.update({
          id: shop_exist.id,
          scope: scope,
          accessToken: accessToken,
        });
      }

      return true;
    }

    // checking if the shop is deleted before
    if (shop_exist && shop_exist.status === "uninstalled") {
      const update_shop = {
        id: shop_exist.id,
        accessToken,
        scope,
        state,
        status: "active",
      };
      const shop_updated = await this.update(update_shop);
      console.log("shop_updated", shop_updated);
      await startShopInstallQueue(shop_updated);
      return true;
    }

    const shopify_service = new ShopifyService({
      shop_name: shop,
      accessToken,
    });
    const shopify_shop = await shopify_service.getShopDetails();

    await Shop.create({
      shop_name: shop,
      session_id: id,
      shop_id: shopify_shop.id.toString(),
      name: shopify_shop.name,
      currency: shopify_shop.currency,
      status: "active",
      accessToken,
      scope,
      state,
    });

    return true;
  }
  static async create(shopData) {
    const shopExist = await this.findByName(shopData.shop_name);

    if (shopExist) {
      return;
    }
    const newShopCreated = await prismaClient.shop.create({
      data: {
        ...shopData,
      },
    });
    await startShopInstallQueue(newShopCreated);
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

  static async delete(id) {
    const deleteShop = await prismaClient.shop.delete({
      where: { id },
    });
    return deleteShop;
  }
  static async subscribedToPlan(shop_name, plan_id, charge_id = 0) {
    const type = plan_id;
    const plan = await Plan.getByType(type);
    if (!plan) throw new Error("Plan not found", plan_id);
    const shop = await this.findByName(shop_name);
    if (!shop) throw new Error("Shop Not Found [Plan.js]");
    const next_billing_date = getNextBillingDate();
    const updatedValues = {
      plan_id: plan.id,
      next_billing_date,
      plan_status: "active",
      shopify_charge_id: charge_id,
      plan_price: plan.price,
      plan_activated_date: Date.now(),
    };
    if (type === "essential") {
      updatedValues.payment_modification = true;
    } else if (type === "professional") {
      updatedValues.payment_modification = true;
      updatedValues.advanced_city_dropdown = true;
      updatedValues.field_validation = true;
      updatedValues.custom_field = true;
    }
    await prismaClient.shop.update({
      where: { id: shop.id },
      data: {
        ...updatedValues,
      },
    });
  }
}
