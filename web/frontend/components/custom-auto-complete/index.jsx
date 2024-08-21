import { Autocomplete, Icon } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useMemo, useEffect } from "react";

export function CustomAutoComplete({
  label,
  placeholder,
  selectionOptions,
  selectedOptions,
  setSelectedOptions,
}) {
  // const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const deselectedOptions = useMemo(() => selectionOptions, []);
  const [options, setOptions] = useState(deselectedOptions);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected[0]);
      setInputValue(selectedValue || "");
    },
    [options]
  );

  const textField = (
    <Autocomplete.TextField
      onChange={(value) => {
        updateText(value);
      }}
      label={label}
      value={inputValue}
      placeholder={placeholder}
      autoComplete="off"
    />
  );

  useEffect(() => {
    if (selectedOptions !== "") {
      const selectedValue = deselectedOptions.find(
        (option) => option.value === selectedOptions[0]
      )?.label;
      setInputValue(selectedValue || "");
    }
  }, []);

  return (
    <div>
      <Autocomplete
        options={options}
        selected={selectedOptions}
        onSelect={updateSelection}
        textField={textField}
      />
    </div>
  );
}
