import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  EmptyState,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { PhoneValidationModal, PlanUpgradeWarning } from "../../components";

const PhoneValidation = () => {
  const isSubscribed = true;
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => {
    setModalOpen(false);
  };

  const showModal = () => {
    setModalOpen(true);
  };

  const getPhoneValidations = async () => {
    try {
      const resp = await shopifyFetch("api/v1/validation/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "first1 validation",
          country_name: "PK",
          enabled: true,
          phone_validation: {
            type: "phone-validation",
            country_name: "PK",
            country_code: 92,
            network_code: 3,
            phone_no_length: 8,
            error_message: "wrong length",
          },
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        show(data.message, { duration: 2000 });
      } else {
        show(data.error.message, {
          isError: true,
        });
      }

      console.log(data.error.message);
    } catch (e) {
      console.error(e);
    }
  };
  };

  useEffect(() => {
    getPhoneValidations();
  }, []);

  return (
    <>
      {!isSubscribed ? (
        <Page>
          <PlanUpgradeWarning />
        </Page>
      ) : (
        <Page
          title={
            <InlineStack gap="200">
              <Text variant="headingLg">Phone Validation</Text>
              <Badge tone="warning">Disabled</Badge>
            </InlineStack>
          }
          primaryAction={
            <ButtonGroup variant="segmented">
              <Button>Enable</Button>
              <Button>Disable</Button>
            </ButtonGroup>
          }
        >
          <Layout>
            <Layout.Section>
              <Card>
                <PhoneValidationModal onClose={handleClose} open={modalOpen} />
                {/* <Modal
                  title="My modal"
                  open={modalOpen}
                  message=""
                  onClose={() => setModalOpen(false)}
                  src="/modals/phone-validation-modal"
                  primaryAction={{
                    content: "Add",
                    onAction: () => {},
                  }}
                /> */}
                <EmptyState
                  heading="Add a phone validation to get started"
                  action={{
                    content: "Add validation",
                    onAction: showModal,
                    // onAction: () => navigate("/payment-customization"),
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>
                    It looks like you haven't created any validation yet. Click
                    the "Add validation" button to create your own customization
                  </p>
                </EmptyState>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      )}
    </>
  );
};

export default PhoneValidation;
