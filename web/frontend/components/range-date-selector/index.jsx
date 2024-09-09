import { DatePicker } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { getCorrectDate } from "../../helpers";

function RangeDateSelector({ start, end, onChange }) {
  const today = new Date();
  const disabledDate = today.setDate(today.getDate() - 1);

  const [{ month, year }, setDate] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(),
    end: new Date(),
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );

  useEffect(() => {
    setSelectedDates((prev) => {
      return {
        end: !end ? new Date() : new Date(end),
        start: new Date(start),
      };
    });
  }, []);

  return (
    <DatePicker
      month={month}
      year={year}
      disableDatesBefore={new Date(disabledDate)}
      onChange={(value) => {
        onChange(
          getCorrectDate(value.start),
          value.start !== value.end ? getCorrectDate(value.end) : null
        );
        setSelectedDates({
          end: value.end,
          start: value.start,
        });
      }}
      onMonthChange={handleMonthChange}
      selected={selectedDates}
      multiMonth
      allowRange
    />
  );
}
export default RangeDateSelector;
