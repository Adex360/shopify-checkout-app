import ShopifyService from "../services/shopify-service.js";
import { PaymentCustomization } from "../models/index.js";
import prismaClient from "../db/prisma/index.js";

export const getPaymentCustomizationById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.shop);

    const service = new ShopifyService({
      shop_name: req.session.shop,
      accessToken: req.session.accessToken,
    });
    const paymentCustomization = await service.getPaymentCustomization(id);
    //   const query = `
    //     query getPaymentCustomization($id: ID!) {
    //       paymentCustomization(id: $id) {
    //         id
    //         metafield(namespace: "$app:payment-customization", key: "function-configuration") {
    //           value
    //         }
    //       }
    //     }
    //   `;

    //   try {
    //     const response = await axios.post(
    //       SHOPIFY_API_URL,
    //       { query, variables: { id: `gid://shopify/PaymentCustomization/${id}` } },
    //       { headers: { "X-Shopify-Access-Token": ACCESS_TOKEN } }
    //     );

    //     const metafield = response.data.data.paymentCustomization.metafield.value;
    return res.status(200).send({
      //   metafield,
      paymentCustomization,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPaymentCustomization = async (req, res) => {
  const { id } = req.params;
  const { type, paymentMethodName, cartTotal, codAtTop } = req.body;

  const mutation =
    id === "new"
      ? `
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
  `
      : `
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
  `;

  const variables = {
    input: {
      functionId: req.params.functionId,
      title:
        type === "hide"
          ? `Hide ${paymentMethodName} if cart total is larger than ${cartTotal}`
          : `Rename ${paymentMethodName}`,
      enabled: true,
      metafields: [
        {
          namespace: "$app:payment-customization",
          key: "function-configuration",
          type: "json",
          value: JSON.stringify({
            type,
            paymentMethodName,
            cartTotal,
            codAtTop,
          }),
        },
      ],
    },
  };

  try {
    const response = await axios.post(
      SHOPIFY_API_URL,
      {
        query: mutation,
        variables:
          id === "new"
            ? { input: variables.input }
            : {
                id: `gid://shopify/PaymentCustomization/${id}`,
                input: variables.input,
              },
      },
      { headers: { "X-Shopify-Access-Token": ACCESS_TOKEN } }
    );

    const result =
      id === "new"
        ? response.data.data.paymentCustomizationCreate
        : response.data.data.paymentCustomizationUpdate;

    if (result.userErrors.length) {
      res.status(400).json({ errors: result.userErrors });
    } else {
      return res.status(200).send({
        success: true,
        id: result.paymentCustomization.id,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createReorderPaymentCustomization = async (req, res) => {
  try {
    const { shop_name, accessToken } = req.shop;
    const data = req.body;
    const shop = req.shop;

    // const createReOrder = await PaymentCustomization.create({
    //   shop_id: shop.id,
    //   ...data,
    // });
    const service = new ShopifyService({
      shop_name,
      accessToken,
    });
    const get = await service.getPaymentCustomizationNodes();
    console.log("get ?", get);
    // const getFnId = await service.getShopifyFunctionId("payment-customization");
    // await service.createPaymentCustomization(getFnId, data);

    res.status(200).json({
      message: `Customization Setting for ${req.body.type} Created !! `,
      createReOrder,
    });
  } catch (error) {
    console.error("Error creating Customization:", error);
    res.status(500).json({ error: "Error creating Customization" });
  }
};

export const getReorderByIdPaymentCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const getByID = await PaymentCustomization.getByID(id);

    res.status(200).json({ getByID });
  } catch (error) {
    console.error("Error Getting Customization by Id:", error);
    res.status(500).json({ error: "Error Getting Customization by Id:" });
  }
};

export const getAllReorderPaymentCustomization = async (req, res) => {
  try {
    const getAll = await PaymentCustomization.findAll();
    res.status(200).json({ getAll });
  } catch (error) {
    console.error("Error Getting All Customization:", error);
    res.status(500).json({ error: "Error Getting All Customization :" });
  }
};

export const updateReorderPaymentCustomization = async (req, res) => {
  try {
    const { id } = req.params;

    const getByID = await PaymentCustomization.getByID(id);
    console.log("get by id ", getByID);
    const data = req.body;
    const updatedReOrder = await PaymentCustomization.update({
      id,
      ...data,
    });

    res
      .status(200)
      .json({ message: `Customization id: ${id} is Updated `, updatedReOrder });
  } catch (error) {
    console.error("Error updating Customization:", error);
    res.status(500).json({ error: "Error updating Customization :" });
  }
};
