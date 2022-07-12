import { updateURLSearch } from "@utilities/urlUtilities";
import { useLocation } from "react-router-dom";
import { paramsWithDefault, queryParams } from "./queryParams";

const useQueryCms = () => {
  const { search, pathname } = useLocation();
  const querys = new URLSearchParams(search);
  let list: any = {};
  queryParams.forEach((item) => {
    list[item] = querys.get(item);
  });
  paramsWithDefault.forEach((item) => {
    list[item] = querys.get(item) || "";
  });
  const year = Number(querys.get("year"));
  const week_start = Number(querys.get("week_start"));
  const week_end = Number(querys.get("week_end"));
  const editindex = Number(querys.get("editindex")) || 0;
  const page = Number(querys.get("page")) || 1;
  const readOnly = querys.get("readonly") || false;
  const parent_folder = querys.get("parent_id") || "";
  const scheduleId = querys.get("schedule_id") || "";
  const isShare = querys.get("isShare") || "org";
  const exactSerch = querys.get("exactSerch") || "all";
  const exect_search = querys.get("exect_search");
  const assumed = querys.get("assumed") === "true";
  const first_save = querys.get("first_save") === "true";
  const filterOutcomes = querys.get("filterOutcomes") || "all";

  const updateQuery = (param: { [key: string]: string | number | boolean }): string => {
    return updateURLSearch(search, param);
  };
  return {
    ...list,
    pathname,
    parent_folder,
    scheduleId,
    querys,
    search,
    editindex,
    assumed,
    isShare,
    exactSerch,
    exect_search,
    page,
    first_save,
    filterOutcomes,
    updateQuery,
    readOnly,
    year,
    week_start,
    week_end,
  };
};

export default useQueryCms;
