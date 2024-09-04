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

const SHOPIFY_API_VERSION = "2024-04";
const API_VERSION = SHOPIFY_API_VERSION;

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
      baseURL: `https://${this.shop_name}/admin/api/${API_VERSION}`,
      // ${LATEST_API_VERSION}
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

  async getShopifyFunctionId(extensionName) {
    const queryString = {
      query: `
      query {
        shopifyFunctions(first: 25) {
          nodes {
            app {
              title
            }
            apiType
            title
            id
          }
        }
      }
  `,
    };
    const resp = await this.post("/graphql.json", JSON.stringify(queryString));
    const nodes = resp.data.data.shopifyFunctions.nodes;
    const functionNode = nodes.find((node) => node.title === extensionName);
    return functionNode.id;
  }
  // payment

  async createPaymentCustomization(id, settingData) {
    const paymentCustomizationInput = {
      functionId: id,
      title: settingData.title,
      enabled: settingData.rule_status,
      metafields: [
        {
          namespace: "$app:payment-customization",
          key: "function-configuration",
          type: "json",
          value: JSON.stringify({
            type: settingData.type,
            payment_rule: settingData.payment_rule,
            conditions: settingData.conditions,
            payment_name: settingData.payment_name,
          }),
        },
      ],
    };
    const queryString = {
      query: `
      mutation createPaymentCustomization($input: PaymentCustomizationInput!) {
        paymentCustomizationCreate(paymentCustomization: $input) {
          paymentCustomization {
            id
          }
          userErrors {
            message
          }
        }
      }
  `,
      variables: {
        input: paymentCustomizationInput,
      },
    };
    const resp = await this.post("/graphql.json", JSON.stringify(queryString));
    const paymentId =
      resp.data.data.paymentCustomizationCreate.paymentCustomization.id;
    return paymentId;
  }
  async updatePaymentCustomization(paymentObj, settingData) {
    const paymentCustomizationInput = {
      functionId: paymentObj.function_id,
      title: settingData.title,
      enabled: settingData.rule_status,
      metafields: [
        {
          namespace: "$app:payment-customization",
          key: "function-configuration",
          type: "json",
          value: JSON.stringify({
            type: settingData.type,
            payment_rule: settingData.payment_rule,
            conditions: settingData.conditions,
            payment_name: settingData.payment_name,
          }),
        },
      ],
    };

    const queryString = {
      query: `
      mutation updatePaymentCustomization($id: ID!, $input: PaymentCustomizationInput!) {
        paymentCustomizationUpdate(id: $id, paymentCustomization: $input) {
          paymentCustomization {
            id
          }
          userErrors {
            message
          }
        }
      }
      `,
      variables: {
        id: paymentObj.payment_id,
        // `gid://shopify/PaymentCustomization/${cId}`,
        input: paymentCustomizationInput,
      },
    };

    await this.post("/graphql.json", JSON.stringify(queryString));
  }

  async deletePaymentCustomization(id) {
    const queryString = {
      query: `
      mutation paymentCustomizationDelete($id: ID!) {
        paymentCustomizationDelete(id: $id) {
          deletedId
          userErrors {
            field
            message
          }
        }
      }
  `,
      variables: {
        id: id,
      },
    };
    await this.post("/graphql.json", JSON.stringify(queryString));
  }

  // discount
  async createDiscount(id, settingData) {
    const DiscountAutomaticAppInput = {
      title: settingData.title,
      functionId: id,
      combinesWith: {
        orderDiscounts: settingData.combines_with.order,
        productDiscounts: settingData.combines_with.product,
      },
      startsAt: settingData.startsAt,
      endsAt: settingData.endsAt,
      metafields: [
        {
          namespace: "$app:order-discount",
          key: "function-configuration",
          type: "json",
          value: JSON.stringify({
            class: settingData.discount_class,
            message: settingData.discount_message,
            type: settingData.discount_type,
            value: settingData.discount_value,
            rule: settingData.discount_rule,
            hasCondition: settingData.has_condition,
            conditions: settingData.conditions,
            productVariantIds: settingData.variant_ids,
          }),
        },

        // {
        //   "namespace": "$app:order-discount",
        //   "key": "function-configuration",
        //   "type": "json",
        //   "value": "{\"discounts\":[{\"value\":{\"fixedAmount\":{\"amount\":5}},\"targets\":\n[{\"orderSubtotal\":{\"excludedVariantIds\":[]}}]}],\"discountApplicationStrategy\":\"FIRST\"}"
        // }
      ],
    };

    const queryString = {
      query: `
    mutation discountAutomaticAppCreate($automaticAppDiscount: DiscountAutomaticAppInput!) {
      discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) {
        userErrors {
          field
          message
        }
        automaticAppDiscount {
          discountId
        }
      }
    }
`,
      variables: {
        automaticAppDiscount: DiscountAutomaticAppInput,
      },
    };
    const resp = await this.post("/graphql.json", JSON.stringify(queryString));
    const discountId =
      resp.data.data.discountAutomaticAppCreate.automaticAppDiscount.discountId;
    return discountId;
  }

  // TODO
  async updateDiscount(discountObj, settingData) {
    const DiscountAutomaticAppInput = {
      title: settingData.title,
      functionId: discountObj.function_id,
      combinesWith: {
        orderDiscounts: settingData.combines_with.order,
        productDiscounts: settingData.combines_with.product,
      },
      startsAt: settingData.startsAt,
      endsAt: settingData.endsAt,
      // metafields: [
      //   {
      //     namespace: "$app:order-discount",
      //     key: "function-configuration",
      //     type: "json",
      //     value: JSON.stringify({
      //       class: settingData.discount_class,
      //       message: settingData.discount_message,
      //       type: settingData.discount_type,
      //       value: settingData.discount_value,
      //       rule: settingData.discount_rule,
      //       conditions: settingData.conditions,
      //     }),
      //   },
      // ],
    };

    const queryString = {
      query: `
      mutation discountAutomaticAppUpdate($automaticAppDiscount: DiscountAutomaticAppInput!, $id: ID!) {
        discountAutomaticAppUpdate(automaticAppDiscount: $automaticAppDiscount, id: $id) {
          automaticAppDiscount {
            discountId
            title
            startsAt
            endsAt
            status
            appDiscountType {
              appKey
              functionId
            }
            combinesWith {
              orderDiscounts
              productDiscounts
              shippingDiscounts
            }
          }
          userErrors {
            field
            message
          }
        }
      }
      `,
      variables: {
        automaticAppDiscount: DiscountAutomaticAppInput,
        id: discountObj.discount_id,
      },
    };

    await this.post("/graphql.json", JSON.stringify(queryString));
  }

  async deleteDiscount(id) {
    const queryString = {
      query: `
      mutation discountAutomaticDelete($id: ID!) {
        discountAutomaticDelete(id: $id) {
          deletedAutomaticDiscountId
          userErrors {
            field
            code
            message
          }
        }
      }
  `,
      variables: {
        id: id,
      },
    };
    await this.post("/graphql.json", JSON.stringify(queryString));
  }

  async deActivateDiscount(id) {
    const queryString = {
      query: `
      mutation discountAutomaticActivate($id: ID!) {
        discountAutomaticActivate(id: $id) {
          userErrors {
            field
            message
          }
        }
      }
  `,
      variables: {
        id: id,
      },
    };
    await this.post("/graphql.json", JSON.stringify(queryString));
  }
  async activateDiscount(id) {
    const queryString = {
      query: `
      mutation discountAutomaticActivate($id: ID!) {
        discountAutomaticActivate(id: $id) {
          userErrors {
            field
            message
          }
        }
      }
  `,
      variables: {
        id: id,
      },
    };
    await this.post("/graphql.json", JSON.stringify(queryString));
  }

  // validation
  async createValidation(id, settingData) {
    const ValidationCreateInput = {
      functionId: id,
      title: settingData.title,
      blockOnFailure: false,
      enable: true,
      metafields: [
        {
          namespace: "$app:cart-checkout-validation",
          key: "function-configuration",
          type: "json",
          value: JSON.stringify({
            setting: settingData,
          }),
        },
      ],
    };
    const queryString = {
      query: `
      mutation validationCreate($validation: ValidationCreateInput!) {
        validationCreate(validation: $validation) {  
          validation {
            id
           title
          }
          userErrors {
            field
            message
          }
        }
      }
  `,
      variables: {
        validation: ValidationCreateInput,
      },
    };
    const resp = await this.post("/graphql.json", JSON.stringify(queryString));
    const validationId = resp.data.data.validationCreate.validation.id;
    return validationId;
  }

  async updateValidation(validationObj, settingData) {
    const ValidationUpdateInput = {
      title: settingData.title,
      blockOnFailure: true,
      enable: settingData.enabled,
      metafields: [
        {
          namespace: "$app:cart-checkout-validation",
          key: "function-configuration",
          type: "json",
          value: JSON.stringify({
            setting: settingData,
          }),
        },
      ],
    };

    const queryString = {
      query: `
      mutation validationUpdate($id: ID!, $validation: ValidationUpdateInput!) {
        validationUpdate(id: $id, validation: $validation) {
          userErrors {
            field
            message
          }
          validation {
         id
          }
        }
      }
      `,
      variables: {
        id: validationObj.validation_id,
        //  `gid://shopify/Validation/${cId}`,
        validation: ValidationUpdateInput,
      },
    };

    await this.post("/graphql.json", JSON.stringify(queryString));
  }

  async deleteValidation(id) {
    const queryString = {
      query: `
      mutation validationDelete($id: ID!) {
        validationDelete(id: $id) {
          deletedId
          userErrors {
            field
            message
          }
        }
      }
  `,
      variables: {
        id: id,
      },
    };
    await this.post("/graphql.json", JSON.stringify(queryString));
  }
}
