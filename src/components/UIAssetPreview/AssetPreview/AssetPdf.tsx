import { Box, makeStyles, Tooltip, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { useIntl } from "react-intl";
import { LazyLoadImage } from "react-lazy-load-image-component";
import fitToHeightIcon from "../../../assets/icons/fit-to-height.svg";
import fitToWidthIcon from "../../../assets/icons/fit-to-width.svg";
import zoomInFilledIcon from "../../../assets/icons/zoom-in-filled.svg";
import zoomInIcon from "../../../assets/icons/zoom-in.svg";
import zoomOutFilledIcon from "../../../assets/icons/zoom-out-filled.svg";
import zoomOutIcon from "../../../assets/icons/zoom-out.svg";
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
  height?: any;
}
interface ImageProps {
  src: string | undefined;
  width?: string | number;
  zoomProps?: Object;
  height?: string | number;
}
async function getPdfMetadata(pdfPath: string | undefined) {
  var data: number = 0;
  try {
    let pdfEndpoint: string = process.env.REACT_APP_KO_BASE_API + `/pdf/` || ``;
    let response = await axios.get(`${pdfEndpoint}v2/${pdfPath}/metadata`);
    data = response.data.totalPages;
  } catch (err) {
    data = 0;
  }
  return data;
}

export function PdfImage(props: ImageProps) {
  return (
    <Box display={"block"} textAlign={"center"}>
      <LazyLoadImage {...props.zoomProps} effect="blur" className="pdfImage" style={{ maxWidth: 3000 }} src={props.src} />
    </Box>
  );
}

export default function AssetPdf(props: file) {
  const intl = useIntl();
  const css = useStyles();
  const [pdfImages, setPdfImages] = useState<string[]>([]);
  let pdfSrc = props.src;
  pdfSrc = pdfSrc?.substring(pdfSrc?.lastIndexOf("/") + 1);
  pdfSrc = pdfSrc?.replace("-", "/");
  const minScale = 300;
  const maxScale = 2000;
  const [currentZoomType, setCurrentZoomType] = useState("width-fit");
  const [zoomProps, setZoomProps]: any = useState({});
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (currentZoomType === "width-fit") {
      setZoomProps({ width: "100%" });
    } else if (currentZoomType === "height-fit") {
      let Newheight: any = document.getElementById("viewContainer")?.offsetHeight;
      setZoomProps(() => ({ height: Newheight }));
    } else {
      setZoomProps({ width: scale });
    }
  }, [currentZoomType, scale]);

  useEffect(() => {
    if (currentZoomType === "height-fit" || currentZoomType === "width-fit") {
      let newWidth: any = document.querySelector<HTMLElement>(".pdfImage:first-child")?.offsetWidth;
      setScale(newWidth);
    }
  }, [currentZoomType, zoomProps]);

  const zoomIn = () => {
    if (scale === undefined) {
      let newWidth: any = document.querySelector<HTMLElement>(".pdfImage:first-child")?.offsetWidth;
      setScale(newWidth + 60);
    } else {
      if (scale <= maxScale) {
        setScale(scale + 60);
      }
    }

    setCurrentZoomType("zoom-in");
  };
  const zoomOut = () => {
    if (scale === undefined) {
      let newWidth: any = document.querySelector<HTMLElement>(".pdfImage:first-child")?.offsetWidth;
      setScale(newWidth);
    } else {
      if (scale >= minScale) {
        setScale(scale - 60);
      }
    }
    setCurrentZoomType("zoom-out");
  };
  const handleHeightFit = () => {
    setCurrentZoomType("height-fit");
  };
  const handleWidthFit = () => {
    setCurrentZoomType("width-fit");
  };

  useEffect(() => {
    getPdfMetadata(pdfSrc).then((data) => {
      let pageId = 1;
      let images = [];
      let pdfEndpoint: string = process.env.REACT_APP_KO_BASE_API + `/pdf/` || ``;
      while (pageId <= data) {
        images.push(`${pdfEndpoint}v2/${pdfSrc}/page/${pageId}`);
        pageId++;
      }
      setPdfImages(images);
    });
    const container: any = document.getElementById("viewContainer");
    setScale(container?.offsetWidth);
  }, [pdfSrc]);

  return (
    <>
      <Box
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <Box className={css.zoomBar}>
          <Typography className={css.zoomIcons} component="div">
            <Tooltip title={intl.formatMessage({ id: `library_tooltip_zoom_in` })}>
              {currentZoomType === "zoom-in" ? (
                <img alt="zoom-in-filled" onClick={zoomIn} className={css.zoomButton} src={zoomInFilledIcon} />
              ) : (
                <img onClick={zoomIn} alt="zoom-in" className={css.zoomButton} src={zoomInIcon} />
              )}
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: `library_tooltip_zoom_out` })}>
              {currentZoomType === "zoom-out" ? (
                <img alt="zoom-out-filled" onClick={zoomOut} className={css.zoomButton} src={zoomOutFilledIcon} />
              ) : (
                <img onClick={zoomOut} alt="zoom-out" className={css.zoomButton} src={zoomOutIcon} />
              )}
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: `library_tooltip_fit_to_width` })}>
              <img alt="fit-to-width" src={fitToWidthIcon} onClick={handleWidthFit} className={css.zoomButton} />
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: `library_tooltip_fit_to_height` })}>
              <img alt="fit-to-height" src={fitToHeightIcon} onClick={handleHeightFit} className={css.zoomButton} />
            </Tooltip>
          </Typography>
        </Box>
        <ScrollContainer hideScrollbars={false}>
          <Box maxHeight={"100vh"}>
            {pdfImages.map((item, key) => (
              <PdfImage zoomProps={zoomProps} src={item} key={key} />
            ))}
          </Box>
        </ScrollContainer>
      </Box>
    </>
  );
}
