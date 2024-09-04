import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context";
import { Page, Spinner } from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";

const Discounts = () => {
  const { loading, isSubscribed } = useAppContext();
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {}, []);
  return (
    <>
      {loading ? (
        <div className="loading">
          <Spinner />
        </div>
      ) : (
        <>
          {!isSubscribed ? (
            <Page>
              <div className="loading">
                <PlanUpgradeWarning />
              </div>
            </Page>
          ) : (
            <Page title="Discounts"></Page>
          )}
        </>
      )}
    </>
  );
};

export default Discounts;
