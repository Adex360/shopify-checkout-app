import prismaClient from "../db/prisma/index.js";
import { ShopifyService } from "../services/index.js";
import { startShopInstallQueue } from "../jobs/queue/index.js";
import { getNextBillingDate } from "../helpers/index.js";
import { Plan } from "./plan.js";

export class Shop {
  static async storeOrUpdateSession(session) {
    const { shop, accessToken, scope, state, id } = session;
    const shop_exist = await this.findById(shop);

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

    if (shop_exist && shop_exist.status === "uninstalled") {
      const update_shop = {
        id: shop_exist.id,
        accessToken,
        scope,
        state,
        status: "active",
      };
      const shop_updated = await this.update(update_shop);
      await startShopInstallQueue(shop_updated);
      return true;
    }

    const shopify_service = new ShopifyService({
      shop_name: shop,
      accessToken,
    });
    const shopify_shop = await shopify_service.getShopDetails();
    await this.create({
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
  static formatShopForApp(shop) {
    const copied_shop = { ...shop };
    delete copied_shop.accessToken;
    delete copied_shop.scope;
    delete copied_shop.state;
    delete copied_shop.status;
    delete copied_shop.shopify_charge_id;
    return copied_shop;
  }
}
