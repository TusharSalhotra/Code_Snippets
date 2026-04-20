"use client";

import {useRedirectWithParams} from "@/hooks";
import {SortOrderEnum} from "@/types/common";
import {Icon} from "@/lib/app-icons";
import {cn} from "@/lib/utils";
import {Button, TableHead} from "../../ui";

type SortingCellProps = {
  label: string;
  value: string;
  clsName?: string;
};

export function SortingCell({value, label, clsName}: SortingCellProps) {
  const {pathName, createQueryString, router, searchParams} = useRedirectWithParams();
  const sortByColumn = searchParams.get("sortByColumn");
  const sortOrder = searchParams.get("sortOrder");

  const setSortColumn = () => {
    if (sortByColumn === value) {
      const direc = sortOrder === SortOrderEnum.asc ? SortOrderEnum.desc : SortOrderEnum.asc;
      const query = createQueryString([{name: "sortOrder", value: direc}]);

      router.replace(`${pathName}?${query}`);

      return;
    }

    const orderQuery = createQueryString([
      {name: "sortOrder", value: SortOrderEnum.asc},
      {name: "sortByColumn", value},
    ]);

    router.replace(`${pathName}?${orderQuery}`);
  };

  return (
    <TableHead className={cn("font-medium", clsName)}>
      <div className="flex items-center gap-x-1  min-w-[145px]">
        <span>{label}</span>
        <Button size={"sm"} variant={"ghost"} onClick={setSortColumn}>
          {sortByColumn !== value ? (
            <Icon.SortAsc className="h-4 w-4 text-muted-foreground/40" />
          ) : sortOrder === SortOrderEnum.asc ? (
            <Icon.SortAsc className="text-primary/75 font-bold h-4 w-4" />
          ) : (
            <Icon.SortDesc className="text-primary/75 font-bold h-4 w-4" />
          )}
        </Button>
      </div>
    </TableHead>
  );
}
