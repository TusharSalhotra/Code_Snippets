"use client";

import React, {useState} from "react";
import {useRedirectWithParams} from "@/hooks";
import {OutletAutocomplete} from "../index";

type FilterProps = {
  disabled?: boolean;
};
export function OutletFilter({disabled}: FilterProps) {
  // Params
  const {pathName, createQueryString, router, searchParams} = useRedirectWithParams();
  const outletId = searchParams.get("outlet");

  // Selected Outlet
  const [selected, setSelected] = useState<string | null>(outletId);
  const selectedOutlet = selected ?? "";

  // Sync StoreId
  React.useEffect(() => setSelected(outletId), [outletId]);

  const setOutlet = (value: string) => {
    let query = "";

    if (value.length === 0) {
      query = createQueryString([{name: "outlet", value: ""}]);
      setSelected(null);
    } else {
      query = createQueryString([{name: "outlet", value: value}]);
      setSelected(value);
    }

    router.replace(`${pathName}?${query}`);
  };

  return <OutletAutocomplete disabled={disabled} setValue={setOutlet} value={selectedOutlet} />;
}
