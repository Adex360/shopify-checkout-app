import React, { useState } from "react";
import { useNavigate, useToast } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../../hooks";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  DataTable,
  EmptyState,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import { PlanUpgradeWarning } from "../../components";
import { useAppContext } from "../../context";

const CustomFields = () => {
  const { shop } = useAppContext();
  const isSubscribed = shop.plan_status === "active";
  const navigate = useNavigate();
  const shopifyFetch = useAuthenticatedFetch();
  const { show } = useToast();

  const [loading, setLoading] = useState(false);
  const [btnLoadingIndex, setBtnLoadingIndex] = useState(false);
  const [customFieldsData, setCustomFieldsData] = useState([]);

  const getCustomFields = async () => {
    try {
      setLoading(true);
      const resp = await shopifyFetch("api/v1/custom-fields");
      const data = await resp.json();
      if (resp.ok) {
        setCustomFieldsData(data.getAll);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCustomField = async (id, index) => {
    try {
      setBtnLoadingIndex(index);
      const resp = await shopifyFetch(`api/v1/custom-fields/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();
      if (resp.ok) {
        show(data.message);
        setCustomFieldsData((prev) => {
          prev.splice(index, 1);
          return prev;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBtnLoadingIndex("");
    }
  };

  const tableRows = customFieldsData.map((field, index) => {
    const fieldsName =
      field.fields.length === 0 ? (
        <Badge tone="critical-strong">No fields</Badge>
      ) : (
        field?.fields.map((filedName, index) => {
          return ` ${index > 0 ? ", " : ""}${filedName.label} `;
        })
      );
    return [
      field.title,
      field?.fields.length,

      <Box maxWidth="200px">
        <Text truncate={true}>{fieldsName}</Text>
      </Box>,
      <ButtonGroup variant="segmented">
        <Button
          onClick={() => {
            navigate(`/custom-fields/${field.id}`);
          }}
        >
          Edit
        </Button>
        <Button
          variant="primary"
          loading={index === btnLoadingIndex}
          onClick={() => {
            handleDeleteCustomField(field.id, index);
          }}
        >
          Delete
        </Button>
      </ButtonGroup>,
    ];
  });
  useState(() => {
    isSubscribed && getCustomFields();
  }, [isSubscribed]);
  return (
    <>
      {!isSubscribed ? (
        <Page>
          <PlanUpgradeWarning />
        </Page>
      ) : (
        <>
          {loading ? (
            <>
              <div className="loading">
                <Spinner />
              </div>
            </>
          ) : (
            <Page
              title="Custom Fields"
              backAction={{
                onAction: () => {
                  navigate("/");
                },
              }}
              primaryAction={{
                content: "Add Fields",
                onAction: () => navigate("/custom-fields/create"),
              }}
            >
              <>
                {customFieldsData.length === 0 ? (
                  <Card>
                    <EmptyState
                      heading="Add a custom fields to get started"
                      action={{
                        content: "Add Fields",
                        onAction: () => navigate("/custom-fields/create"),
                      }}
                      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    >
                      <p>
                        It looks like you haven't created any custom fields yet.
                        Click the "Add Fields" button to create your own custom
                        fields
                      </p>
                    </EmptyState>
                  </Card>
                ) : (
                  <Card>
                    <DataTable
                      columnContentTypes={["text", "text", "text", "text"]}
                      headings={[
                        <Text variant="headingMd">Title</Text>,
                        <Text variant="headingMd">No. of Fields</Text>,
                        <Text variant="headingMd">Fields Name</Text>,

                        "",
                      ]}
                      rows={tableRows}
                    />
                  </Card>
                )}
              </>
            </Page>
          )}
        </>
      )}
    </>
  );
};

export default CustomFields;
