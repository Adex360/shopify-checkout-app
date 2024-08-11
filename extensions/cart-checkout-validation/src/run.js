// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

// The configured entrypoint for the 'purchase.validation.run' extension target
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const { cart, validation } = input;

  const setting = JSON.parse(validation?.metafield?.value ?? "{}").setting;
  const errors = [];
  const obj = JSON.stringify(setting, null, 2);
  console.log("metafields", obj);
  const phone = cart?.buyerIdentity.phone || "924567896542";
  const firstName = cart?.buyerIdentity?.customer?.firstName || "m12";
  const lastName = cart?.buyerIdentity?.customer?.lastName || "m34";
  const address1 = cart?.deliveryGroups[0]?.deliveryAddress.address1 || "";
  console.log("firstName", firstName, lastName);
  const countryCode = input.cart.deliveryGroups.map(
    (group) => group?.deliveryAddress?.countryCode
  );
  const isCountryMatch = countryCode.some(
    (code) => setting.country_name === code
  );

  if (setting && isCountryMatch) {
    // Function to validate fields
    const validateField = (fieldValue, fieldSetting, fieldName) => {
      console.log(
        "fieldValue",
        fieldValue,
        fieldSetting,
        fieldSetting.limit_type
      );
      if (fieldSetting.limit_type) {
        const wordCount = fieldValue.trim().split(/\s+/).length;
        if (
          wordCount < fieldSetting.min_length ||
          wordCount > fieldSetting.max_length
        ) {
          errors.push({
            localizedMessage: `${fieldName} must have between ${fieldSetting.min_length} and ${fieldSetting.max_length} words.`,
            target: `$.cart.deliveryGroups[0].deliveryAddress.${fieldName}`,
          });
        }
      } else {
        if (
          fieldValue.length < fieldSetting.min_length ||
          fieldValue.length > fieldSetting.max_length
        ) {
          errors.push({
            localizedMessage: `${fieldName} must have between ${fieldSetting.min_length} and ${fieldSetting.max_length} characters.`,
            target: `$.cart.deliveryGroups[0].deliveryAddress.${fieldName}`,
          });
        }
      }
      if (fieldSetting.block_digits && /\d/.test(fieldValue)) {
        errors.push({
          localizedMessage: `${fieldName} cannot contain digits.`,
          target: `$.cart.deliveryGroups[0].deliveryAddress.${fieldName}`,
        });
      }
      if (
        fieldSetting.block_sequential_character &&
        /(.)\1{2,}/.test(fieldValue)
      ) {
        errors.push({
          localizedMessage: `${fieldName} cannot contain sequential characters.`,
          target: `$.cart.deliveryGroups[0].deliveryAddress.${fieldName}`,
        });
      }
      if (
        fieldSetting.special_character === "block-all" &&
        /[^a-zA-Z\s]/.test(fieldValue)
      ) {
        errors.push({
          localizedMessage: `${fieldName} cannot contain special characters.`,
          target: `$.cart.deliveryGroups[0].deliveryAddress.${fieldName}`,
        });
      } else if (fieldSetting.special_character === "block-selective") {
        const regex = new RegExp(
          `[${fieldSetting.if_block_selectective.join("")}]`
        );
        if (regex.test(fieldValue)) {
          errors.push({
            localizedMessage: `${fieldName} cannot contain the following characters: ${fieldSetting.if_block_selectective.join(
              ", "
            )}`,
            target: `$.cart.deliveryGroups[0].deliveryAddress.${fieldName}`,
          });
        }
      }
    };

    // Validate first name
    if (setting.first_name_validation) {
      validateField(firstName, setting.first_name_validation, "firstName");
    }

    // // Validate last name
    if (setting.last_name_validation) {
      validateField(lastName, setting.last_name_validation, "lastName");
    }

    // Validate address
    if (setting.address_validation) {
      validateField(address1, setting.address_validation, "address1");
    }

    // Phone validation
    if (setting.phone_validation) {
      if (!phone.startsWith(setting.phone_validation.country_code.toString())) {
        errors.push({
          localizedMessage: setting.phone_validation.error_message,
          target: "$.cart.buyerIdentity.phone",
        });
      }

      const startOfNetworkCode =
        setting.phone_validation.country_code.toString().length;
      const networkCode = phone.slice(
        startOfNetworkCode,
        startOfNetworkCode + setting.phone_validation.network_code
      );

      if (networkCode.length !== setting.phone_validation.network_code) {
        errors.push({
          localizedMessage: setting.phone_validation.error_message,
          target: "$.cart.buyerIdentity.phone",
        });
      }

      const startOfPhoneNo =
        startOfNetworkCode + setting.phone_validation.network_code;
      const phoneNoLength = phone.slice(startOfPhoneNo).length;

      if (phoneNoLength !== setting.phone_validation.phone_no_length) {
        errors.push({
          localizedMessage: setting.phone_validation.error_message,
          target: "$.cart.buyerIdentity.phone",
        });
      }
    }
  }

  return { errors };
}
