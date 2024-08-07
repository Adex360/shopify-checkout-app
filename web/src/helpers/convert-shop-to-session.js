import shopifyApi from '@shopify/shopify-api';

export const convertShopToSession = (shop) => {
  const { session_id, shop_name, state, accessToken, scope } = shop;

  return shopifyApi.Session.fromPropertyArray(
    Object.entries({
      id: session_id,
      shop: shop_name,
      state,
      accessToken,
      scope,
      isOnline: false,
    }),
  );
};
