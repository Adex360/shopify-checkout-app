import {
  reactExtension,
  Banner,
  BlockStack,
  Text,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <CustomBanner />
));

function CustomBanner() {
  const {
    banner_only,
    title: merchantTitle,
    description,
    collapsible,
    status: merchantStatus,
    title_size,
    description_size,
  } = useSettings();

  const status = merchantStatus ?? "info";
  const title = merchantTitle ?? "Custom Banner";
  if (banner_only) {
    return (
      <Banner title={title} status={status} collapsible={collapsible}>
        {description && <Text size={description_size}>{description}</Text>}
      </Banner>
    );
  } else {
    return (
      <BlockStack>
        <Text size={title_size} bold>
          {title}
        </Text>
        {description && <Text size={description_size}>{description}</Text>}
      </BlockStack>
    );
  }
}
