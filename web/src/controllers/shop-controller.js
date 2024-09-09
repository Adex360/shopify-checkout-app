import {
  Shop,
  PaymentCustomization,
  CityList,
  Validation,
} from "../models/index.js";
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

  const getAll = await Validation.findAll(req.shop.id);
  const phoneValidations = getAll.filter(
    (validation) => validation.phone_validation !== null
  );
  const fieldValidations = getAll.filter(
    (validation) => validation.phone_validation === null
  );

  const usedCountriesForPhoneValidations = phoneValidations.map(
    (validation) => validation.country_name
  );
  const usedCountriesForFieldValidations = fieldValidations.map(
    (validation) => validation.country_name
  );

  return res.status(200).send({
    enabledCountries: filteredCountries,
    usedCountriesForPhoneValidations,
    usedCountriesForFieldValidations,
  });
};
