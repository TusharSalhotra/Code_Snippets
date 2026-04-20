"use client";

import React, {useState} from "react";
import {useRedirectWithParams, useUserConfig} from "@/hooks";
import {StoreAutocomplete} from "@/components/common";

type FilterProps = {
  disabled?: boolean;
  deptDependent?: boolean;
  onlyMy?: boolean;
};
export function StoreFilter({disabled, deptDependent, onlyMy}: FilterProps) {
  // Params
  const {pathName, createQueryString, router, searchParams} = useRedirectWithParams();
  const storeId = searchParams.get("storeId");

  // Selected Store
  const [selected, setSelected] = useState<string | null>(storeId);
  const selectedStore = selected ? [selected] : [];

  // Outlet Config
  const {data: userConfig} = useUserConfig();
  const outlet = userConfig?.data?.outlet;

  // Sync StoreId
  React.useEffect(() => setSelected(storeId), [storeId]);

  const setStore = (value: string[]) => {
    let query = "";

    if (value.length === 0) {
      query = createQueryString([
        {name: "storeId", value: ""},
        {name: "pageNumber", value: "1"},
        ...(deptDependent ? [{name: "deptId", value: ""}] : []),
      ]);
      setSelected(null);
    } else {
      const latestFilter = value.length - 1;

      query = createQueryString([
        {name: "storeId", value: value[latestFilter]},
        {name: "pageNumber", value: "1"},
        ...(deptDependent ? [{name: "deptId", value: ""}] : []),
      ]);
      setSelected(value[latestFilter]);
    }

    router.replace(`${pathName}?${query}`);
  };

  return (
    <StoreAutocomplete
      onlyMy
      singleSelect
      disabled={disabled}
      outlets={outlet ? [outlet.id.toString()] : []}
      setValue={setStore}
      value={selectedStore}
    />
  );
}
