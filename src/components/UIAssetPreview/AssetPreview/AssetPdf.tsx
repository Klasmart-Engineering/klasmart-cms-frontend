import { Box, makeStyles, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import fitToHeightIcon from "../../../assets/icons/fit-to-height.svg";
import fitToWidthIcon from "../../../assets/icons/fit-to-width.svg";
import zoomInFilledIcon from "../../../assets/icons/zoom-in-filled.svg";
import zoomInIcon from "../../../assets/icons/zoom-in.svg";
import zoomOutFilledIcon from "../../../assets/icons/zoom-out-filled.svg";
import zoomOutIcon from "../../../assets/icons/zoom-out.svg";
import ReportPagination from "../../ReportPagination/ReportPagination";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const ROWSPERPAGE = 100;
const scrollbarWidth = 10;
const scrollbarHeight = 10;
const useStyles = makeStyles((theme) => ({
  zoomBar: {
    padding: "10px",
    width: "100%",
    display: "flex",
    gridGap: "10px",
    position: "absolute",
    zIndex: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomButton: {
    border: "none",
    borderRadius: "4px",
    width: "22px",
    padding: "3px",
    cursor: "pointer",
    "&:hover": {
      background: "#FFFFFF3D",
    },
  },
  assetsContent: {
    height: "calc(100% - 32px)",
    width: "100%",
    background: "rgb(82 86 89)",
    justifyContent: "center",
    overflowY: "auto",
    overflowX: "auto",
    "&::-webkit-scrollbar": {
      width: scrollbarWidth,
      height: scrollbarHeight,
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  },
  pageCon: {
    backgroundColor: "rgb(82, 86, 89)",
    "& .react-pdf__Page__canvas": {
      width: "100%",
      margin: "0px auto",
    },
  },
  zoomIcons: {
    background: "rgb(0 0 0 / 65%)",
    borderRadius: "8px",
    padding: "6px",
    display: "flex",
    alignItems: "center",
  },
}));
interface file {
  src: string | undefined;
}

export default function AssetPdf(props: file) {
  const css = useStyles();
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState<number>(1);
  const [scale, setScale] = useState(1);
  function onDocumentLoadSuccess(pdf: any) {
    setNumPages(pdf.numPages);
  }
  const num = numPages < 100 ? numPages : (page - 1) * ROWSPERPAGE + ROWSPERPAGE > numPages ? numPages - (page - 1) * ROWSPERPAGE : 100;

  const [currentZoomType, setCurrentZoomType] = useState("height-fit");

  const containerRef = useRef<null | HTMLDivElement>(null);

  const maxScale = 4;
  const minScale = 0.5;

  const zoomIn = () => {
    setCurrentZoomType("zoom-in");
    if (scale <= maxScale) {
      setScale(scale + 0.1);
    }
  };
  const zoomOut = () => {
    setCurrentZoomType("zoom-out");
    if (scale >= minScale) {
      setScale(scale - 0.1);
    }
  };

  const [zoomProps, setZoomProps]: any = useState({});

  useEffect(() => {
    if (currentZoomType === "height-fit") {
      let Newheight: any = containerRef?.current?.offsetHeight;
      setZoomProps(() => ({ height: Newheight }));
    } else if (currentZoomType === "width-fit") {
      let NewWidth: any = containerRef?.current?.offsetWidth;
      NewWidth = NewWidth - scrollbarWidth;
      setZoomProps(() => ({ width: NewWidth }));
    }
  }, [currentZoomType]);

  const handleWidthFit = () => {
    setCurrentZoomType("width-fit");
    setScale(1);
  };

  const handleHeightFit = () => {
    setCurrentZoomType("height-fit");
    setScale(1);
  };

  const intl = useIntl();

  return (
    <>
      <div className={css.assetsContent} style={{ height: containerRef?.current?.offsetHeight }} ref={containerRef}>
        <Box className={css.zoomBar}>
          <Box mt={2} display="inline-block">
            <Typography className={css.zoomIcons} component="div">
              <Tooltip
                title={intl.formatMessage({
                  id: `tooltip.zoomIn`,
                })}
              >
                {currentZoomType === "zoom-in" ? (
                  <img alt="zoom-in-filled" onClick={zoomIn} className={css.zoomButton} src={zoomInFilledIcon} />
                ) : (
                  <img onClick={zoomIn} alt="zoom-in" className={css.zoomButton} src={zoomInIcon} />
                )}
              </Tooltip>
              <Tooltip
                title={intl.formatMessage({
                  id: `tooltip.zoomOut`,
                })}
              >
                {currentZoomType === "zoom-out" ? (
                  <img alt="zoom-out-filled" onClick={zoomOut} className={css.zoomButton} src={zoomOutFilledIcon} />
                ) : (
                  <img onClick={zoomOut} alt="zoom-out" className={css.zoomButton} src={zoomOutIcon} />
                )}
              </Tooltip>
              <Tooltip
                title={intl.formatMessage({
                  id: `tooltip.fitToWidth`,
                })}
              >
                <img alt="fit-to-width" onClick={handleWidthFit} className={css.zoomButton} src={fitToWidthIcon} />
              </Tooltip>
              <Tooltip
                title={intl.formatMessage({
                  id: `tooltip.fitToHeight`,
                })}
              >
                <img alt="fit-to-height" onClick={handleHeightFit} className={css.zoomButton} src={fitToHeightIcon} />
              </Tooltip>
            </Typography>
          </Box>
        </Box>
        <Document file={props.src} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(num), (el, index) => (
            <Page
              {...zoomProps}
              scale={scale}
              className={css.pageCon}
              key={`page_${index + 1 + (page - 1) * ROWSPERPAGE}`}
              pageNumber={index + 1 + (page - 1) * ROWSPERPAGE}
            />
          ))}
        </Document>
      </div>
      {numPages > ROWSPERPAGE && (
        <ReportPagination page={page} count={numPages} rowsPerPage={ROWSPERPAGE} onChangePage={(page) => setPage(page)} />
      )}
    </>
  );
}
