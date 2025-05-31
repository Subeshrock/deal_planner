"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DealFormSchema, DealFormInput } from "@/lib/schema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

type InputFormProps = {
  onSubmit: (data: DealFormInput) => void;
};

export function InputForm({ onSubmit }: InputFormProps) {
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

  const renderInput = (
    name: keyof DealFormInput,
    label: string,
    options?: { optional?: boolean; placeholder?: string },
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div key={name} className="space-y-1">
      <Label htmlFor={name}>
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
        {renderInput("annualRevenue", "Annual Revenue ($)")}
        {renderInput("churnRate", "Churn Rate (%)")}
        {renderInput("growthRate", "Growth Rate (%)", { optional: true })}
        {renderInput("earnOutPercent", "Earn Out (%)")}
        {renderInput("taxRate", "Tax Rate (%)", { optional: true })}
      </div>

      <Separator className="my-4" />

      {/* Advanced Inputs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Advanced Financing Options</h2>
        <p className="text-sm text-muted-foreground">
          All advanced inputs are optional and used for detailed modeling.
        </p>
        {renderInput("earnOutYears", "Earn Out Years", { optional: true }, { min: 1, step: 1 })}
        {renderInput("sellerFinancingPercent", "Seller Financing (%)", {
          optional: true,
        })}
        {renderInput("allCashPercent", "All Cash (%)", { optional: true })}
        {renderInput("interestRate", "Interest Rate (%)", { optional: true })}
      </div>

      <Button type="submit" className="mt-4 w-full">
        Calculate
      </Button>
    </form>
  );
}
