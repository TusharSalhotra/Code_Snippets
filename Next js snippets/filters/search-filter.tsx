"use client";

import _ from "lodash";
import {ChangeEvent, useState} from "react";
import {useRedirectWithParams} from "@/hooks";
import {Input} from "../../ui";

type SearchFilterProps = {
  placeholder: string;
  searchKey: string;
};

export function SearchFilter({placeholder, searchKey}: SearchFilterProps) {
  const {pathName, createQueryString, router, searchParams} = useRedirectWithParams();
  const searchValue = searchParams.get(searchKey);

  const [searchQuery, setSearchQuery] = useState<string>(searchValue || "");
  const setSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchQuery(value);
    updateParams(value);
  };

  const updateParams = _.debounce((value: string) => {
    const query = createQueryString([
      {name: searchKey, value},
      {name: "pageNumber", value: "1"},
    ]);

    router.replace(`${pathName}?${query}`);
  }, 700);

  return (
    <Input
      className="w-full truncate"
      placeholder={placeholder}
      value={searchQuery}
      onChange={setSearch}
    />
  );
}
