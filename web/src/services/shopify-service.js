import dotenv from "dotenv";
import axios from "axios";
import { LATEST_API_VERSION } from "@shopify/shopify-api";
import { sleep } from "../helpers/index.js";

dotenv.config();

export const WEBHOOK_TOPICS = [
  "app/uninstalled",
  "orders/fulfilled",
  "customers/create",
  "customers/update",
  "customers/delete",
  "shop/update",
];

export default class ShopifyService {
  shop_name = null;
  accessToken = null;
  isLimitExceed;
  maxLimit;
  axios;

  constructor({ shop_name, accessToken }) {
    this.shop_name = shop_name;
    this.accessToken = accessToken;
    this.isLimitExceed = false;
    this.maxLimit = 40;

    this.$init();
  }

  $init() {
    const service = axios.create({
      baseURL: `https://${this.shop_name}/admin/api/${LATEST_API_VERSION}`,
    });

    service.interceptors.request.use(
      async (config) => {
        config.headers["Content-Type"] = "application/json";
        config.headers["X-Shopify-Access-Token"] = this.accessToken;
        if (this.isLimitExceed) await sleep(10000);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    service.interceptors.response.use(
      async (config) => {
        await this.checkForApiLimit(config);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axios = service;
    return this;
  }

  limitExceed(requestMade) {
    if (!requestMade) return false;
    const arr = requestMade.split("/");
    const current = +arr[0];
    const total = +arr[1];
    this.isLimitExceed = current > (total == 80 ? 50 : 20);
    this.maxLimit = total;
    return this.isLimitExceed;
  }

  async checkForApiLimit(options) {
    const { headers } = options;
    const apiLimit = headers["x-shopify-shop-api-call-limit"];

    if (this.limitExceed(apiLimit)) return sleep(10000);
    return sleep(150);
  }

  async get(path) {
    return this.axios.get(path);
  }
  async post(path, body = {}) {
    return this.axios.post(path, body);
  }
  async delete(path) {
    return this.axios.delete(path);
  }
  async put(path, body = {}) {
    return this.axios.put(path, body);
  }

  async getShopDetails() {
    const resp = await this.get("/shop.json");
    return resp.data.shop;
  }

  async cancelCharge(charge_id) {
    return this.delete(`/recurring_application_charges/${charge_id}.json`);
  }

  async getWebhookDetails() {
    const resp = await this.get("/webhooks.json");
    return resp.data.webhooks;
  }

  async installWebhook({ topic, address }) {
    if (!address) return console.log("WEBHOOK ADDRESS NOT DEFINED");
    try {
      const resp = await this.post("/webhooks.json", {
        webhook: {
          topic,
          address,
          format: "json",
        },
      });
      return resp.data.webhook;
    } catch (error) {
      console.log("ERROR########", error.response.data);
    }
  }

  async installAllWebhooks() {
    for (const topic of WEBHOOK_TOPICS) {
      await this.installWebhook({
        topic,
        address: process.env.AWS_WEBHOOK_EVENT_RULE_ARN,
      });
    }

    return;
  }

  async getThemeId() {
    const resp = await this.axios.get("/themes.json");
    const { themes } = resp.data;
    const currentTheme = themes.find((theme) => theme.role === "main");

    return currentTheme.id;
  }

  async getPaymentCustomization(id) {
    const queryString = {
      query: `
    query getPaymentCustomization($id: ID!) {
      paymentCustomization(id: $id) {
        id
        metafield(namespace: "$app:payment-customization", key: "function-configuration") {
          value
        }
      }
    }
  `,
      variables: {
        id: `gid://shopify/PaymentCustomization/${id}`,
      },
    };
    const resp = await this.post("/graphql.json", JSON.stringify(queryString));
    const result = resp.data.data.paymentCustomization.metafield.value;
    console.log("result###", result);
  }
}
