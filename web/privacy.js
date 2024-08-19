import { DeliveryMethod } from "@shopify/shopify-api";
import { Shop } from "../web/src/models/Shop.js";
import { CityList } from "./src/models/CityList.js";
import {
  CustomField,
  PaymentCustomization,
  Validation,
} from "./src/models/index.js";
/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },

  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },

  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log(shop, " ===>>>APP UNINSTALLED HOOK");
      const shopFound = await Shop.findByName(shop);
      await CityList.deleteAll(shopFound.id);
      await CustomField.deleteAll(shopFound.id);
      await PaymentCustomization.deleteAll(shopFound.id);
      await Validation.deleteAll(shopFound.id);
      await Shop.delete(shopFound.id);
    },
  },
};
