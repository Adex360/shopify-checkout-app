import { Autocomplete } from "@shopify/polaris";
import { useState, useCallback, useMemo, useEffect } from "react";

export function CustomAutoComplete({
  label,
  placeholder,
  selectionOptions,
  selectedOptions,
  setSelectedOptions,
}) {
  const [inputValue, setInputValue] = useState("");

  // Memoize deselected options to avoid unnecessary recalculations
  const deselectedOptions = useMemo(() => selectionOptions, [selectionOptions]);
  const [options, setOptions] = useState(deselectedOptions);

  // Update the input value based on the text typed by the user
  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const escapedValue = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const filterRegex = new RegExp(escapedValue, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  // Update the selection based on the user's choice
  const updateSelection = useCallback(
    (selected) => {
      const selectedOption = options.find(
        (option) => option.value === selected[0]
      );

      if (selectedOption) {
        setSelectedOptions([selectedOption.value]);
        setInputValue(selectedOption.label);
      }
    },
    [options, setSelectedOptions]
  );

  // Ensure input value is updated when `selectedOptions` changes
  useEffect(() => {
    const selectedOption = deselectedOptions.find(
      (option) => option.value === selectedOptions[0]
    );
    if (selectedOption) {
      setInputValue(selectedOption.label);
    }
  }, [selectedOptions, deselectedOptions]);

  const textField = (
    <Autocomplete.TextField
      onChange={(value) => updateText(value)}
      label={label}
      value={inputValue}
      placeholder={placeholder}
      autoComplete="off"
    />
  );

  return (
    <Autocomplete
      options={options}
      selected={selectedOptions}
      onSelect={updateSelection}
      textField={textField}
    />
  );
}
