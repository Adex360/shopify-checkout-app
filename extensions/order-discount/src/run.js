import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */

const DISCOUNT_CLASS = {
  ORDER: "ORDER",
  PRODUCT: "PRODUCT",
};
const DISCOUNT_TYPE = {
  FIXEDAMOUNT: "fixed-amount",
  PERCENTAGE: "percentage",
};
const CONDITION = {
  COUNTRY: "country",
  TITLE: "title",
  TOTAL_AMOUNT: "total-amount",
  SUB_TOTAL_AMOUNT: "sub-total-amount",
  SKU: "sku",
  CITY: "city",
  CART_TOTAL_QTY: "cart-total-qty",
  SINGLE_LINE_QTY: "single-line-qty",
  ALL_LINE_QTY: "all_line_qty",
  PAYMENT_METHOD_TYPE: "payment-method-type",
  PAYMENT_METHOD_HANDLE: "payment-method-handle",
};
const RULES = {
  CONTAINS: "contains",
  DOES_NOT_CONTAINS: "does-not-contains",
  TOTAL_AMOUNT: "total-amount",
  GREATER_THAN: "greater-than",
  LESS_THAN: "less-than",
  EQUALS_TO: "equals-to",
};

const PAYMENT_METHODS = {
  CREDIT_CARD: "creditCard",
  DEFERRED: "deferred",
  LOCAL: "local",
  MANUAL_PAYMENT: "manualPayment",
  OFFSITE: "offsite",
  OTHER: "other",
  PAYMENT_ON_DELIVERY: "paymentOnDelivery",
  REDEEMABLE: "redeemable",
  WALLET: "wallet",
  CUSTOM_ON_SITE: "customOnsite",
};

// export function run(input) {
//   const paymentMethod = input.cart.attribute
//     ? input.cart.attribute.value
//     : null;
//   const configuration = JSON.parse(
//     input?.discountNode?.metafield?.value ?? "{}"
//   );
//   const obj = JSON.stringify(configuration, null, 2);
//   console.log("metafields", obj);

//   const countryCodes = input.cart.deliveryGroups.map(
//     (group) => group?.deliveryAddress?.countryCode
//   );
//   const cityName = input.cart.deliveryGroups.map((group) =>
//     group?.deliveryAddress?.city.toLowerCase()
//   );
//   const totalAmount = parseFloat(input.cart.cost.totalAmount.amount);
//   const subTotalAmount = parseFloat(input.cart.cost.subtotalAmount.amount);
//   const skus = input.cart.lines.map((line) => line.merchandise.sku);
//   const cartTotalQty = input.cart.lines.reduce(
//     (total, line) => total + line.quantity,
//     0
//   );

//   const hasConditions =
//     configuration.conditions && configuration.conditions.length > 0;
//   const checkConditions = configuration.hasCondition
//     ? (callback) => configuration.conditions.every(callback)
//     : (callback) => configuration.conditions.some(callback);
//   const conditionsMet = hasConditions
//     ? checkConditions((condition) => {
//         if (condition.type === CONDITION.PAYMENT_METHOD_TYPE) {
//           if (condition.rule === RULES.CONTAINS) {
//             return condition.value.includes(paymentMethod);
//           }
//           if (condition.rule === RULES.DOES_NOT_CONTAINS) {
//             return !condition.value.includes(paymentMethod);
//           }
//         }
//         if (condition.type === CONDITION.PAYMENT_METHOD_HANDLE) {
//           if (condition.rule === RULES.CONTAINS) {
//             return condition.value.includes(paymentMethod);
//           }
//           if (condition.rule === RULES.DOES_NOT_CONTAINS) {
//             return !condition.value.includes(paymentMethod);
//           }
//         }

