// hide payment method
// @ts-check

// /**
//  * @typedef {import("../generated/api").RunInput} RunInput
//  * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
//  */

// /**
//  * @type {FunctionRunResult}
//  */
// const NO_CHANGES = {
//   operations: [],
// };

// /**
//  * @param {RunInput} input
//  * @returns {FunctionRunResult}
//  */
// export function run(input) {
//   console.log("input@@@@", input);
//   // Define a type for your configuration, and parse it from the metafield
//   /**
//    * @type {{
//    *   paymentMethodName: string
//    *   cartTotal: number
//    * }}
//    */
//   const configuration = JSON.parse(
//     input?.paymentCustomization?.metafield?.value ?? "{}",
//   );
//   if (!configuration.paymentMethodName || !configuration.cartTotal) {
//     return NO_CHANGES;
//   }
//   console.log(":heelloo");
//   console.log("configuration ", configuration, configuration.paymentMethodName);

//   const cartTotal = parseFloat(input.cart.cost.totalAmount.amount ?? "0.0");
//   // Use the configured cart total instead of a hardcoded value
//   if (cartTotal < configuration.cartTotal) {
//     console.error(
//       "Cart total is not high enough, no need to hide the payment method.",
//     );
//     return NO_CHANGES;
//   }

//   // Use the configured payment method name instead of a hardcoded value
//   const hidePaymentMethod = input.paymentMethods.find((method) =>
//     method.name.includes(configuration.paymentMethodName),
//   );

//   if (!hidePaymentMethod) {
//     return NO_CHANGES;
//   }

//   return {
//     operations: [
//       {
//         hide: {
//           paymentMethodId: hidePaymentMethod.id,
//         },
//       },
//     ],
//   };
// }

// ######### operation
// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  console.log("input", input);
  /**
   * @type {{
   * payment_rule:boolean,
   * conditions:JSON,
   * payment_name:JSON
   * type: string,
   * paymentMethodName: string,
   * cartTotal: number,
   * codAtTop: boolean,
   * }}
   */
  // console.log("today", input?.paymentCustomization?.metafield?.value);
  // const metafieldData = input?.paymentCustomization?.metafield?.value;
  const configuration = JSON.parse(
    input?.paymentCustomization?.metafield?.value ?? "{}"
  );
  // const configuration = input?.paymentCustomization?.metafield?.value ?? "{}"
  const strin = JSON.stringify(configuration, null, 2);
  console.log("metafields", strin);
  // console.log("configuration@@@@@ ", JSON.stringify(configuration, null, 2));
  // console.log(
  //   "payment_name",
  //   // configuration,
  //   configuration.type,
  //   configuration.payment_name.title,
  //   "json",
  //   JSON.stringify(configuration.payment_name, null, 2)
  // );

  let operations = [];
  if (configuration.type === "re-order") {
    console.log("hello");
    if (configuration.conditions) {
    }
    // const codPaymentMethod = input.paymentMethods.find(
    //   (method) => method.name === "Cash on Delivery"
    // );

    const countryCodes = input.cart.deliveryGroups.map((group) => {
      return group?.deliveryAddress?.countryCode;
    });

    // deliveryAddress.countryCode.find(
    //   (method) => method === "PK"
    // );
    console.log("country2", countryCodes);
    // const country = input.cart.deliveryGroups;
    // console.log("country@ ", country);
    // @ts-ignore
    const paymentNames = configuration.payment_name.title; // Example: ["Cash On Delivery", "Bogus"]

    paymentNames.forEach(
      (/** @type {string} */ name, /** @type {any} */ index) => {
        console.log("name", name);
        const paymentMethod = input.paymentMethods.find(
          (method) => method.name === name
          // "Cash on Delivery (COD)"
          // name
        );
        console.log("payment method", paymentMethod);

        if (paymentMethod) {
          operations.push({
            move: {
              paymentMethodId: paymentMethod.id,
              index: index, // Places them in the order of the array
            },
          });
        }
      }
    );
    console.log("wkk2");
  }
  // Handle the "COD at Top" functionality
  if (configuration.codAtTop) {
    console.log("configuration.codAtTop", configuration.codAtTop);
    // @ts-ignore
    const codPaymentMethod = input.paymentMethods.find(
      (method) => method.name === "Cash on Delivery"
    );

    // if (codPaymentMethod) {
    operations.push({
      move: {
        paymentMethodId: "gid://shopify/PaymentCustomizationPaymentMethod/2",
        //  codPaymentMethod.id,
        index: 0,
      },
    });
    // }
  }

  // Handle the "Hide" functionality
  if (configuration.type === "hide") {
    const cartTotal = parseFloat(input.cart.cost.totalAmount.amount ?? "0.0");
    if (cartTotal >= configuration.cartTotal) {
      const hidePaymentMethod = input.paymentMethods.find((method) =>
        method.name.includes(configuration.paymentMethodName)
      );

      if (hidePaymentMethod) {
        operations.push({
          hide: {
            paymentMethodId: hidePaymentMethod.id,
          },
        });
      }
    }
  }

  // Handle the "Rename" functionality
  if (configuration.type === "rename") {
    // @ts-ignore
    const renamePaymentMethod = input.paymentMethods.find((method) =>
      method.name.includes(configuration.paymentMethodName)
    );

    // if (renamePaymentMethod) {
    operations.push({
      rename: {
        paymentMethodId: "gid://shopify/PaymentCustomizationPaymentMethod/2",
        // renamePaymentMethod.id,
        name: configuration.paymentMethodName,
      },
    });
  }
  console.log("operation @@@ ", operations);
  // }

  // If no operations were added, return NO_CHANGES
  if (operations.length === 0) {
    return NO_CHANGES;
  }

  return {
    operations,
  };
}
