import { Shop, PaymentCustomization, CityList } from "../models/index.js";
import ShopifyService from "../services/shopify-service.js";
import axios from "axios";
export const getShop = async (req, res) => {
  const shop = req.shop;
  const updatedShop = Shop.formatShopForApp(shop);

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
  return res.status(200).send({
    ...updatedShop,
    count: counts,
    activeCount: activeCount,
    activeCountries: countryNames,
  });
};

export const getCountries = async (req, res) => {
  const { shop_name, accessToken } = req.shop;
  const service = new ShopifyService({
    shop_name,
    accessToken,
  });
  const enabledCountries = await service.getShopCountries();
  const response = await axios.get(
    "https://countriesnow.space/api/v0.1/countries"
  );
  const countriesData = response.data.data;

  const filteredCountries = countriesData
    .filter((country) => enabledCountries.includes(country.iso2))
    .map((country) => ({
      label: country.country,
      value: country.iso2,
    }));

  return res.status(200).send({
    enabledCountries: filteredCountries,
  });
};
