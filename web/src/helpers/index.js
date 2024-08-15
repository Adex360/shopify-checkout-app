import { convertShopToSession } from "./convert-shop-to-session.js";
import { sleep } from "./sleep.js";
export * from "./fetch-paginated-list.js";

export { sleep, convertShopToSession };

export function getNextBillingDate() {
  var now = new Date();
  let current;

  if (now.getMonth() == 11) {
    current = new Date(now.getFullYear() + 1, 0, 1).getTime();
  } else {
    current = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
  }
  return current.toString();
}

export function getFirstAndLastMonthDate() {
  let date = new Date();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    firstDay,
    lastDay,
  };
}
