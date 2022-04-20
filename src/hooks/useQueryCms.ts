import { OutcomeListExectSearch } from "@pages/OutcomeList/types";
import { updateURLSearch } from "@utilities/urlUtilities";
import { useLocation } from "react-router-dom";

const useQueryCms = () => {
  const { search, pathname } = useLocation();
  const querys = new URLSearchParams(search);
  const id = querys.get("id") || "";
  const searchMedia = querys.get("searchMedia") || "";
  const searchOutcome = querys.get("searchOutcome") || "";
  //const assumed = (query.get("assumed") || "") === "true" ? true : false;
  const isShare = querys.get("isShare") || "org";
  const editindex = Number(querys.get("editindex") || 0);
  const back = querys.get("back") || "";
  const exactSerch = querys.get("exactSerch") || "all";
  const parent_folder = querys.get("parent_id") || "";
  const exect_search = querys.get("exect_search") || OutcomeListExectSearch.all;
  const search_key = querys.get("search_key") || "";
  const assumed = querys.get("assumed") === "true";
  const page = Number(querys.get("page")) || 1;
  const first = querys.get("first_save");
  const first_save = querys.get("first_save") === "true";
  const is_unpub = querys.get("is_unpub") || "";
  const scheduleId = querys.get("schedule_id") || "";
  const filterOutcomes = querys.get("filterOutcomes") || "all";
  const teacher_name = querys.get("teacher_name");
  const status = querys.get("status") || "";
  const classType = querys.get("classType");
  const sid = querys.get("sid") as string;
  const author = querys.get("author");
  const program_group = (querys.get("program_group") as string) || "";
  const query_key = querys.get("query_key");
  const query_type = querys.get("query_type");
  const description = querys.get("description");
  const name = querys.get("name") || "";
  const shortcode = querys.get("shortcode");
  const author_id = querys.get("author_id") || "";
  const publish_status = querys.get("publish_status");
  const content_type = querys.get("content_type");
  const outcome_id = querys.get("outcome_id") || "";
  const before = querys.get("before") || "";
  const readOnly = querys.get("readonly") || false;
  const teacher_id = querys.get("teacher_id") || "";
  const class_id = querys.get("class_id") || "";
  const lesson_plan_id = querys.get("lesson_plan_id") || "";
  const student_id = querys.get("student_id") || "";
  const path = querys.get("path") || "";
  const author_name = querys.get("author_name");
  const year = Number(querys.get("year"));
  const week_start = Number(querys.get("week_start"));
  const week_end = Number(querys.get("week_end"));
  const school_id = querys.get("school_id") || "";
  const subject_id = querys.get("subject_id") || "";

  const updateQuery = (param: { [key: string]: string | number | boolean }): string => {
    return updateURLSearch(search, param);
  };
  return {
    pathname,
    querys,
    id,
    searchMedia,
    searchOutcome,
    search,
    editindex,
    assumed,
    isShare,
    back,
    exactSerch,
    parent_folder,
    exect_search,
    search_key,
    page,
    first,
    first_save,
    is_unpub,
    scheduleId,
    filterOutcomes,
    updateQuery,
    teacher_name,
    status,
    classType,
    sid,
    author,
    program_group,
    query_key,
    query_type,
    description,
    name,
    shortcode,
    publish_status,
    content_type,
    author_id,
    outcome_id,
    before,
    readOnly,
    teacher_id,
    class_id,
    lesson_plan_id,
    student_id,
    path,
    author_name,
    year,
    week_start,
    week_end,
    school_id,
    subject_id,
  };
};

export default useQueryCms;
