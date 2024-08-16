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

  const getPhoneValidations = async () => {};

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
