import memoize from "lodash/memoize";
import React, { ReactNode, useEffect, useState } from "react";
import { QeuryMeQuery } from "../../api/api-ko.auto";
import { apiGetPermission } from "../../api/extra";

const apiMemoizedGetPermission = memoize(apiGetPermission) as (key?: string) => ReturnType<typeof apiGetPermission>;

export enum PermissionType {
  view_reports_610 = "view_reports_610",
  view_my_reports_614 = "view_my_reports_614",
  view_my_school_reports_611 = "view_my_school_reports_611",
  view_my_organizations_reports_612 = "view_my_organizations_reports_612",
  attend_live_class_as_a_student_187 = "attend_live_class_as_a_student_187",
  view_my_calendar_510 = "view_my_calendar_510",
  create_schedule_page_501 = "create_schedule_page_501",
  edit_in_progress_assessment_439 = "edit_in_progress_assessment_439",
  create_content_page_201 = "create_content_page_201",
  edit_org_published_content_235 = "edit_org_published_content_235",
  create_asset_320 = "create_asset_320",
  create_lesson_material_220 = "create_lesson_material_220",
  create_lesson_plan_221 = "create_lesson_plan_221",
  edit_lesson_material_metadata_and_content_236 = "edit_lesson_material_metadata_and_content_236",
  edit_lesson_plan_content_238 = "edit_lesson_plan_content_238",
  edit_lesson_plan_metadata_237 = "edit_lesson_plan_metadata_237",
  delete_event_540 = "delete_event_540",
  edit_attendance_for_in_progress_assessment_438 = "edit_attendance_for_in_progress_assessment_438",
  view_completed_assessments_414 = "view_completed_assessments_414",
  view_org_completed_assessments_424 = "view_org_completed_assessments_424",
  view_school_in_progress_assessments_427 = "view_school_in_progress_assessments_427",
  view_in_progress_assessments_415 = "view_in_progress_assessments_415",
  view_org_in_progress_assessments_425 = "view_org_in_progress_assessments_425",
  view_school_completed_assessments_426 = "view_school_completed_assessments_426",
  delete_asset_340 = "delete_asset_340",
  associate_learning_outcomes_284 = "associate_learning_outcomes_284",
  view_pending_milestone_486 = "view_pending_milestone_486",
  create_milestone_422 = "create_milestone_422",
  publish_featured_content_for_all_hub_79000 = "publish_featured_content_for_all_hub_79000",
  publish_featured_content_for_all_orgs_79002 = "publish_featured_content_for_all_orgs_79002",
  publish_featured_content_for_specific_orgs_79001 = "publish_featured_content_for_specific_orgs_79001",
  create_folder_289 = "create_folder_289",
  create_event_520 = "create_event_520",
  create_my_schools_schedule_events_522 = "create_my_schools_schedule_events_522",
  create_my_schedule_events_521 = "create_my_schedule_events_521",
  view_subjects_20115 = "view_subjects_20115",
  create_learning_outcome_421 = "create_learning_outcome_421",
  learning_outcome_page_404 = "learning_outcome_page_404",
  milestones_page_405 = "milestones_page_405",
  assessments_page_406 = "assessments_page_406",
  schedule_500 = "schedule_500",
  delete_published_milestone_450 = "delete_published_milestone_450",
  delete_org_pending_milestone_489 = "delete_org_pending_milestone_489",
  approve_pending_milestone_491 = "approve_pending_milestone_491",
  reject_pending_milestone_492 = "reject_pending_milestone_492",
  delete_my_pending_milestone_490 = "delete_my_pending_milestone_490",
  delete_my_unpublished_milestone_488 = "delete_my_unpublished_milestone_488",
  delete_unpublished_milestone_449 = "delete_unpublished_milestone_449",
  view_my_pending_milestone_429 = "view_my_pending_milestone_429",
  view_published_milestone_418 = "view_published_milestone_418",
  view_unpublished_milestone_417 = "view_unpublished_milestone_417",
  view_my_unpublished_milestone_428 = "view_my_unpublished_milestone_428",
  view_my_published_214 = "view_my_published_214",
  archive_published_content_273 = "archive_published_content_273",
  republish_archived_content_274 = "republish_archived_content_274",
  delete_archived_content_275 = "delete_archived_content_275",
  approve_pending_content_271 = "approve_pending_content_271",
  reject_pending_content_272 = "reject_pending_content_272",
  published_content_page_204 = "published_content_page_204",
  pending_content_page_203 = "pending_content_page_203",
  unpublished_content_page_202 = "unpublished_content_page_202",
  archived_content_page_205 = "archived_content_page_205",
  create_asset_page_301 = "create_asset_page_301",
  delete_published_learning_outcome_448 = "delete_published_learning_outcome_448",
  delete_org_pending_learning_outcome_447 = "delete_org_pending_learning_outcome_447",
  delete_my_pending_learning_outcome_446 = "delete_my_pending_learning_outcome_446",
  approve_pending_learning_outcome_481 = "approve_pending_learning_outcome_481",
  reject_pending_learning_outcome_482 = "reject_pending_learning_outcome_482",
  delete_org_unpublished_learning_outcome_445 = "delete_org_unpublished_learning_outcome_445",
  delete_my_unpublished_learning_outcome_444 = "delete_my_unpublished_learning_outcome_444",
  edit_my_unpublished_learning_outcome_430 = "edit_my_unpublished_learning_outcome_430",
  view_my_unpublished_learning_outcome_410 = "view_my_unpublished_learning_outcome_410",
  view_org_unpublished_learning_outcome_411 = "view_org_unpublished_learning_outcome_411",
  view_my_pending_learning_outcome_412 = "view_my_pending_learning_outcome_412",
  view_org_pending_learning_outcome_413 = "view_org_pending_learning_outcome_413",
  learning_summary_report_653 = "learning_summary_report_653",
  student_usage_report_657 = "student_usage_report_657",
  student_progress_report_662 = "student_progress_report_662",
  report_learning_summary_org_652 = "report_learning_summary_org_652",
  report_learning_summary_school_651 = "report_learning_summary_school_651",
  report_learning_summary_teacher_650 = "report_learning_summary_teacher_650",
  report_learning_summary_student_649 = "report_learning_summary_student_649",
  attend_live_class_as_a_teacher_186 = "attend_live_class_as_a_teacher_186",
  report_organization_student_usage_654 = "report_organization_student_usage_654",
  report_school_student_usage_655 = "report_school_student_usage_655",
  report_teacher_student_usage_656 = "report_teacher_student_usage_656",
  report_organization_teaching_load_617 = "report_organization_teaching_load_617",
  report_school_teaching_load_618 = "report_school_teaching_load_618",
  report_my_teaching_load_619 = "report_my_teaching_load_619",
  schedule_search_582 = "schedule_search_582",
  teacher_reports_603 = "teacher_reports_603",
  edit_published_learning_outcome_436 = "edit_published_learning_outcome_436",
  unpublished_page_402 = "unpublished_page_402",
  edit_my_unpublished_milestone_487 = "edit_my_unpublished_milestone_487",
  edit_published_milestone_441 = "edit_published_milestone_441",
  completed_view_completed_assessments_414 = "completed_view_completed_assessments_414",
  completed_view_org_completed_assessments_424 = "completed_view_org_completed_assessments_424",
  completed_view_school_in_progress_assessments_427 = "completed_view_school_in_progress_assessments_427",
  in_progress_view_in_progress_assessments_415 = "in_progress_view_in_progress_assessments_415",
  in_progress_view_org_in_progress_assessments_425 = "in_progress_view_org_in_progress_assessments_425",
  in_progress_view_school_in_progress_assessments_427 = "in_progress_view_school_in_progress_assessments_427",
  edit_unpublished_milestone_440 = "edit_unpublished_milestone_440",
  report_student_progress_organization_658 = "report_student_progress_organization_658",
  report_student_progress_school_659 = "report_student_progress_school_659",
  report_student_progress_teacher_660 = "report_student_progress_teacher_660",
  report_student_progress_student_661 = "report_student_progress_student_661",
}

