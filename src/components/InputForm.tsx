"use client";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DealFormSchema, DealFormInput } from "@/lib/schema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { financialAPI } from "@/lib/financial-api";
import { t, getCurrencySymbol, type Language } from "@/lib/localization";
import { useEffect, useState } from "react";



type InputFormProps = {
  onSubmit: (data: DealFormInput) => void;
  onImportData?: (data: { year: number; revenue: number }[]) => void;
};

export function InputForm({ onSubmit, onImportData, language = 'en' }: InputFormProps & { language?: Language }) {
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [apiLoading, setApiLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  // Load exchange rates on mount
  useEffect(() => {
    const loadExchangeRates = async () => {
      setApiLoading(true);
      try {
        const rates = await financialAPI.getExchangeRates();
        setExchangeRates(rates.rates);
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
      } finally {
        setApiLoading(false);
      }
    };

    loadExchangeRates();
  }, []);

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = results.data as any[];
        const parsedData = data
          .map((row) => ({
            year: parseInt(row.year || row.Year || row.YEAR),
            revenue: parseFloat(row.revenue || row.Revenue || row.REVENUE),
          }))
          .filter((item) => !isNaN(item.year) && !isNaN(item.revenue));

        if (parsedData.length > 0 && onImportData) {
          onImportData(parsedData);
        } else {
          alert(t('invalidCsv', language));
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
          setValueAs: (v) => {
            if (v === "" || v === undefined || v === null) return undefined;
            const num = Number(v);
            return isNaN(num) ? undefined : num;
          },
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
        <h2 className="text-lg font-semibold">{t('importData', language)}</h2>
        <p className="text-sm text-muted-foreground">
          {t('csvFormat', language)}
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
        <h2 className="text-lg font-semibold">{t('basicInputs', language)}</h2>
        {renderInput("annualRevenue", `${t('annualRevenue', language)} (${getCurrencySymbol('USD')})`, "The expected annual revenue of the business post-acquisition.", {}, { min: 1 })}
        {renderInput("churnRate", `${t('churnRate', language)} (${t('percent', language)})`, "Percentage of revenue lost annually due to customer attrition.", {}, { min: 0, max: 100, step: 0.1 })}
        {renderInput("growthRate", `${t('growthRate', language)} (${t('percent', language)})`, "Expected annual revenue growth percentage.", { optional: true }, { min: -100, max: 1000, step: 0.1 })}
        {renderInput("earnOutPercent", `${t('earnOutPercent', language)} (${t('percent', language)})`, "Percentage of annual revenue paid as earn-out to the seller.", {}, { min: 0, max: 100, step: 0.1 })}
        {renderInput("taxRate", `${t('taxRate', language)} (${t('percent', language)})`, "Applicable tax rate on proceeds (defaults to 20%).", { optional: true }, { min: 0, max: 100, step: 0.1 })}
      </div>

      <Separator className="my-4" />

      {/* Advanced Inputs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t('advancedOptions', language)}</h2>
        <p className="text-sm text-muted-foreground">
          All advanced inputs are optional and used for detailed modeling.
          {apiLoading && " Loading market data..."}
        </p>
        {renderInput("earnOutYears", t('earnOutYears', language), "Number of years the earn-out payments will be made.", { optional: true }, { min: 1, max: 10, step: 1 })}
        {renderInput("sellerFinancingPercent", `${t('sellerFinancingPercent', language)} (${t('percent', language)})`, "Percentage of annual revenue financed by the seller with interest.", {
          optional: true,
        }, { min: 0, max: 100, step: 0.1 })}
        {renderInput("allCashPercent", `${t('allCashPercent', language)} (${t('percent', language)})`, "Percentage of annual revenue paid as upfront cash.", { optional: true }, { min: 0, max: 100, step: 0.1 })}
        {renderInput("interestRate", `${t('interestRate', language)} (${t('percent', language)})`, "Annual interest rate for seller financing.", { optional: true }, { min: 0, max: 50, step: 0.1 })}
        {renderInput("inflationRate", `${t('inflationRate', language)} (${t('percent', language)})`, "Expected annual inflation rate for revenue adjustments.", { optional: true }, { min: 0, max: 20, step: 0.1 })}
        <div className="space-y-1">
          <Label htmlFor="currency">{t('currency', language)}</Label>
          <select
            id="currency"
            {...register("currency")}
            className="w-full p-2 border rounded"
          >
            <option value="USD">USD ($) - Base Currency</option>
            <option value="EUR">EUR (€) - {exchangeRates.EUR ? `1 USD = ${exchangeRates.EUR.toFixed(2)} EUR` : 'Loading...'}</option>
            <option value="GBP">GBP (£) - {exchangeRates.GBP ? `1 USD = ${exchangeRates.GBP.toFixed(2)} GBP` : 'Loading...'}</option>
            <option value="JPY">JPY (¥) - {exchangeRates.JPY ? `1 USD = ${exchangeRates.JPY.toFixed(0)} JPY` : 'Loading...'}</option>
            <option value="CAD">CAD (C$) - {exchangeRates.CAD ? `1 USD = ${exchangeRates.CAD.toFixed(2)} CAD` : 'Loading...'}</option>
            <option value="AUD">AUD (A$) - {exchangeRates.AUD ? `1 USD = ${exchangeRates.AUD.toFixed(2)} AUD` : 'Loading...'}</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="mt-4 w-full">
        {t('calculate', language)}
      </Button>
    </form>
  );
}
