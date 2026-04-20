"use client";

import React, {useState} from "react";
import {useRedirectWithParams} from "@/hooks";
import {DeptAutocomplete} from "../index";

type FilterProps = {
  disabled?: boolean;
};
export function DeptFilter({disabled}: FilterProps) {
  const {pathName, createQueryString, router, searchParams} = useRedirectWithParams();
  const deptId = searchParams.get("deptId");
  const storeId = searchParams.get("storeId");
  const [selected, setSelected] = useState<string | null>(deptId);

  const setDept = (value: string) => {
    let query = "";

    if (value.length === 0) {
      query = createQueryString([
        {name: "deptId", value: ""},
        {name: "pageNumber", value: "1"},
      ]);
      setSelected(null);
    } else {
      query = createQueryString([
        {name: "deptId", value: value},
        {name: "pageNumber", value: "1"},
      ]);
      setSelected(value);
    }

    router.replace(`${pathName}?${query}`);
  };

  // Sync deptId
  React.useEffect(() => setSelected(deptId), [deptId]);

  return (
    <DeptAutocomplete
      disabled={disabled}
      setValue={setDept}
      storeId={storeId ?? ""}
      value={selected ?? ""}
    />
  );
}
