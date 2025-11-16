"use client";


import { useForm } from "react-hook-form";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Papa = require("papaparse");
import { zodResolver } from "@hookform/resolvers/zod";
import { DealFormSchema, DealFormInput } from "@/lib/schema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";



type InputFormProps = {
  onSubmit: (data: DealFormInput) => void;
  onImportData?: (data: { year: number; revenue: number }[]) => void;
};

export function InputForm({ onSubmit, onImportData }: InputFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DealFormInput>({
    resolver: zodResolver(DealFormSchema),
    defaultValues: {
      annualRevenue: 1000000,
      churnRate: 5,
      growthRate: 0,
      earnOutPercent: 30,
      earnOutYears: 1,
      sellerFinancingPercent: 0,
      allCashPercent: 0,
      taxRate: 20,
      interestRate: 0,
    },
  });

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Record<string, unknown>>) => {
        const data = results.data as Record<string, unknown>[];
        const parsedData = data
          .map((row) => ({
            year: parseInt(row.year || row.Year || row.YEAR),
            revenue: parseFloat(row.revenue || row.Revenue || row.REVENUE),
          }))
          .filter((item) => !isNaN(item.year) && !isNaN(item.revenue));

        if (parsedData.length > 0 && onImportData) {
          onImportData(parsedData);
        } else {
          alert("Invalid CSV format. Expected columns: year, revenue");
        }
      },
      error: () => {
        alert("Error parsing CSV file");
      },
    });
  };

  const renderInput = (
    name: keyof DealFormInput,
    label: string,
    tooltip: string,
    options?: { optional?: boolean; placeholder?: string },
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div key={name} className="space-y-1">
      <Label htmlFor={name} title={tooltip}>
        {label}{" "}
        {options?.optional && (
          <span className="text-sm text-muted-foreground">(optional)</span>
        )}
      </Label>
      <Input
        id={name}
        type="number"
        {...register(name, {
          valueAsNumber: true,
          setValueAs: (v) => (v === "" ? undefined : Number(v)),
        })}
        placeholder={options?.placeholder}
        {...inputProps}
      />
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-labelledby="form-heading">
      {/* Import Data */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Import Historical Data</h2>
        <p className="text-sm text-muted-foreground">
          Upload a CSV file with historical revenue data (columns: year, revenue) to analyze trends.
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleImportCSV}
          aria-label="Upload CSV file with historical revenue data"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Separator className="my-4" />

      {/* Basic Inputs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Deal Inputs</h2>
        {renderInput("annualRevenue", "Annual Revenue ($)", "The expected annual revenue of the business post-acquisition.")}
        {renderInput("churnRate", "Churn Rate (%)", "Percentage of revenue lost annually due to customer attrition.", {}, { min: 0, max: 100, step: 0.1 })}
        {renderInput("growthRate", "Growth Rate (%)", "Expected annual revenue growth percentage.", { optional: true }, { min: -100, max: 1000, step: 0.1 })}
        {renderInput("earnOutPercent", "Earn Out (%)", "Percentage of annual revenue paid as earn-out to the seller.", {}, { min: 0, max: 100, step: 0.1 })}
        {renderInput("taxRate", "Tax Rate (%)", "Applicable tax rate on proceeds (defaults to 20%).", { optional: true }, { min: 0, max: 100, step: 0.1 })}
      </div>

      <Separator className="my-4" />

      {/* Advanced Inputs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Advanced Financing Options</h2>
        <p className="text-sm text-muted-foreground">
          All advanced inputs are optional and used for detailed modeling.
        </p>
        {renderInput("earnOutYears", "Earn Out Years", "Number of years the earn-out payments will be made.", { optional: true }, { min: 1, max: 10, step: 1 })}
        {renderInput("sellerFinancingPercent", "Seller Financing (%)", "Percentage of annual revenue financed by the seller with interest.", {
          optional: true,
        }, { min: 0, max: 100, step: 0.1 })}
        {renderInput("allCashPercent", "All Cash (%)", "Percentage of annual revenue paid as upfront cash.", { optional: true }, { min: 0, max: 100, step: 0.1 })}
        {renderInput("interestRate", "Interest Rate (%)", "Annual interest rate for seller financing.", { optional: true }, { min: 0, max: 50, step: 0.1 })}
      </div>

      <Button type="submit" className="mt-4 w-full">
        Calculate
      </Button>
    </form>
  );
}
