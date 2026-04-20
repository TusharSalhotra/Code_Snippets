"use client";

import React from "react";
import {useRedirectWithParams} from "@/hooks";
import {Icon} from "@/lib/app-icons";
import {Default_page_size} from "@/lib/api-helper";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
  PaginationLink,
  Button,
} from "../../ui";

type PaginatorProps = {
  totalPages: number;
  showPreviousNext?: boolean;
};

export function Paginator({totalPages, showPreviousNext = true}: PaginatorProps) {
  const {createQueryString, searchParams, router, pathName} = useRedirectWithParams();
  const pageNum = searchParams.get("pageNumber") || 1;
  const currentPage = +pageNum;
  const pages = Math.ceil(totalPages / Default_page_size);

  const onPageChange = (page: number) => {
    const routePageQuery = createQueryString([{name: "pageNumber", value: `${page}`}]);

    router.push(`${pathName}?${routePageQuery}`);
  };

  return (
    <Pagination>
      <PaginationContent>
        {showPreviousNext && pages ? (
          <PaginationItem>
            <Button
              disabled={currentPage - 1 < 1}
              size={"sm"}
              variant={"ghost"}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <Icon.Left className="h-4 w-4" />
              <span>Previous</span>
            </Button>
          </PaginationItem>
        ) : null}
        {generatePaginationLinks(currentPage, pages, onPageChange)}
        {showPreviousNext && pages ? (
          <PaginationItem>
            <Button
              disabled={currentPage > pages - 1}
              size={"sm"}
              variant={"ghost"}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <span>Next</span>
              <Icon.Right className="h-4 w-4" />
            </Button>
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}

export const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
) => {
  const pages: React.JSX.Element[] = [];

  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={i === currentPage} onClick={() => onPageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
  } else {
    for (let i = 1; i <= 2; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={i === currentPage} onClick={() => onPageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    if (2 < currentPage && currentPage < totalPages - 1) {
      pages.push(<PaginationEllipsis />);
      pages.push(
        <PaginationItem key={currentPage}>
          <PaginationLink isActive={true} onClick={() => onPageChange(currentPage)}>
            {currentPage}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    pages.push(<PaginationEllipsis />);
    for (let i = totalPages - 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={i === currentPage} onClick={() => onPageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
  }

  return pages;
};
