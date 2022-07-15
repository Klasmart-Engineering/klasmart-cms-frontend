import { DragOverlay, useDndContext, useDraggable } from "@dnd-kit/core";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Pagination } from "@mui/material";
import clsx from "clsx";
import React, { useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import { ContentEditRouteParams } from ".";
import { EntityQueryContentItem } from "../../api/api.auto";
import { SearchcmsList, SearchItems } from "../../components/SearchcmsList";
import { Thumbnail } from "../../components/Thumbnail";
import { comingsoonTip, resultsTip } from "../../components/TipImages";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints, shadows }) => ({
  mediaAssets: {
    minHeight: 900,
    [breakpoints.down("sm")]: {
      minHeight: 698,
    },
  },
  assetImage: {
    width: 104,
    height: 64,
    touchAction: "none",
    "&.active": {
      opacity: 0.7,
      boxShadow: shadows[2],
    },
  },
  tableContainer: {
    marginTop: 5,
    maxHeight: 700,
    marginBottom: 20,
    [breakpoints.down("md")]: {
      maxHeight: "fit-content",
    },
  },
  table: {
    minWidth: 700 - 162,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  cellThumnbnail: {
    width: 135,
  },
  cellAction: {
    width: 162,
  },
  pagination: {
    marginBottom: 20,
  },
  paginationUl: {
    justifyContent: "center",
  },
  emptyContainer: {
    textAlign: "center",
  },
}));

const mapContentType = (lesson: DraggableItemProps["lesson"], item: DraggableItemProps["item"]) => {
  return lesson === "material"
    ? item.content_type && Number(item.content_type * 10 + (item.data && (JSON.parse(item.data).file_type || 1)))
    : item.content_type;
};

interface DraggableItemProps {
  type: string;
  item: EntityQueryContentItem;
  lesson?: "assets" | "material" | "plan";
  permission: boolean;
}
function DraggableImage(props: DraggableItemProps) {
  const { type, item, lesson, permission } = props;
  const css = useStyles();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id as string,
    disabled: !permission,
    data: { type, item },
  });
  const contentType = mapContentType(lesson, item);
  return (
    <Thumbnail
      key={item.id}
      ref={setNodeRef}
      className={clsx(css.assetImage, { active: isDragging })}
      alt="pic"
      id={item.thumbnail}
      type={contentType}
      {...listeners}
      {...attributes}
    />
  );
}

export interface MediaAssetsProps {
  list: EntityQueryContentItem[];
  total: number;
  amountPerPage?: number;
  comingsoon?: boolean;
  value?: string;
  onSearch: (query: SearchItems) => any;
  onChangePage: (page: number) => any;
  mediaPage: number;
  isShare?: string;
  permission: boolean;
}
export default function MediaAssets(props: MediaAssetsProps) {
  const { lesson } = useParams<ContentEditRouteParams>();
  const css = useStyles();
  const { list, comingsoon, value, onSearch, total, onChangePage, mediaPage, isShare, permission } = props;
  const { active } = useDndContext();
  const amountPerPage = props.amountPerPage ?? 10;
  const handChangePage = useCallback(
    (event: object, page: number) => {
      onChangePage(page);
    },
    [onChangePage]
  );
  const rows = list?.map((item, idx) => {
    const dragType = "LIBRARY_ITEM";
    return (
      <TableRow key={item.id}>
        <TableCell className={css.cellThumnbnail}>
          <DraggableImage type={dragType} item={item} lesson={lesson} permission={permission} />
        </TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.author_name}</TableCell>
        {/* <TableCell className={css.cellAction}>
        <Button color="primary" variant="contained">
          Select
        </Button>
      </TableCell> */}
      </TableRow>
    );
  });
  const table = (
    <>
      <TableContainer className={css.tableContainer}>
        <Table className={css.table} stickyHeader>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell className={css.cellThumnbnail}>{d("Thumbnail").t("library_label_thumbnail")}</TableCell>
              <TableCell>
                {lesson === "plan" ? d("Material Name").t("library_label_material_name") : d("Asset Name").t("library_label_asset_name")}
              </TableCell>
              <TableCell>{d("Author").t("library_label_author")}</TableCell>
              {/* <TableCell className={css.cellAction}>{d("Actions").t('assess_label_actions')}</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
      <Pagination
        page={mediaPage}
        className={css.pagination}
        classes={{ ul: css.paginationUl }}
        onChange={handChangePage}
        count={Math.ceil(total / amountPerPage)}
        color="primary"
      />
    </>
  );
  const overlay = (
    <DragOverlay dropAnimation={null}>
      {active && (
        <Thumbnail
          className={clsx(css.assetImage, "active")}
          id={active.data.current?.item.thumbnail}
          type={mapContentType(lesson, active.data.current?.item)}
        />
      )}
    </DragOverlay>
  );
  return (
    <Box className={css.mediaAssets} display="flex" flexDirection="column" alignItems="center">
      {comingsoon && lesson !== "plan" ? (
        comingsoonTip
      ) : (
        <Box width="100%" pt={3}>
          <SearchcmsList onSearch={onSearch} value={value} lesson={lesson} isShare={isShare} />
          {list.length > 0 ? table : resultsTip}
          <div>{createPortal(overlay, document.body)}</div>
        </Box>
      )}
    </Box>
  );
}
