"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DealFormSchema, DealFormInput } from "@/lib/schema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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
    tooltip: string,
    options?: { optional?: boolean; placeholder?: string },
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div key={name} className="space-y-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Label htmlFor={name} className="cursor-help">
              {label}{" "}
              {options?.optional && (
                <span className="text-sm text-muted-foreground">(optional)</span>
              )}
            </Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
        {renderInput("annualRevenue", "Annual Revenue ($)", {}, { min: 1, step: 1000 })}
        {renderInput("churnRate", "Churn Rate (%)", {}, { min: 0, max: 100, step: 0.1 })}
        {renderInput("growthRate", "Growth Rate (%)", { optional: true }, { min: -100, max: 1000, step: 0.1 })}
        {renderInput("earnOutPercent", "Earn Out (%)", {}, { min: 0, max: 100, step: 0.1 })}
        {renderInput("taxRate", "Tax Rate (%)", { optional: true }, { min: 0, max: 100, step: 0.1 })}
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
