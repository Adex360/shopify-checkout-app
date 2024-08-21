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
  /**
   * @type {{
   *   payment_rule: boolean,
   *   conditions: {
   *     type: string,
   *     rule: string,
   *  value: string | string[]
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

  const configuration = JSON.parse(
    input?.paymentCustomization?.metafield?.value ?? "{}"
  );
  const strin = JSON.stringify(configuration, null, 2);
  console.log("metafields", strin);

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
      const totalAmount = parseFloat(input.cart.cost.totalAmount.amount); // Convert amount to number

      const conditionsMet = configuration.conditions.every((condition) => {
        if (condition.type === "country" && condition.rule === "contains") {
          return countryCodes.some((code) => condition.value.includes(code));
        }
        if (
          condition.type === "country" &&
          condition.rule === "does-not-contains"
        ) {
          return !countryCodes.some((code) => condition.value.includes(code));
        }
        if (condition.type === "title" && condition.rule === "contains") {
          return deliveryTitles.some((title) =>
            condition.value.includes(title)
          );
        }
        if (
          condition.type === "title" &&
          condition.rule === "does-not-contains"
        ) {
          return !deliveryTitles.some((name) => condition.value.includes(name));
        }
        if (condition.type === "total-amount") {
          const value = parseFloat(condition.value);
          if (condition.rule === "greater-than") {
            return totalAmount > value;
          }
          if (condition.rule === "less-than") {
            return totalAmount < value;
          }
          if (condition.rule === "equals-to") {
            return totalAmount === value;
          }
        } else {
          return false;
        }
      });

      if (conditionsMet) {
        console.log("Condition met: Execute your code here.");

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

            case "contain":
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

          case "contain":
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
    const countryCodes = input.cart.deliveryGroups.map((group) => {
      return group?.deliveryAddress?.countryCode;
    });
    const deliveryTitles = input.cart.deliveryGroups
      .map((group) => {
        return group?.deliveryOptions?.map((option) => option?.title);
      })
      .flat();
    const totalAmount = parseFloat(input.cart.cost.totalAmount.amount);

    const checkConditions = configuration.payment_rule
      ? (callback) => configuration.conditions.every(callback)
      : (callback) => configuration.conditions.some(callback);
    const conditionsMet = checkConditions((condition) => {
      if (condition.type === "country" && condition.rule === "contains") {
        return countryCodes.some((code) => condition.value.includes(code));
      }
      if (
        condition.type === "country" &&
        condition.rule === "does-not-contains"
      ) {
        return !countryCodes.some((code) => condition.value.includes(code));
      }
      if (condition.type === "title" && condition.rule === "contains") {
        return deliveryTitles.some((title) => condition.value.includes(title));
      }
      if (
        condition.type === "title" &&
        condition.rule === "does-not-contains"
      ) {
        return !deliveryTitles.some((name) => condition.value.includes(name));
      }
      if (condition.type === "total-amount") {
        const value = parseFloat(condition.value);
        if (condition.rule === "greater-than") {
          return totalAmount > value;
        }
        if (condition.rule === "less-than") {
          return totalAmount < value;
        }
        if (condition.rule === "equals-to") {
          return totalAmount === value;
        }
      }
      return false;
    });

    if (conditionsMet) {
      console.log("Condition met: .");
      configuration.payment_name.forEach((name) => {
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
      });
    } else {
      console.log("NO CONDITION: no change ");
      // configuration.payment_name.forEach((name) => {
      //   const renamePaymentMethod = input.paymentMethods.find(
      //     (method) => method.name === name.old
      //   );

      //   if (renamePaymentMethod) {
      //     operations.push({
      //       rename: {
      //         paymentMethodId: renamePaymentMethod.id,
      //         name: name.new,
      //       },
      //     });
      //   }
      // });
    }
  }

  if (configuration.type === "hide") {
    const countryCodes = input.cart.deliveryGroups.map((group) => {
      return group?.deliveryAddress?.countryCode;
    });
    const deliveryTitles = input.cart.deliveryGroups
      .map((group) => {
        return group?.deliveryOptions?.map((option) => option?.title);
      })
      .flat();
    const totalAmount = parseFloat(input.cart.cost.totalAmount.amount);

    const checkConditions = configuration.payment_rule
      ? (callback) => configuration.conditions.every(callback)
      : (callback) => configuration.conditions.some(callback);

    const conditionsMet = checkConditions((condition) => {
      if (condition.type === "country" && condition.rule === "contains") {
        return countryCodes.some((code) => condition.value.includes(code));
      }
      if (
        condition.type === "country" &&
        condition.rule === "does-not-contains"
      ) {
        return !countryCodes.some((code) => condition.value.includes(code));
      }
      if (condition.type === "title" && condition.rule === "contains") {
        return deliveryTitles.some((title) => condition.value.includes(title));
      }
      if (
        condition.type === "title" &&
        condition.rule === "does-not-contains"
      ) {
        return !deliveryTitles.some((name) => condition.value.includes(name));
      }
      if (condition.type === "total-amount") {
        const value = parseFloat(condition.value);
        if (condition.rule === "greater-than") {
          return totalAmount > value;
        }
        if (condition.rule === "less-than") {
          return totalAmount < value;
        }
        if (condition.rule === "equals-to") {
          return totalAmount === value;
        }
      }
      return false;
    });
    if (conditionsMet) {
      const paymentNames = configuration.payment_name.title;
      const matchType = configuration.payment_name.match;

      paymentNames.forEach((name) => {
        let hidePaymentMethod;

        switch (matchType) {
          case "exact-case-sensitive":
            hidePaymentMethod = input.paymentMethods.find(
              (method) => method.name === name
            );
            break;

          case "exact-none-case":
            hidePaymentMethod = input.paymentMethods.find(
              (method) => method.name.toLowerCase() === name.toLowerCase()
            );
            break;

          case "contain":
            hidePaymentMethod = input.paymentMethods.find((method) =>
              method.name.includes(name)
            );
            break;

          default:
            console.log("Unknown match type:", matchType);
            return;
        }

        if (hidePaymentMethod) {
          operations.push({
            hide: {
              paymentMethodId: hidePaymentMethod.id,
            },
          });
        }
      });
    } else {
      console.log("no condition");
      // const paymentNames = configuration.payment_name.title;
      // const matchType = configuration.payment_name.match;
      // paymentNames.forEach((name) => {
      //   let hidePaymentMethod;
      //   switch (matchType) {
      //     case "exact-case-sensitive":
      //       hidePaymentMethod = input.paymentMethods.find(
      //         (method) => method.name === name
      //       );
      //       break;

      //     case "exact-none-case":
      //       hidePaymentMethod = input.paymentMethods.find(
      //         (method) => method.name.toLowerCase() === name.toLowerCase()
      //       );
      //       break;

      //     case "contain":
      //       hidePaymentMethod = input.paymentMethods.find((method) =>
      //         method.name.includes(name)
      //       );
      //       break;

      //     default:
      //       console.log("Unknown match type:", matchType);
      //       return;
      //   }
      //   if (hidePaymentMethod) {
      //     operations.push({
      //       hide: {
      //         paymentMethodId: hidePaymentMethod.id,
      //       },
      //     });
      //   }
      // });
    }
  }

  console.log("operation  ", operations);

  // If no operations were added, return NO_CHANGES
  if (operations.length === 0) {
    return NO_CHANGES;
  }

  return {
    operations,
  };
}