//         if (condition.type === CONDITION.SINGLE_LINE_QTY) {
//           const value = condition.value;
//           if (condition.rule === RULES.GREATER_THAN) {
//             return input.cart.lines.some((line) => line.quantity > value);
//           }
//           if (condition.rule === RULES.LESS_THAN) {
//             return input.cart.lines.some((line) => line.quantity < value);
//           }
//           if (condition.rule === RULES.EQUALS_TO) {
//             return input.cart.lines.some((line) => line.quantity === value);
//           }
//         }
//         if (condition.type === CONDITION.ALL_LINE_QTY) {
//           const value = condition.value;
//           if (condition.rule === RULES.GREATER_THAN) {
//             console.log(
//               ",greater then ",
//               input.cart.lines.every((line) => line.quantity > value)
//             );
//             return input.cart.lines.every((line) => line.quantity > value);
//           }
//           if (condition.rule === RULES.LESS_THAN) {
//             console.log(
//               ",less than",
//               input.cart.lines.every((line) => line.quantity < value)
//             );
//             return input.cart.lines.every((line) => line.quantity < value);
//           }
//           if (condition.rule === RULES.EQUALS_TO) {
//             console.log(
//               ",equals to",
//               input.cart.lines.every((line) => line.quantity === value)
//             );
//             return input.cart.lines.every((line) => line.quantity === value);
//           }
//         }
//         if (condition.type === CONDITION.CART_TOTAL_QTY) {
//           const value = condition.value;
//           if (condition.rule === RULES.GREATER_THAN)
//             return cartTotalQty > value;
//           if (condition.rule === RULES.LESS_THAN) return cartTotalQty < value;
//           if (condition.rule === RULES.EQUALS_TO) return cartTotalQty === value;
//         }
//         if (condition.type === CONDITION.TOTAL_AMOUNT) {
//           const value = parseFloat(condition.value);
//           if (condition.rule === RULES.GREATER_THAN) return totalAmount > value;
//           if (condition.rule === RULES.LESS_THAN) return totalAmount < value;
//           if (condition.rule === RULES.EQUALS_TO) return totalAmount === value;
//         }
//         if (condition.type === CONDITION.SUB_TOTAL_AMOUNT) {
//           const value = parseFloat(condition.value);
//           if (condition.rule === RULES.GREATER_THAN)
//             return subTotalAmount > value;
//           if (condition.rule === RULES.LESS_THAN) return subTotalAmount < value;
//           if (condition.rule === RULES.EQUALS_TO)
//             return subTotalAmount === value;
//         }
//         if (condition.type === CONDITION.COUNTRY) {
//           if (condition.rule === RULES.CONTAINS)
//             return countryCodes.some((code) => condition.value.includes(code));
//           if (condition.rule === RULES.DOES_NOT_CONTAINS)
//             return countryCodes.every(
//               (code) => !condition.value.includes(code)
//             );
//         }
//         if (condition.type === CONDITION.CITY) {
//           if (condition.rule === RULES.CONTAINS)
//             return cityName.some((name) => condition.value.includes(name));
//           if (condition.rule === RULES.DOES_NOT_CONTAINS)
//             return cityName.every((name) => !condition.value.includes(name));
//         }
//         if (condition.type === CONDITION.SKU) {
//           if (condition.rule === RULES.CONTAINS)
//             return skus.some((sku) => condition.value.includes(sku));
//           if (condition.rule === RULES.DOES_NOT_CONTAINS)
//             return skus.every((sku) => !condition.value.includes(sku));
//         }

//         return false;
//       })
//     : true;
//   console.log("conditionsMet", conditionsMet);
//   if (conditionsMet) {
//     console.log("CONDITION MET OR NO CONDITIONS PROVIDED");
//     return {
//       discounts: [
//         {
//           targets: [
//             {
//               orderSubtotal: {
//                 excludedVariantIds: [],
//               },
//             },
//           ],
//           message: configuration.message,
//           value: {
//             percentage:
//               configuration.type === DISCOUNT_TYPE.PERCENTAGE
//                 ? { value: configuration.value }
//                 : undefined,
//             fixedAmount:
//               configuration.type === DISCOUNT_TYPE.FIXEDAMOUNT
//                 ? { amount: configuration.value }
//                 : undefined,
//           },
//         },
//       ],
//       discountApplicationStrategy: DiscountApplicationStrategy.First,
//     };
//   } else {
//     console.log("NO CONDITIONS MET");
//     return EMPTY_DISCOUNT;
//   }
// }

