export interface Code {
  id: string;
  category: CodeCategory | null;
  code: string;
  description: string;
  tomrexName?: string;
  active: boolean;
  cannotModify: boolean;
}

export interface APICode {
  globalCodeId: number;
  categoryId: number;
  codeName: string;
  description: string;
  active: string;
  cannotModifyNameOrDelete: string;
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  recordDeleted: string;
  friendlyName: string;
}
export interface CodeCategory {
  categoryId: number;
  category: string;
}

export type CodeCategoryOption = {
  label: string;
  value: CodeCategory;
};
