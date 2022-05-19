import useQueryCms from "@hooks/useQueryCms";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction, unwrapResult } from "@reduxjs/toolkit";
import { clearNull, toQueryString } from "@utilities/urlUtilities";
import produce from "immer";
import { cloneDeep } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import { OrderBy, OutcomeOrderBy, OutcomePublishStatus, OutcomeSetResult } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { usePermission } from "../../hooks/usePermission";
import { d } from "../../locale/LocaleManager";
import { excluedOutcomeSet, findSetIndex, ids2OutcomeSet, isAllMineOutcome } from "../../models/ModelOutcomeDetailForm";
import { AppDispatch, RootState } from "../../reducers";
import { actWarning } from "../../reducers/notify";
import {
  approve,
  bulkApprove,
  bulkBindOutcomeSet,
  bulkDeleteOutcome,
  bulkPublishOutcome,
  bulkReject,
  createOutcomeSet,
  deleteOutcome, exportOutcomes, newReject,
  onLoadOutcomeList,
  publishOutcome,
  pullOutcomeSet,
  resetSelectedIds,
  setSelectedIds
} from "../../reducers/outcome";
import CreateOutcomings from "../OutcomeEdit";
import { AddSet, AddSetProps, useAddSet } from "./AddSet";
import { LoFields, LoFieldsProps, useLoFields } from "./LoFields";
import { OutcomeTable, OutcomeTableProps } from "./OutcomeTable";
import { SecondSearchHeader, SecondSearchHeaderMb } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb, ThirdSearchHeaderProps } from "./ThirdSearchHeader";
import { BulkListForm, BulkListFormKey, OutcomeListExectSearch, OutcomeQueryCondition } from "./types";

const useQuery = (): OutcomeQueryCondition => {
  const { querys, search_key, publish_status, author_name, page, is_unpub } = useQueryCms();
  const order_by = (querys.get("order_by") as OrderBy | null) || undefined;
  const exect_search = querys.get("exect_search") || OutcomeListExectSearch.all;
  return useMemo(() => {
    return clearNull({ search_key, publish_status, author_name, page, order_by, is_unpub, exect_search });
  }, [search_key, publish_status, author_name, page, order_by, is_unpub, exect_search]);
};
interface RefreshWithDispatch {
  <T>(result: Promise<T>): Promise<T>;
}

function useRefreshWithDispatch() {
  const [refreshKey, setRefreshKey] = useState(0);
  const validRef = useRef(false);
  const refreshWithDispatch = useMemo<RefreshWithDispatch>(
    () => (result) => {
      return result.then((res) => {
        setRefreshKey(refreshKey + 1);
        return res;
      });
    },
    [refreshKey]
  );

  useEffect(() => {
    validRef.current = true;
    return () => {
      validRef.current = false;
    };
  });
  return { refreshKey, refreshWithDispatch };
}

