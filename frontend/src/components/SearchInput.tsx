import { memo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";

function SearchInput() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );
  const debouncedValue = useDebounce(inputValue, 300);

  useEffect(() => {
    const current = new URLSearchParams(searchParams);
    const currentSearch = current.get("search") || "";
    
    // Only update if the search value has actually changed
    if (debouncedValue !== currentSearch) {
      if (debouncedValue) {
        current.set("search", debouncedValue);
        current.delete("page"); // Only reset page when search changes
      } else {
        current.delete("search");
        current.delete("page"); // Only reset page when search changes
      }
      setSearchParams(current);
    }
  }, [debouncedValue, searchParams, setSearchParams]);

  return (
    <Input
      type="search"
      placeholder="Search quizzes..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="max-w-md"
    />
  );
}

export default memo(SearchInput);
