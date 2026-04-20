import { GlobalCodesProvider } from "../provider/global-codes-provider";
import { GlobalCodesForm } from "./code-form/global-code-form";
import { GlobalCodesGrid } from "./codes-grid";

export function GlobalCodesLayout() {
  return (
    <GlobalCodesProvider>
      <div className="p-5">
        Layout
        <GlobalCodesForm />
        <GlobalCodesGrid />
      </div>
    </GlobalCodesProvider>
  );
}