const isPermissionType = (x: PermissionType | PermissionType[]): x is PermissionType => !Array.isArray(x);

export type PermissionResult<V> = V extends PermissionType[] ? Record<PermissionType, boolean | undefined> : boolean | undefined;

export function hasPermissionOfMe<V extends PermissionType | PermissionType[]>(value: V, me: QeuryMeQuery["me"]): PermissionResult<V> {
  const permissionList: PermissionType[] = [];
  let result: PermissionResult<PermissionType> | PermissionResult<PermissionType[]>;
  me?.membership?.roles?.forEach((role) => {
    role?.permissions?.forEach((permission) => {
      if (permission) permissionList.push(permission.permission_name as PermissionType);
    });
  });
  if (isPermissionType(value)) {
    result = permissionList.length ? permissionList.includes(value) : undefined;
  } else {
    result = (value as PermissionType[]).reduce((s, name) => {
      s[name] = permissionList.length ? permissionList.includes(name) : undefined;
      return s;
    }, {} as PermissionResult<PermissionType[]>);
  }
  return result as PermissionResult<V>;
}
export function usePermission<V extends PermissionType | PermissionType[]>(value: V, key?: string): PermissionResult<V> {
  const [data, setData] = useState<QeuryMeQuery>();
  useEffect(() => {
    let isSubscribe = true;
    apiMemoizedGetPermission(key).then((res) => isSubscribe && setData(res));
    return () => void (isSubscribe = false);
  }, [key]);
  return hasPermissionOfMe<V>(value, data?.me);
}

export interface PermissionProps<V> {
  value: V;
  render?: (value: PermissionResult<V>) => ReactNode;
  children?: ReactNode;
}
export function Permission<V extends PermissionType | PermissionType[]>(props: PermissionProps<V>) {
  const { value, render, children } = props;
  const perm = usePermission(value);
  if (render) return <>{render(perm as any)}</>;
  return perm ? <>{children}</> : null;
}

export interface PermissionOrProps {
  value: PermissionType[];
  render?: (value: boolean) => ReactNode;
  children?: ReactNode;
}
export function PermissionOr(props: PermissionOrProps) {
  const { value, render, children } = props;
  const pemJson = usePermission(value);
  const perm = Object.values(pemJson).some((v) => v);
  if (render) return <>{render(perm)}</>;
  return perm ? <>{children}</> : null;
}
