import React, { useEffect } from "react";
import PermissionType from "../api/PermissionType";
import permissionCache, { ICacheData } from "../services/permissionCahceService";
function usePermission(perms: PermissionType[]) {
  const [state, setState] = React.useState<ICacheData>({});
  useEffect(() => {
    (async () => {
      const permsData = await permissionCache.usePermission(perms);
      setState(permsData);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

/**
 *
 * use this hook to preload some permissions
 *
 */

function useLoadPermission(perms: PermissionType[]) {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  React.useEffect(() => {
    (async () => {
      await permissionCache.usePermission(perms);
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return loaded;
}
/**
 *  choose some permissions from list
 *  @perms  permissions list, return value from function usePermission
 *  @permsToChoose permissions to choose
 *
 */
function useChoosePermission(perms: ICacheData, permsToChoose: PermissionType[]): ICacheData {
  return permsToChoose.reduce((prev, cur) => {
    prev[cur] = perms[cur];
    return prev;
  }, {} as ICacheData);
}

function useRole() {
  const perm = usePermission([
    PermissionType.report_learning_summary_org_652,
    PermissionType.report_learning_summary_school_651,
    PermissionType.report_learning_summary_teacher_650,
    PermissionType.report_learning_summary_student_649,
    PermissionType.view_completed_assessments_414,
    PermissionType.view_in_progress_assessments_415,
    PermissionType.view_org_completed_assessments_424,
    PermissionType.view_org_in_progress_assessments_425,
    PermissionType.view_school_completed_assessments_426,
    PermissionType.view_school_in_progress_assessments_427,
  ]);
  const isOrg = perm.report_learning_summary_org_652 as boolean;
  const isSchool = perm.report_learning_summary_school_651 as boolean;
  const isTeacher = perm.report_learning_summary_teacher_650 as boolean;
  const isStudent = perm.report_learning_summary_student_649 as boolean;

  return { isOrg, isSchool, isTeacher, isStudent };
}

export { usePermission, useLoadPermission, useChoosePermission, useRole };
