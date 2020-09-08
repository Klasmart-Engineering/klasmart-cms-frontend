import { Typography } from "@material-ui/core";
import { PayloadAction } from "@reduxjs/toolkit";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { OrderBy } from "../../api/api.d";
import emptyIconUrl from "../../assets/icons/empty.svg";
import { AppDispatch, RootState } from "../../reducers";
import { actOutcomeList, bulkDeleteOutcome, bulkPublishOutcome, deleteOutcome, publishOutcome } from "../../reducers/outcome";
import { FirstSearchHeader, FirstSearchHeaderMb, FirstSearchHeaderProps } from "./FirstSearchHeader";
import { SecondSearchHeader, SecondSearchHeaderMb } from "./SecondSearchHeader";
import FakeTableList, { OutcomeListProps } from "./TableList";
import { ThirdSearchHeader, ThirdSearchHeaderMb, ThirdSearchHeaderProps } from "./ThirdSearchHeader";
import { BulkListForm, BulkListFormKey, OutcomeQueryCondition } from "./types";

const PAGE_SIZE = 16;

const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

const useQuery = (): OutcomeQueryCondition => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const outcome_name = query.get("outcome_name");
    const publish_status = query.get("publish_status");
    const author_name = query.get("author_name");
    const page = Number(query.get("page")) || 1;
    const order_by = (query.get("order_by") as OrderBy | null) || undefined;

    return clearNull({ outcome_name, publish_status, author_name, page, order_by });
  }, [search]);
};

const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};

interface RefreshWithDispatch {
  <T>(result: Promise<PayloadAction<T>>): Promise<PayloadAction<T>>;
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

export default function OutcomeList() {
  const condition = useQuery();
  const history = useHistory();
  const { refreshKey, refreshWithDispatch } = useRefreshWithDispatch();
  const formMethods = useForm<BulkListForm>();
  const { getValues, reset } = formMethods;
  const { outcomeList, total } = useSelector<RootState, RootState["outcome"]>((state) => state.outcome);
  const dispatch = useDispatch<AppDispatch>();
  const handlePublish: OutcomeListProps["onPublish"] = (id) => {
    return refreshWithDispatch(dispatch(publishOutcome(id)));
  };
  const handleBulkPublish: ThirdSearchHeaderProps["onBulkPublish"] = () => {
    const ids = getValues()[BulkListFormKey.CHECKED_BULK_IDS];
    return refreshWithDispatch(dispatch(bulkPublishOutcome(ids)));
  };
  const handleDelete: OutcomeListProps["onDelete"] = (id) => {
    return refreshWithDispatch(dispatch(deleteOutcome(id)));
  };
  const handleBulkDelete: ThirdSearchHeaderProps["onBulkDelete"] = () => {
    const ids = getValues()[BulkListFormKey.CHECKED_BULK_IDS];
    return refreshWithDispatch(dispatch(bulkDeleteOutcome(ids)));
  };
  const handleChangePage: OutcomeListProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickConent: OutcomeListProps["onClickContent"] = (id) => history.push(`/library/content-preview?id=${id}`);
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  const handleChangeCategory: FirstSearchHeaderProps["onChangeCategory"] = (value) => history.push("/assesmemts/assesment-list");
  useEffect(() => {
    reset();
    // todo: dont remove
    dispatch(actOutcomeList({ ...condition, page_size: PAGE_SIZE, metaLoading: true }));
  }, [condition, reset, dispatch, refreshKey]);

  return (
    <div>
      <FirstSearchHeader value={condition} onChange={handleChange} onChangeCategory={handleChangeCategory} />
      <FirstSearchHeaderMb value={condition} onChange={handleChange} onChangeCategory={handleChangeCategory} />
      <SecondSearchHeader value={condition} onChange={handleChange} />
      <SecondSearchHeaderMb value={condition} onChange={handleChange} />
      <ThirdSearchHeader value={condition} onChange={handleChange} onBulkPublish={handleBulkPublish} onBulkDelete={handleBulkDelete} />
      <ThirdSearchHeaderMb value={condition} onChange={handleChange} onBulkPublish={handleBulkPublish} onBulkDelete={handleBulkDelete} />
      {outcomeList && outcomeList.length > 0 ? (
        <FakeTableList
          formMethods={formMethods}
          list={outcomeList}
          total={total}
          queryCondition={condition}
          onChangePage={handleChangePage}
          onClickContent={handleClickConent}
          onPublish={handlePublish}
          onDelete={handleDelete}
        />
      ) : (
        <div style={{ margin: "0 auto", textAlign: "center" }}>
          <img src={emptyIconUrl} alt="" />
          <Typography variant="body1" color="textSecondary">
            Empty...
          </Typography>
        </div>
      )}
    </div>
  );
}

OutcomeList.routeBasePath = "/assesmemts/outcome-list";
OutcomeList.routeRedirectDefault = "/assesmemts/outcome-list?publish_status=published";
