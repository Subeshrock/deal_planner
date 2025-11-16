"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DealFormSchema, DealFormInput } from "@/lib/schema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Slider } from "./ui/slider";

type InputFormProps = {
  onSubmit: (data: DealFormInput) => void;
  onChange?: (data: DealFormInput) => void;
};

export function InputForm({ onSubmit, onChange }: InputFormProps) {
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

  const watchedValues = watch();

  // Trigger onChange for real-time updates
  useEffect(() => {
    if (onChange) {
      onChange(watchedValues);
    }
  }, [watchedValues, onChange]);

  const renderSliderInput = (
    name: keyof DealFormInput,
    label: string,
    tooltip: string,
    min: number,
    max: number,
    step: number,
    options?: { optional?: boolean; placeholder?: string },
  ) => {
    const value = watchedValues[name] as number;
    return (
      <div key={name} className="space-y-1">
        <Label htmlFor={name} title={tooltip} className="cursor-help">
          {label}: {value}{" "}
          {options?.optional && (
            <span className="text-sm text-muted-foreground">(optional)</span>
          )}
        </Label>
        <Slider
          value={[value]}
          onValueChange={(vals) => setValue(name, vals[0])}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
      </div>
    );
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Inputs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Deal Inputs</h2>
        {renderInput("annualRevenue", "Annual Revenue ($)", "The expected annual revenue of the business post-acquisition.", {}, { min: 1, step: 1000 })}
        {renderSliderInput("churnRate", "Churn Rate (%)", "Percentage of revenue lost annually due to customer attrition.", 0, 100, 0.1)}
        {renderSliderInput("growthRate", "Growth Rate (%)", "Expected annual revenue growth percentage.", -100, 1000, 0.1, { optional: true })}
        {renderSliderInput("earnOutPercent", "Earn Out (%)", "Percentage of annual revenue paid as earn-out to the seller.", 0, 100, 0.1)}
        {renderSliderInput("taxRate", "Tax Rate (%)", "Applicable tax rate on proceeds (defaults to 20%).", 0, 100, 0.1, { optional: true })}
      </div>

      <Separator className="my-4" />

      {/* Advanced Inputs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Advanced Financing Options</h2>
        <p className="text-sm text-muted-foreground">
          All advanced inputs are optional and used for detailed modeling.
        </p>
        {renderInput("earnOutYears", "Earn Out Years", "Number of years the earn-out payments will be made.", { optional: true }, { min: 1, max: 10, step: 1 })}
        {renderSliderInput("sellerFinancingPercent", "Seller Financing (%)", "Percentage of annual revenue financed by the seller with interest.", 0, 100, 0.1, {
          optional: true,
        })}
        {renderSliderInput("allCashPercent", "All Cash (%)", "Percentage of annual revenue paid as upfront cash.", 0, 100, 0.1, { optional: true })}
        {renderSliderInput("interestRate", "Interest Rate (%)", "Annual interest rate for seller financing.", 0, 50, 0.1, { optional: true })}
      </div>

      <Button type="submit" className="mt-4 w-full">
        Calculate
      </Button>
    </form>
  );
}
