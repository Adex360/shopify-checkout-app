import { Shop, PaymentCustomization, CityList } from "../models/index.js";

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
