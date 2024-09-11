import React, { useState } from "react";
import { useAppContext } from "../../context";
import { PlanUpgradeWarning } from "../../components";
import {
  Badge,
  Banner,
  Box,
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
  const {
    isSubscribed,
    loading,
    setLoading,
    setDisabledCountriesField,
    setDisabledCountriesPhone,
  } = useAppContext();
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();
  const [fieldValidations, setFieldValidations] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(-1);

  const getFieldValidations = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("api/v1/validation");
      const data = await resp.json();
      if (resp.ok) {
        setFieldValidations(data.fieldValidations);
        setDisabledCountriesPhone(data.usedCountriesForPhoneValidations);
        setDisabledCountriesField(data.usedCountriesForFieldValidations);
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

  const handleDeleteValidation = async (id, index) => {
    try {
      setLoadingIndex(index);
      const resp = await shopifyFetch(`api/v1/validation/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();
      if (resp.ok) {
        show(data.message);
        setFieldValidations((prev) => {
          const newArr = [...prev];
          newArr.splice(index, 1);
          return newArr;
        });
      } else {
        show(data.error.message, {
          isError: true,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingIndex(-1);
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
      <ButtonGroup variant="segmented">
        <Button
          disabled={loadingIndex > -1}
          onClick={() => {
            navigate(`/field-validation/${data.id}`);
          }}
          variant="secondary"
        >
          Edit
        </Button>
        <Button
          disabled={loadingIndex > -1}
          loading={loadingIndex === index}
          variant="primary"
          onClick={() => handleDeleteValidation(data.id, index)}
        >
          Delete
        </Button>
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
                        <Text variant="headingMd">First Name Val. </Text>,
                        <Text variant="headingMd">Last Name Val.</Text>,
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
