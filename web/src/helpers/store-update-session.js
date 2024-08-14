import { ShopifyService } from "../services/index.js";
import { Shop } from "../models/index.js";
import { startShopInstallQueue } from "../jobs/queue/index.js";

export const storeOrUpdateSession = async (session) => {
  console.log("********* [storeOrUpdateSession] *********", session);
  const { shop, accessToken, scope, state, id } = session;
  try {
    const shop_exist = await Shop.findByName(shop);
    if (shop_exist && shop_exist.status === "active") {
      console.log("********* [Shop Existed] *********");
      return true;
    }

    if (shop_exist && shop_exist.status === "uninstalled") {
      console.log("********* [Shop Existed But Uninstalled] *********");
      const update_shop = {
        id: shop_exist.id,
        accessToken,
        scope,
        state,
        status: "active",
      };
      const shop_updated = await Shop.update(update_shop);

      await startShopInstallQueue(shop_updated);

      return true;
    }

    console.log("********* [Shop doesn't Existed] *********");

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
  } catch (err) {
    console.log("Error in storeOrUpdateSession", err);
  }
  return true;
};
