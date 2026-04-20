import { useLoaderData } from "react-router-dom";
import { CodeCategory } from "../schema/types";

export const useCodesCategories = () => {
  const categories = useLoaderData() as CodeCategory[];
  return categories;
};
