import type { FieldValues, FieldPath, ControllerProps } from "react-hook-form";
import { Controller, FormProvider } from "react-hook-form";

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return <Controller {...props} />;
}

export const Form = FormProvider;
