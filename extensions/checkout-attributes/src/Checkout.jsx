import { API_URL } from "./config/index.js";
import React, { useState, useEffect, useRef } from "react";
import {
  reactExtension,
  useApplyAttributeChange,
  useShop,
  useAvailablePaymentOptions,
  useSelectedPaymentOptions,
  useInstructions,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const instructions = useInstructions();
  const { myshopifyDomain } = useShop();
  const DISCOUNT_END_POINT = `${API_URL}/${myshopifyDomain}`;
  const requestHeader = { "Content-Type": "application/json" };
  const [discounts, setDiscounts] = useState([]);
  const applyAttributeChange = useApplyAttributeChange();
  const availablePaymentOptions = useAvailablePaymentOptions();
  const selectedPaymentOptions = useSelectedPaymentOptions();

  const lastAppliedMethod = useRef(null);

  const fetchDiscount = async () => {
    try {
      const response = await fetch(`${DISCOUNT_END_POINT}`, {
        method: "GET",
        headers: requestHeader,
      });
      const data = await response.json();
      setDiscounts(Array.isArray(data.allDiscount) ? data.allDiscount : []);
    } catch (error) {
      console.error("Error fetching DISCOUNT DATA", error);
    }
  };

  useEffect(() => {
    fetchDiscount();
  }, []);

  // useEffect(() => {
  //   console.log(
  //     "%cPayment Method Handles by SMART WAY",
  //     "color: #28a745; font-weight: bold; font-size: 16px;"
  //   );

  //   availablePaymentOptions.forEach((option, index) => {
  //     console.log(
  //       `%c${index + 1}. Handle: %c${option.handle}   Type: %c${option.type}`,
  //       "color: #28a745; font-weight: normal;",
  //       "color: #28a745; font-weight: bold;",
  //       "color: #28a745; font-weight: normal;"
  //     );
  //   });
  // }, [availablePaymentOptions]);
  useEffect(() => {
    discounts.forEach((discountItem) => {
      if (discountItem.discount_rule === false && discountItem.enabled) {
        const typeCondition = discountItem.conditions.find(
          (condition) => condition.type === "payment-method-type"
        );

        const handleCondition = discountItem.conditions.find(
          (condition) => condition.type === "payment-method-handle"
        );
        const isRequiredTypeSelected = typeCondition
          ? selectedPaymentOptions.some((option) =>
              typeCondition.value.includes(option.type)
            )
          : false;

        const isRequiredHandleSelected = handleCondition
          ? selectedPaymentOptions.some((option) =>
              handleCondition.value.includes(option.handle)
            )
          : false;
        if (isRequiredTypeSelected || isRequiredHandleSelected) {
          const selectedMethod = isRequiredTypeSelected
            ? selectedPaymentOptions.find((option) =>
                typeCondition.value.includes(option.type)
              )
            : selectedPaymentOptions.find((option) =>
                handleCondition.value.includes(option.handle)
              );

          const newValue = isRequiredTypeSelected
            ? selectedMethod.type
            : selectedMethod.handle;
          if (
            lastAppliedMethod.current !== newValue &&
            instructions.attributes.canUpdateAttributes
          ) {
            applyAttributeChange({
              key: "paymentMethod",
              type: "updateAttribute",
              value: newValue,
            });
            lastAppliedMethod.current = newValue;
          }
        } else {
          const defaultMethod = selectedPaymentOptions[0].type;

          if (
            lastAppliedMethod.current !== defaultMethod &&
            instructions.attributes.canUpdateAttributes
          ) {
            applyAttributeChange({
              key: "paymentMethod",
              type: "updateAttribute",
              value: defaultMethod,
            });
            lastAppliedMethod.current = defaultMethod;
          }
        }
      }
    });
  }, [selectedPaymentOptions, discounts, applyAttributeChange]);
}
