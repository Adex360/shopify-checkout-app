import React, { useState } from "react";
import { useAppContext } from "../../context";
import { PlanUpgradeWarning } from "../../components";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  DataTable,
  EmptyState,
  Layout,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { useNavigate, useToast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../../hooks";

const FieldValidation = () => {
  const { isSubscribed, loading, setLoading } = useAppContext();
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();
  const [fieldValidations, setFieldValidations] = useState([]);

  const getFieldValidations = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("api/v1/validation");
      const data = await resp.json();
      if (resp.ok) {
        console.log(data.getAll);
        setFieldValidations(data.validations);
      } else {
        show(data.error.message, {
          isError: true,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const tableRows = fieldValidations?.map((data, index) => {
    return [
      data.title,
      data.enabled ? (
        <Badge tone="success-strong">Enabled</Badge>
      ) : (
        <Badge tone="critical-strong">Disabled</Badge>
      ),
      data.country_name,
      data.first_name_validation ? (
        <Badge tone="success-strong">Enabled</Badge>
      ) : (
        <Badge tone="critical-strong">Disabled</Badge>
      ),
      data.last_name_validation ? (
        <Badge tone="success-strong">Enabled</Badge>
      ) : (
        <Badge tone="critical-strong">Disabled</Badge>
      ),
      data.address_validation ? (
        <Badge tone="success-strong">Enabled</Badge>
      ) : (
        <Badge tone="critical-strong">Disabled</Badge>
      ),
      // data.last_name_validation,
      // data.address_validation,
      <ButtonGroup variant="segmented">
        <Button variant="secondary">Edit</Button>
        <Button variant="primary">Delete</Button>
      </ButtonGroup>,
    ];
  });

  useState(() => {
    isSubscribed && getFieldValidations();
  }, [isSubscribed]);

  return (
    <>
      {loading ? (
        <div className="loading">
          <Spinner />
        </div>
      ) : !isSubscribed ? (
        <Page>
          <PlanUpgradeWarning />
        </Page>
      ) : (
        <>
          <Page
            title="Field Validations"
            primaryAction={{
              content: "Create Validation",
              onAction: () => navigate("/field-validation/create"),
            }}
          >
            <Layout>
              <Layout.Section>
                {fieldValidations?.length > 0 ? (
                  <Card padding="0">
                    <DataTable
                      columnContentTypes={["text", "text", "text", "text"]}
                      headings={[
                        <Text variant="headingMd">Title</Text>,
                        <Text variant="headingMd">Status</Text>,
                        <Text variant="headingMd">Country Code</Text>,
                        <Text variant="headingMd">Fist Name Val. </Text>,
                        <Text variant="headingMd">Last Name Val.</Text>,
                        // <Text variant="headingMd">Last Name </Text>,
                        <Text variant="headingMd">Address Val.</Text>,
                        "",
                      ]}
                      rows={tableRows}
                    />
                  </Card>
                ) : (
                  <Card>
                    <EmptyState
                      heading="Add a field validation to get started"
                      action={{
                        content: "Create Validation",
                        onAction: () => navigate("/field-validation/create"),
                      }}
                      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    >
                      <p>
                        It looks like you haven't created any validation yet.
                        Click the "Create Validation" button to create your own
                        validation.
                      </p>
                    </EmptyState>
                  </Card>
                )}
              </Layout.Section>
            </Layout>
          </Page>
        </>
      )}
    </>
  );
};

export default FieldValidation;
