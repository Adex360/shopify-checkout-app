import { convertShopToSession } from "../helpers/index.js";
import { Shop } from "../models/index.js";

class Session {
  async storeSession(session) {
    return await Shop.storeOrUpdateSession(session);
  }

  async loadSession(id) {
    console.log("load session => ", id);
    const shop = await Shop.findByName(id.replace("offline_", ""));
    if (!shop || !shop.accessToken) return false;

    const session = convertShopToSession(shop);
    return session;
  }

  async deleteSession(id) {
    return true;
  }

  async deleteSessions(ids) {
    return true;
  }

  async findSessionsByShop(shop) {
    console.log("find session ", shop);
    const shopExist = await Shop.findByName(shop);
    console.log("shop found => ", shopExist);
    if (!shopExist) return [];
    return [convertShopToSession(shopExist)];
  }
}

export const SessionStorage = new Session();
