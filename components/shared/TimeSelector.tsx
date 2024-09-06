"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface TimePeriod {
  value: string;
  label: string;
}

const timePeriods: TimePeriod[] = [
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
  { value: "1m", label: "1 Month" },
  { value: "3m", label: "3 Months" },
  { value: "1y", label: "1 Year" },
];

function TimeSelector() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSelectPeriod = (value: string) => {
    setSelectedPeriod(value);
    router.push(`/?period=${value}`);
  };

  useEffect(() => {
    //Set default period to 1w if not present in query params
    if (!searchParams.has("period")) {
      router.push("/?period=1w");
    }
    setSelectedPeriod(searchParams.get("period") || "1w");
  }, []);

  return (
    <>
      <div className="hidden md:block">
        <ToggleGroup
          type="single"
          value={selectedPeriod}
          onValueChange={(value) => value && onSelectPeriod(value)}
        >
          {timePeriods.map((period) => (
            <ToggleGroupItem
              key={period.value}
              value={period.value}
              aria-label={period.label}
            >
              {period.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="md:hidden">
        <Select value={selectedPeriod} onValueChange={onSelectPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            {timePeriods.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

export default TimeSelector;
