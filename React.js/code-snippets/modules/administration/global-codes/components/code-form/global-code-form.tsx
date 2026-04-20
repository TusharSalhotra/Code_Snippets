import { FormFields } from "./form-fields";
import { Button, Form } from "@/components/ui";
import { useGlobalCodes } from "../../provider";

export function GlobalCodesForm() {
  const { form, onFormSubmit, onCancel, selectedCode } = useGlobalCodes();
  const isEditMode = Boolean(selectedCode);

  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="mb-2.5">
        <div className="bg-[#fdfdfd] rounded-[5px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.2),0px_3px_10px_0px_rgba(0,0,0,0.19)] border border-[#d6d6d6] p-5 mb-5">
          <FormFields control={form.control} errors={form.formState.errors} />
        </div>

        <div className="flex items-center space-x-4">
          <Button
            type="button"
            onClick={onCancel}
            disabled={form.formState.disabled}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={form.formState.disabled}>
            {form.formState.isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Modify"
                : "Insert"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
