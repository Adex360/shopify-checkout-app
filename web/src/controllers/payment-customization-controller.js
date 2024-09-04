import ShopifyService from "../services/shopify-service.js";
import { PaymentCustomization, CityList } from "../models/index.js";

export const createPaymentCustomization = async (req, res) => {
  const { id, shop_name, accessToken } = req.shop;
  const data = req.body;
  const service = new ShopifyService({
    shop_name,
    accessToken,
  });
  const getFnId = await service.getShopifyFunctionId("payment-customization");
  await PaymentCustomization.getByTitle(data.title, id);
  const paymentId = await service.createPaymentCustomization(getFnId, data);
  const createReOrder = await PaymentCustomization.create({
    shop_id: id,
    payment_id: paymentId,
    function_id: getFnId,
    ...data,
  });

  res.status(200).json({
    message: `Payment Customization Setting for Type:${req.body.type} Created !! `,
    createReOrder,
  });
};

export const getAllPaymentCustomization = async (req, res) => {
  try {
    const { id } = req.shop;
    const getAll = await PaymentCustomization.findAll(id);
    const types = ["rename", "hide", "re-order"];

    const counts = {};
    for (const type of types) {
      const typeCount = await PaymentCustomization.count({
        type: type,
        shop_id: id,
      });

      counts[type] = typeCount;
    }

    const activeCount = await PaymentCustomization.count({
      rule_status: true,
      shop_id: id,
    });
    const activeCountries = await CityList.activeCountries();
    const countryNames = activeCountries.map((country) => country.country_name);

    if (getAll.length >= 5) {
      return res.status(200).json({
        message:
          "You have reached the maximum limit of 5 payment customizations. No additional customizations can be added.",
        customizations: getAll,
        count: counts,
        activeCount: activeCount,
        activeCountries: countryNames,
      });
    }

    res.status(200).json({ customizations: getAll });
  } catch (error) {
    res.status(500).json({ error: "Error Getting All Customizations:" });
  }
};

export const getByIdPaymentCustomization = async (req, res) => {
  try {
    const { id } = req.params;
    const getByID = await PaymentCustomization.getByID(id);
    res.status(200).json({ getByID });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error Getting Payment Customization by Id:" });
  }
};

export const updatePaymentCustomization = async (req, res) => {
  try {
    const { shop_name, accessToken } = req.shop;
    const { id } = req.params;
    const data = req.body;

    const service = new ShopifyService({
      shop_name,
      accessToken,
    });
    const getByID = await PaymentCustomization.getByID(id);
    await service.updatePaymentCustomization(getByID, data);
    const updatedReOrder = await PaymentCustomization.update({
      id,
      ...data,
    });
    res.status(200).json({
      message: `Payment Customization Updated Successfully`,
      updatedReOrder,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating Customization :" });
  }
};
export const deletePaymentCustomization = async (req, res) => {
  try {
    const { shop_name, accessToken } = req.shop;
    const { id } = req.params;
    const service = new ShopifyService({
      shop_name,
      accessToken,
    });
    const getByID = await PaymentCustomization.getByID(id);
    await service.deletePaymentCustomization(getByID.payment_id);
    const deletedPaymentCustomization = await PaymentCustomization.delete(id);
    return res.status(200).json({
      message: `${deletedPaymentCustomization.title} is Successfully Deleted`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error Deleting PaymentCustomization:" });
  }
};

export const countByTypesAndActive = async (req, res) => {
  try {
    const { id } = req.shop;
    const types = ["rename", "hide", "re-order"];

    const counts = {};
    for (const type of types) {
      const typeCount = await PaymentCustomization.count({
        type: type,
        shop_id: id,
      });

      counts[type] = typeCount;
    }

    const activeCount = await PaymentCustomization.count({
      rule_status: true,
      shop_id: id,
    });
    const activeCountries = await CityList.activeCountries();
    const countryNames = activeCountries.map((country) => country.country_name);
    res.json({
      count: counts,
      activeCount: activeCount,
      activeCountries: countryNames,
    });
  } catch (error) {
    res.status(500).json({ error: "Error while counting" });
  }
};
