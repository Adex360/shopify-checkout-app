import React, { useState } from "react";
import {
  TextField,
  Tag,
  InlineStack,
  Button,
  BlockStack,
  Box,
} from "@shopify/polaris";

const AddTag = ({ placeholder, tags, setTags, error, ...props }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue !== "" && !tags.includes(trimmedValue)) {
      setTags([...tags, trimmedValue]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  return (
    <div className="add-tags-polaris">
      <BlockStack gap="200">
        <InlineStack blockAlign="start" gap="300">
          <Box
            style={{
              flexGrow: 1,
            }}
          >
            <TextField
              size="slim"
              {...props}
              error={tags?.length === 0 && error}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
            />
          </Box>
          <Button onClick={handleAddTag} variant="secondary">
            Add
          </Button>
        </InlineStack>
        <InlineStack gap={200}>
          {tags?.map((tag, index) => (
            <Tag key={index} onRemove={() => handleRemoveTag(index)}>
              {tag}
            </Tag>
          ))}
        </InlineStack>
      </BlockStack>
    </div>
  );
};

export default AddTag;
