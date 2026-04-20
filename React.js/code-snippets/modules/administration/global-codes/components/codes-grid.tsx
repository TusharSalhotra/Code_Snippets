import { useGlobalCodes } from "../provider/global-codes-provider";
import { Code } from "../schema/types";
import { Table, TableActions } from "@/components/ui";

export function GlobalCodesGrid() {
  const { codes, isLoading, onEdit, onDelete } = useGlobalCodes();

  const columns = [
    {
      key: "actions",
      label: "Actions",
      render: (code: Code) => (
        <TableActions
          onEdit={() => onEdit(code)}
          onDelete={() => onDelete(code)}
          canDelete
          canEdit
        />
      ),
    },
    {
      key: "code",
      label: "Code",
      render: (code: Code) => (
        <span className="font-medium text-gray-900">{code.code}</span>
      ),
    },
    {
      key: "active",
      label: "Active",
      render: (code: Code) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${
            code.active
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {code.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    { key: "description", label: "Description" },
    { key: "tomrexName", label: "TOMREX Name" },
    {
      key: "cannotModify",
      label: "Cannot Modify",
      render: (code: Code) => (
        <span className="text-gray-500">
          {code.cannotModify ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  return (
    <Table<Code>
      showPagination={false}
      columns={columns}
      data={codes}
      isLoading={isLoading}
      itemsPerPage={10}
      emptyMessage={"No global codes found"}
    />
  );
}