export function run(input) {
  console.log("new");
  const paymentMethod = input.cart.attribute
    ? input.cart.attribute.value
    : null;
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );
  const obj = JSON.stringify(configuration, null, 2);
  console.log("metafields", obj);

  const countryCodes = input.cart.deliveryGroups.map(
    (group) => group?.deliveryAddress?.countryCode
  );
  const cityName = input.cart.deliveryGroups.map((group) =>
    group?.deliveryAddress?.city.toLowerCase()
  );
  const totalAmount = parseFloat(input.cart.cost.totalAmount.amount);
  const subTotalAmount = parseFloat(input.cart.cost.subtotalAmount.amount);
  const skus = input.cart.lines.map((line) => line.merchandise.sku);
  const cartTotalQty = input.cart.lines.reduce(
    (total, line) => total + line.quantity,
    0
  );

  const hasConditions =
    configuration.conditions && configuration.conditions.length > 0;
  const checkConditions = configuration.hasCondition
    ? (callback) => configuration.conditions.every(callback)
    : (callback) => configuration.conditions.some(callback);
  const conditionsMet = hasConditions
    ? checkConditions((condition) => {
        if (condition.type === CONDITION.PAYMENT_METHOD_TYPE) {
          if (condition.rule === RULES.CONTAINS) {
            return condition.value.includes(paymentMethod);
          }
          if (condition.rule === RULES.DOES_NOT_CONTAINS) {
            return !condition.value.includes(paymentMethod);
          }
        }
        if (condition.type === CONDITION.PAYMENT_METHOD_HANDLE) {
          if (condition.rule === RULES.CONTAINS) {
            return condition.value.includes(paymentMethod);
          }
          if (condition.rule === RULES.DOES_NOT_CONTAINS) {
            return !condition.value.includes(paymentMethod);
          }
        }

        if (condition.type === CONDITION.SINGLE_LINE_QTY) {
          const value = condition.value;
          if (condition.rule === RULES.GREATER_THAN) {
            return input.cart.lines.some((line) => line.quantity > value);
          }
          if (condition.rule === RULES.LESS_THAN) {
            return input.cart.lines.some((line) => line.quantity < value);
          }
          if (condition.rule === RULES.EQUALS_TO) {
            return input.cart.lines.some((line) => line.quantity === value);
          }
        }
        if (condition.type === CONDITION.ALL_LINE_QTY) {
          const value = condition.value;
          if (condition.rule === RULES.GREATER_THAN) {
            return input.cart.lines.every((line) => line.quantity > value);
          }
          if (condition.rule === RULES.LESS_THAN) {
            return input.cart.lines.every((line) => line.quantity < value);
          }
          if (condition.rule === RULES.EQUALS_TO) {
            return input.cart.lines.every((line) => line.quantity === value);
          }
        }
        if (condition.type === CONDITION.CART_TOTAL_QTY) {
          const value = condition.value;
          if (condition.rule === RULES.GREATER_THAN)
            return cartTotalQty > value;
          if (condition.rule === RULES.LESS_THAN) return cartTotalQty < value;
          if (condition.rule === RULES.EQUALS_TO) return cartTotalQty === value;
        }
        if (condition.type === CONDITION.TOTAL_AMOUNT) {
          const value = parseFloat(condition.value);
          if (condition.rule === RULES.GREATER_THAN) return totalAmount > value;
          if (condition.rule === RULES.LESS_THAN) return totalAmount < value;
          if (condition.rule === RULES.EQUALS_TO) return totalAmount === value;
        }
        if (condition.type === CONDITION.SUB_TOTAL_AMOUNT) {
          const value = parseFloat(condition.value);
          if (condition.rule === RULES.GREATER_THAN)
            return subTotalAmount > value;
          if (condition.rule === RULES.LESS_THAN) return subTotalAmount < value;
          if (condition.rule === RULES.EQUALS_TO)
            return subTotalAmount === value;
        }
        if (condition.type === CONDITION.COUNTRY) {
          if (condition.rule === RULES.CONTAINS)
            return countryCodes.some((code) => condition.value.includes(code));
          if (condition.rule === RULES.DOES_NOT_CONTAINS)
            return countryCodes.every(
              (code) => !condition.value.includes(code)
            );
        }
        if (condition.type === CONDITION.CITY) {
          if (condition.rule === RULES.CONTAINS)
            return cityName.some((name) => condition.value.includes(name));
          if (condition.rule === RULES.DOES_NOT_CONTAINS)
            return cityName.every((name) => !condition.value.includes(name));
        }
        if (condition.type === CONDITION.SKU) {
          if (condition.rule === RULES.CONTAINS)
            return skus.some((sku) => condition.value.includes(sku));
          if (condition.rule === RULES.DOES_NOT_CONTAINS)
            return skus.every((sku) => !condition.value.includes(sku));
        }

        return false;
      })
    : true;

  const discountTargets = [];

  if (configuration.class === DISCOUNT_CLASS.ORDER) {
    discountTargets.push({
      orderSubtotal: {
        excludedVariantIds: [],
      },
    });
  }

  if (
    configuration.class === DISCOUNT_CLASS.PRODUCT &&
    configuration.productVariantIds
  ) {
    console.log("PRODUCT CLASS ");
    discountTargets.push(
      ...configuration.productVariantIds.map((id) => ({
        productVariant: {
          id,
          quantity: null, // Adjust as per your requirement
        },
      }))
    );
  }

  console.log("conditionsMet", conditionsMet);

  if (conditionsMet) {
    console.log("CONDITION MET OR NO CONDITIONS PROVIDED");
    return {
      discounts: [
        {
          targets: discountTargets,
          message: configuration.message,
          value: {
            percentage:
              configuration.type === DISCOUNT_TYPE.PERCENTAGE
                ? { value: configuration.value }
                : undefined,
            fixedAmount:
              configuration.type === DISCOUNT_TYPE.FIXEDAMOUNT
                ? { amount: configuration.value }
                : undefined,
          },
        },
      ],
      discountApplicationStrategy: DiscountApplicationStrategy.First,
    };
  } else {
    console.log("NO CONDITIONS MET");
    return EMPTY_DISCOUNT;
  }
}
