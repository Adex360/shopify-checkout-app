import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

const CreateCustomization = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const address = searchParams.get("address");
  console.log(address);
  return <div>CreateCustomization</div>;
};

export default CreateCustomization;
