import { Select, FormField } from "@/components/ui";
import { useCodesCategories } from "../../hooks/codes-hook";
import { Control, FieldErrors, FieldValues } from "react-hook-form";
import { Code } from "../../schema/types";

export const CategoryDropDown = ({
  control,
  errors,
}: {
  control: Control<Omit<Code, "id">>;
  errors: FieldErrors<FieldValues>;
}) => {
  const categories = useCodesCategories();
  const categoryOptions = categories?.map((category) => ({
    value: `${category.categoryId}`,
    label: category.category,
  }));

  return (
    <FormField
      control={control}
      name="category"
      render={({ field }) => (
        <Select
          label="Category"
          options={categoryOptions ?? []}
          error={errors.category?.message?.toString()}
          required
          value={field.value?.categoryId}
          onChange={(e) => {
            const value = categories?.find(
              (option) => option.categoryId === +e.target.value,
            );

            field.onChange({ target: { value } });
          }}
        />
      )}
    />
  );
};