export function OutcomeList() {
  const condition = useQuery();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const { refreshKey, refreshWithDispatch } = useRefreshWithDispatch();
  const formMethods = useForm<BulkListForm>();
  const { watch, reset, getValues } = formMethods;
  const ids = watch(BulkListFormKey.CHECKED_BULK_IDS);
  const { outcomeList, total, user_id, outcomeSetList, defaultSelectOutcomeset, selectedIdsMap, downloadOutcomes } = useSelector<RootState, RootState["outcome"]>(
    (state) => state.outcome
  );
  const selectedIds = useMemo(() => {
    const currIds = outcomeList.map(item => item.outcome_id);
    let idsMap: Record<string, boolean> = cloneDeep(selectedIdsMap);
    currIds.forEach(item => {
      idsMap[item!] = ids ? !!(ids.indexOf(item!) >= 0) : false;
    })
    dispatch(setSelectedIds(idsMap));
    return Object.keys(idsMap).filter(item => idsMap[item]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, outcomeList]);
  const [initFields, setInitFields] = useState(["outcome_name", "shortcode", "score_threshold", "updated_at", "program", "subject", "category", "subcategory"]);
  const perm = usePermission([
    PermissionType.view_my_unpublished_learning_outcome_410,
    PermissionType.view_org_unpublished_learning_outcome_411,
    PermissionType.view_my_pending_learning_outcome_412,
    PermissionType.view_org_pending_learning_outcome_413,
  ]);
  const hasPerm =
    perm.view_my_unpublished_learning_outcome_410 ||
    perm.view_org_unpublished_learning_outcome_411 ||
    perm.view_my_pending_learning_outcome_412 ||
    perm.view_org_pending_learning_outcome_413;
  const isPending = useMemo(
    () => perm.view_my_unpublished_learning_outcome_410 === undefined,
    [perm.view_my_unpublished_learning_outcome_410]
  );
  const [showSetList, setShowSetList] = React.useState(false);
  const [selectedOutcomeSet, setSelectedOutcomeSet] = React.useState<OutcomeSetResult>([]);
  const { addSetActive, openAddSet, closeAddSet } = useAddSet();
  const { loFieldsActive, openLoFields, closeLoFields } = useLoFields();
  const handlePublish: OutcomeTableProps["onPublish"] = (id) => {
    dispatch(resetSelectedIds({}));
    return refreshWithDispatch(dispatch(publishOutcome(id)).then(unwrapResult));
  };
  const handleBulkPublish: ThirdSearchHeaderProps["onBulkPublish"] = () => {
    dispatch(resetSelectedIds({}));
    return refreshWithDispatch(dispatch(bulkPublishOutcome(ids)).then(unwrapResult));
  };
  const handleDelete: OutcomeTableProps["onDelete"] = (id) => {
    dispatch(resetSelectedIds({}));
    return refreshWithDispatch(dispatch(deleteOutcome(id)).then(unwrapResult));
  };
  const handleBulkDelete: ThirdSearchHeaderProps["onBulkDelete"] = () => {
    dispatch(resetSelectedIds({}));
    return refreshWithDispatch(dispatch(bulkDeleteOutcome(ids)).then(unwrapResult));
  };
  const handleChangePage: OutcomeTableProps["onChangePage"] = (page) => {
    history.push({ search: toQueryString({ ...condition, page }) });
  }
  const handleClickOutcome: OutcomeTableProps["onClickOutcome"] = (outcome_id) => {
    dispatch(resetSelectedIds({}));
    history.push({
      pathname: CreateOutcomings.routeBasePath,
      search: toQueryString(clearNull({ outcome_id, is_unpub: condition.is_unpub })),
    });
  }
  const handleChange: ThirdSearchHeaderProps["onChange"] = (value) => {
    dispatch(resetSelectedIds({}));
    const newValue = produce(value, (draft) => {
      const searchText = getValues()[BulkListFormKey.SEARCH_TEXT_KEY];
      searchText ? (draft.search_key = searchText) : delete draft.search_key;
      const exect_search = getValues()[BulkListFormKey.EXECT_SEARCH];
      draft.exect_search = exect_search;
    });
    history.push({ search: toQueryString(clearNull(newValue)) });
  };

  const handleBulkApprove: ThirdSearchHeaderProps["onBulkApprove"] = () => {
    dispatch(resetSelectedIds({}));
    return refreshWithDispatch(dispatch(bulkApprove(ids)).then(unwrapResult));
  };
  const handleBulkReject: ThirdSearchHeaderProps["onBulkReject"] = () => {
    dispatch(resetSelectedIds({}));
    return refreshWithDispatch(dispatch(bulkReject(ids)).then(unwrapResult));
  };
  const handleApprove: OutcomeTableProps["onApprove"] = (id) => {
    dispatch(resetSelectedIds({}));
    return refreshWithDispatch(dispatch(approve(id)).then(unwrapResult));
  };
  const handleReject: OutcomeTableProps["onReject"] = (id) => {
    dispatch(resetSelectedIds({}));
    return refreshWithDispatch(dispatch(newReject({ id: id })).then(unwrapResult));
  };
  const handleBulkAddSet: ThirdSearchHeaderProps["onBulkAddSet"] = () => {
    if (!ids || !ids.length)
      return dispatch(actWarning(d("At least one learning outcome should be selected.").t("assess_msg_remove_select_one")));
    const isMy = isAllMineOutcome(ids, outcomeList, user_id);
    if ((condition.publish_status === OutcomePublishStatus.draft || condition.publish_status === OutcomePublishStatus.rejected) && !isMy)
      return dispatch(actWarning(d("You can only do bulk action to your own learning outcomes.").t("assess_msg_set_myonly")));
    setSelectedOutcomeSet([]);
    openAddSet();
    setShowSetList(false);
  };
  const handleClickAddSetConfirmBtn: AddSetProps["onAddSet"] = async () => {
    dispatch(resetSelectedIds({}));
    const set_ids = selectedOutcomeSet.map((item) => item.set_id);
    await refreshWithDispatch(dispatch(bulkBindOutcomeSet({ outcome_ids: ids, set_ids: set_ids as string[] })).then(unwrapResult));
    closeAddSet();
  };

  const handleClickSearchOutcomSet: AddSetProps["onSearchOutcomeSet"] = async (set_name) => {
    if (!set_name || !set_name.trim()) {
      setShowSetList(false);
      return;
    }
    await dispatch(pullOutcomeSet({ set_name }));
    setShowSetList(true);
  };
  const handleClickCreateOutcomeSet: AddSetProps["onCreateOutcomeSet"] = async (set_name) => {
    return await dispatch(createOutcomeSet({ set_name }));
  };
  const handleClickOk: AddSetProps["onSetOutcomeSet"] = (ids) => {
    const newIds = excluedOutcomeSet(ids, selectedOutcomeSet);
    const selectedSets = ids2OutcomeSet(newIds, outcomeSetList);
    const newSets = selectedOutcomeSet.concat(selectedSets);
    setSelectedOutcomeSet(newSets || []);
    setShowSetList(false);
  };
  const handleOnInputChange: AddSetProps["onInputChange"] = () => {
    if (showSetList) {
      setShowSetList(false);
    }
  };
  const handleClickDelete: AddSetProps["onDeleteSet"] = (set_id: string) => {
    const index = findSetIndex(set_id, selectedOutcomeSet);
    let newSets = cloneDeep(selectedOutcomeSet);
    newSets.splice(index, 1);
    setSelectedOutcomeSet(newSets);
  };
  const handleBulkDownloadAll: ThirdSearchHeaderProps["onBulkDownloadAll"] = async () => {
    const query = {
      is_locked: false, 
      page: 1, 
      page_size: 50
    }
    const { payload } = (await dispatch(exportOutcomes({...query, metaLoading: true}))) as unknown as PayloadAction<
        AsyncTrunkReturned<typeof exportOutcomes>
      >;
    if(payload) {
      openLoFields();
    }
  }
  const handleOpenFieldsSelected: ThirdSearchHeaderProps["onBulkDownloadSelected"] = async () => {
    if (!selectedIds.length)
      return dispatch(actWarning(d("At least one learning outcome should be selected.").t("assess_msg_remove_select_one")));
    const query = {
      outcome_ids: selectedIds, 
      is_locked: false, 
      page: 1, 
      page_size: 50
    }
    const { payload } = (await dispatch(exportOutcomes({...query, metaLoading: true}))) as unknown as PayloadAction<
        AsyncTrunkReturned<typeof exportOutcomes>
      >;
    if(payload) {
      openLoFields();
    }
  }
  const handleBulkDownload: LoFieldsProps["onBulkDownload"] = () => {
    dispatch(resetSelectedIds({}));
    const resetBulkListForm = {
      [BulkListFormKey.CHECKED_BULK_IDS]: [],
      [BulkListFormKey.SEARCH_TEXT_KEY]: condition.search_key,
      [BulkListFormKey.EXECT_SEARCH]: condition.exect_search,
    }
    reset(resetBulkListForm);
    closeLoFields();
    return true;
  }
  const handleChangeFields: LoFieldsProps["onChangeFields"] = (fields: string[]) => {
    setInitFields(fields)
  }
  useEffect(() => {
    let page = condition.page;
    if (outcomeList.length === 0 && total && total > 1) {
      page = 1;
      history.push({ search: toQueryString({ ...condition, page }) });
    }
  }, [condition, condition.page, history, outcomeList.length, total]);

  useEffect(() => {
    (async () => {
      await dispatch(onLoadOutcomeList({ ...condition, metaLoading: true }));
      const selectedIds = Object.keys(selectedIdsMap).filter(item => selectedIdsMap[item]);
      const initBulkListForm = {
        [BulkListFormKey.CHECKED_BULK_IDS]: selectedIds,
        [BulkListFormKey.SEARCH_TEXT_KEY]: "",
        [BulkListFormKey.EXECT_SEARCH]: OutcomeListExectSearch.all,
      }
      setTimeout(() => {
        reset(initBulkListForm);
      }, 100)
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition, reset, dispatch, refreshKey]);

  return (
    <div>
      <FirstSearchHeader />
      <FirstSearchHeaderMb />
      {hasPerm && (
        <>
          <SecondSearchHeader formMethods={formMethods} value={condition} onChange={handleChange} />
          <SecondSearchHeaderMb formMethods={formMethods} value={condition} onChange={handleChange} />
          <ThirdSearchHeader
            value={condition}
            selectedIdsLength={selectedIds.length}
            onChange={handleChange}
            onBulkPublish={handleBulkPublish}
            onBulkDelete={handleBulkDelete}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            onBulkAddSet={handleBulkAddSet}
            onBulkDownloadAll={handleBulkDownloadAll}
            onBulkDownloadSelected={handleOpenFieldsSelected}
          />
          <ThirdSearchHeaderMb
            value={condition}
            selectedIdsLength={selectedIds.length}
            onChange={handleChange}
            onBulkPublish={handleBulkPublish}
            onBulkDelete={handleBulkDelete}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            onBulkAddSet={handleBulkAddSet}
            onBulkDownloadAll={handleBulkDownloadAll}
            onBulkDownloadSelected={handleOpenFieldsSelected}
          />
        </>
      )}
      {isPending ? (
        ""
      ) : hasPerm ? (
        total === undefined ? (
          ""
        ) : outcomeList && outcomeList.length > 0 ? (
          <OutcomeTable
            formMethods={formMethods}
            list={outcomeList}
            total={total as number}
            userId={user_id}
            queryCondition={condition}
            onChangePage={handleChangePage}
            onClickOutcome={handleClickOutcome}
            onPublish={handlePublish}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ) : (
          emptyTip
        )
      ) : (
        permissionTip
      )}
      <AddSet
        open={addSetActive}
        onClose={closeAddSet}
        onAddSet={handleClickAddSetConfirmBtn}
        showSetList={showSetList}
        onSearchOutcomeSet={handleClickSearchOutcomSet}
        onCreateOutcomeSet={handleClickCreateOutcomeSet}
        onSetOutcomeSet={handleClickOk}
        selectedOutcomeSet={selectedOutcomeSet}
        outcomeSetList={outcomeSetList}
        onDeleteSet={handleClickDelete}
        defaultSelectOutcomeset={defaultSelectOutcomeset}
        onInputChange={handleOnInputChange}
      />
      <LoFields 
        open={loFieldsActive}
        list={downloadOutcomes ?? []}
        defaultFields={initFields}
        onClose={closeLoFields}
        onBulkDownload={handleBulkDownload}
        onChangeFields={handleChangeFields}
      />
    </div>
  );
}

OutcomeList.routeBasePath = "/assessments/outcome-list";
OutcomeList.routeRedirectDefault = `/assessments/outcome-list?publish_status=published&page=1&order_by=${OutcomeOrderBy._updated_at}`;

