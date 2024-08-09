import { useNavigate } from "@shopify/app-bridge-react";
import React from "react";

const CreatePaymentCustomization = () => {
  const navigate = useNavigate();

  console.log(
    navigate(
      "/create-payment-customization/component?address=klsdjldjj&type=ndhjsghjkdh"
    )
  );

  return <div>CreatePayment</div>;
};

export default CreatePaymentCustomization;
