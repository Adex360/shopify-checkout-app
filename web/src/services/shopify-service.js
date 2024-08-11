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

  async getPaymentCustomizationNodes(title) {
    const queryString = {
      query: `
      query {
        paymentCustomizations(first: 100) {
          edges {
            node {
              id
              title
            }
          }
        }
      }
  `,
    };
    const resp = await this.post("/graphql.json", JSON.stringify(queryString));
    const nodes = resp.data.data.paymentCustomizations.edges;
    const paymentCustomizationNode = nodes.find(
      (edges) => edges.node.title === title
    );
    return paymentCustomizationNode.node.id.split("/").pop();
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
  }

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
    await this.post("/graphql.json", JSON.stringify(queryString));
  }

  async updatePaymentCustomization(fnId, cId, settingData) {
    const paymentCustomizationInput = {
      functionId: fnId,
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
        id: `gid://shopify/PaymentCustomization/${cId}`,
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
        id: `gid://shopify/PaymentCustomization/${id}`,
      },
    };
    await this.post("/graphql.json", JSON.stringify(queryString));
  }

  async createMetafield() {
    const MetafieldDefinitionInput = {
      // definition: {
      access: {
        admin: "MERCHANT_READ_WRITE",
      },
      key: "function-configuration",
      name: "Validation Configuration",
      namespace: "$app:cart-checkout-validation",
      ownerType: "VALIDATION",
      type: "json",
      // },
    };

    const queryString = {
      query: `
      mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          createdDefinition {
            id
            name
            namespace
            key
          }
          userErrors {
            field
            message
            code
          }
        }
      }
      `,
      variables: {
        definition: MetafieldDefinitionInput,
      },
    };

    await this.post("/graphql.json", JSON.stringify(queryString));
  }
  async getAllMetafield(title) {
    const queryString = {
      query: `
      query {
        metafieldDefinitions(first: 250, ownerType: VALIDATION) {
          edges {
            node {
              id
              name
            }   
          }
        }
      }
      `,
    };

    const resp = await this.post("/graphql.json", JSON.stringify(queryString));
    const nodes = resp.data.data.metafieldDefinitions.edges;
    const metafieldNode = nodes.find((edges) => edges.node.name === title);

    return metafieldNode.node.id;
  }

  async updateMetafield(fnId, cId, settingData) {
    const MetafieldDefinitionUpdateInput = {
      access: {
        admin: "MERCHANT_READ_WRITE",
      },
      key: "function-configuration",
      name: "Validation Configuration",
      namespace: "$app:cart-checkout-validation",
      ownerType: "VALIDATION",
      type: "json",
    };

    const queryString = {
      query: `
      mutation UpdateMetafieldDefinition($definition: MetafieldDefinitionUpdateInput!) {
        metafieldDefinitionUpdate(definition: $definition) {
          updatedDefinition {
            id
            name
            namespace
            key
            # add other return fields
          }
          userErrors {
            field
            message
            code
          }
        }
      }
      `,
      variables: {
        id: `gid://shopify/MetafieldDefinition/${cId}`,
        definition: MetafieldDefinitionUpdateInput,
      },
    };

    await this.post("/graphql.json", JSON.stringify(queryString));
  }

  async deleteMetafield(fnId, cId, settingData) {
    const queryString = {
      query: `
      mutation DeleteMetafieldDefinition {
        metafieldDefinitionDelete(id: $id, deleteAllAssociatedMetafields: $deleteAllAssociatedMetafields) {
          deletedDefinitionId
          userErrors {
            field
            message
            code
          }
        }
      }
      `,

      variables: {
        id: `gid://shopify/MetafieldDefinition/${cId}`,
        deleteAllAssociatedMetafields: true,
      },
    };

    await this.post("/graphql.json", JSON.stringify(queryString));
  }

  async createMetafieldSet(id, metafieldData) {
    console.log("idddd", id);
    const MetafieldsSetInput = {
      // {
      // "metafields": [
      // {
      key: "function-configuration",
      namespace: "$app:cart-checkout-validation",
      ownerId: "gid://shopify/Validation/8356117",
      //  id,
      //  "gid://shopify/MetafieldDefinition/34244198677",
      type: "json",
      value: JSON.stringify({
        data: metafieldData,
        // type: "test",
        // CountryCode: 3,
        // type: settingData.type,
        // payment_rule: settingData.payment_rule,
        // conditions: settingData.conditions,
        // payment_name: settingData.payment_name,
      }),
      // },

      // ]
      // }
    };

    const queryString = {
      query: `
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            namespace
            value
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }
      `,
      variables: {
        metafields: MetafieldsSetInput,
      },
    };

    const resp = await this.post("/graphql.json", JSON.stringify(queryString));
    console.log("aaa", resp.data.data.metafieldsSet.metafields);
  }

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
    console.log("resp", resp.data.data.validationCreate.validation);
  }

  async getValidationNodes(title) {
    const queryString = {
      query: `
      query {
        validations(first: 250) {
          edges {
            node {
              id
              title
            }   
          }
        }
      }
  `,
    };
    const resp = await this.post("/graphql.json", JSON.stringify(queryString));
    const nodes = resp.data.data.validations.edges;
    const paymentCustomizationNode = nodes.find(
      (edges) => edges.node.title === title
    );
    return paymentCustomizationNode.node.id.split("/").pop();
  }
  async updateValidation(cId, settingData) {
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
        id: `gid://shopify/Validation/${cId}`,
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
        id: `gid://shopify/Validation/${id}`,
      },
    };
    await this.post("/graphql.json", JSON.stringify(queryString));
  }
}

// get all metafields value
// {
//   "data": {
//     "metafieldDefinitions": {
//       "edges": [
//         {
//           "node": {
//             "id": "gid://shopify/MetafieldDefinition/34244198677",
//             "name": "Validation Configuration"
//           }
//         }
//       ]
//     }
//   },
