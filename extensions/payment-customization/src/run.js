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
   *   payment_rule: boolean,
   *   conditions: {
   *     type: string,
   *     rule: string,
   *     value: string[]
   *   }[],
   *   payment_name: {
   *     match: string,
   *     title: string[]
   *   },
   *   type: string,
   *   paymentMethodName: string,
   *   cartTotal: number,
   *   codAtTop: boolean
   * }}
   */
  // /**
  //  * @type {{
  //  * payment_rule:boolean,
  //  * conditions:JSON,
  //  * payment_name:JSON
  //  * type: string,
  //  * paymentMethodName: string,
  //  * cartTotal: number,
  //  * codAtTop: boolean,
  //  * }}
  //  */
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
    if (!configuration.payment_rule && configuration.conditions) {
      const countryCodes = input.cart.deliveryGroups.map((group) => {
        return group?.deliveryAddress?.countryCode;
      });
      const deliveryTitles = input.cart.deliveryGroups
        .map((group) => {
          return group?.deliveryOptions?.map((option) => option?.title);
        })
        .flat();

      // @ts-ignore
      const conditionsMet = configuration.conditions.every((condition) => {
        if (condition.type === "country" && condition.rule === "contains") {
          // @ts-ignore
          return (
            // @ts-ignore
            countryCodes.some((code) => condition.value.includes(code))
          );
        }
        if (
          condition.type === "country" &&
          condition.rule === "does-not-contains"
        ) {
          // @ts-ignore
          return !countryCodes.some((code) => condition.value.includes(code));
        }
        if (condition.type === "title" && condition.rule === "contains") {
          // @ts-ignore
          return deliveryTitles.some((title) =>
            // @ts-ignore
            condition.value.includes(title)
          );
        }
        if (
          condition.type === "title" &&
          condition.rule === "does-not-contains"
        ) {
          // @ts-ignore
          return (
            // @ts-ignore
            !deliveryTitles.some((name) => condition.value.includes(name))
          );
        } else {
          return false;
        }
      });

      if (conditionsMet) {
        console.log("Condition met: Execute your code here.");
        // @ts-ignore
        const paymentNames = configuration.payment_name.title;
        const matchType = configuration.payment_name.match;
        paymentNames.forEach((name, index) => {
          let paymentMethod;
          switch (matchType) {
            case "exact-case-sensitive":
              paymentMethod = input.paymentMethods.find(
                (method) => method.name === name
              );
              break;

            case "exact-none-case":
              paymentMethod = input.paymentMethods.find(
                (method) => method.name.toLowerCase() === name.toLowerCase()
              );
              break;

            case "contains":
              paymentMethod = input.paymentMethods.find((method) =>
                method.name.includes(name)
              );
              break;

            default:
              console.log("Unknown match type:", matchType);
              return;
          }

          if (paymentMethod) {
            operations.push({
              move: {
                paymentMethodId: paymentMethod.id,
                index: index,
              },
            });
          }
        });
      }
    } else {
      console.log("sort without condition ");
      // @ts-ignore
      const paymentNames = configuration.payment_name.title;
      const matchType = configuration.payment_name.match;
      paymentNames.forEach((name, index) => {
        let paymentMethod;
        switch (matchType) {
          case "exact-case-sensitive":
            paymentMethod = input.paymentMethods.find(
              (method) => method.name === name
            );
            break;

          case "exact-none-case":
            paymentMethod = input.paymentMethods.find(
              (method) => method.name.toLowerCase() === name.toLowerCase()
            );
            break;

          case "contains":
            paymentMethod = input.paymentMethods.find((method) =>
              method.name.includes(name)
            );
            break;

          default:
            console.log("Unknown match type:", matchType);
            return;
        }

        if (paymentMethod) {
          operations.push({
            move: {
              paymentMethodId: paymentMethod.id,
              index: index,
            },
          });
        }
      });
    }
  }

  if (configuration.type === "rename") {
    if (!configuration.payment_rule && configuration.conditions) {
      const countryCodes = input.cart.deliveryGroups.map((group) => {
        return group?.deliveryAddress?.countryCode;
      });
      const deliveryTitles = input.cart.deliveryGroups
        .map((group) => {
          return group?.deliveryOptions?.map((option) => option?.title);
        })
        .flat();
      // @ts-ignore
      const conditionsMet = configuration.conditions.every((condition) => {
        if (condition.type === "country" && condition.rule === "contains") {
          // @ts-ignore
          return (
            // @ts-ignore
            countryCodes.some((code) => condition.value.includes(code))
          );
        }
        if (
          condition.type === "country" &&
          condition.rule === "does-not-contains"
        ) {
          // @ts-ignore
          return !countryCodes.some((code) => condition.value.includes(code));
        }
        if (condition.type === "title" && condition.rule === "contains") {
          // @ts-ignore
          return deliveryTitles.some((title) =>
            // @ts-ignore
            condition.value.includes(title)
          );
        }
        if (
          condition.type === "title" &&
          condition.rule === "does-not-contains"
        ) {
          // @ts-ignore
          return (
            // @ts-ignore
            !deliveryTitles.some((name) => condition.value.includes(name))
          );
        } else {
          return false;
        }
      });

      if (conditionsMet) {
        console.log("Condition met: .");
        // @ts-ignore
        configuration.payment_name.forEach(
          (/** @type {{ old: string; new: any; }} */ name) => {
            const renamePaymentMethod = input.paymentMethods.find(
              (method) => method.name === name.old
            );

            if (renamePaymentMethod) {
              operations.push({
                rename: {
                  paymentMethodId: renamePaymentMethod.id,
                  name: name.new,
                },
              });
            }
          }
        );
      }
    } else {
      console.log("NO CONDITION");
      // @ts-ignore
      configuration.payment_name.forEach(
        (/** @type {{ old: string; new: any; }} */ name) => {
          const renamePaymentMethod = input.paymentMethods.find(
            (method) => method.name === name.old
          );

          if (renamePaymentMethod) {
            operations.push({
              rename: {
                paymentMethodId: renamePaymentMethod.id,
                name: name.new,
              },
            });
          }
        }
      );
    }
  }

  // Handle the "COD at Top" functionality
  if (configuration.codAtTop) {
    console.log("configuration.codAtTop", configuration.codAtTop);
    // @ts-ignore
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

  console.log("operation @@@ ", operations);

  // If no operations were added, return NO_CHANGES
  if (operations.length === 0) {
    return NO_CHANGES;
  }

  return {
    operations,
  };
}
