import { Control, FieldErrors, FieldValues } from "react-hook-form";
import { Input, FormField, Checkbox } from "@/components/ui";
import { Code } from "../../schema/types";
import { CategoryDropDown } from "./category-dropdown";

export function FormFields({
  control,
  errors,
}: {
  control: Control<Omit<Code, "id">>;
  errors: FieldErrors<FieldValues>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <CategoryDropDown control={control} errors={errors} />
        <FormField
          control={control}
          name="code"
          render={({ field }) => (
            <Input
              label="Code"
              error={errors.code?.message?.toString()}
              required
              {...field}
            />
          )}
        />
      </div>
      <div className="flex space-x-4">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <Input
              label="Description"
              error={errors.description?.message?.toString()}
              required
              {...field}
            />
          )}
        />
        <FormField
          control={control}
          name="tomrexName"
          render={({ field }) => (
            <Input
              label="TOMREX Name"
              error={errors.tomrexName?.message?.toString()}
              {...field}
            />
          )}
        />
      </div>
      <FormField
        control={control}
        name="active"
        render={({ field }) => (
          <div className="inline-flex items-center space-x-4">
            <label className="block text-[13px] text-[#333] w-[104px]">
              Active
            </label>
            <Checkbox
              checked={field.value as boolean}
              onChange={(e) => field.onChange(e)}
            />
          </div>
        )}
      />
    </div>
  );
}
