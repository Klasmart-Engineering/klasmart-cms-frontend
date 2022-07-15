import React, { useRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { SketchField, Tools } from "react-sketch-master";
import { Box } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Divider from "@mui/material/Divider";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

const useStyles = makeStyles(({ shadows }) => ({
  sliderBox: {
    width: 180,
  },
  toolsBar: {
    display: "flex",
    justifyContent: "space-evenly",
    border: "1px solid black",
    borderRadius: "20px",
    alignItems: "center",
    height: "70px",
    transform: "scale(0.9)",
  },
  fieldItem: {
    width: "25px",
    height: "25px",
    borderRadius: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "& div": {
      width: "16px",
      height: "16px",
      borderRadius: "16px",
    },
  },
  toolSelected: {
    padding: "6px",
    backgroundColor: "black",
    color: "white",
    borderRadius: "10px",
  },
  toolUnSelected: {
    padding: "6px",
  },
  textField: {
    padding: "6px",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    borderRadius: "10px",
    position: "absolute",
    right: 0,
    bottom: "80px",
    background: "white",
  },
}));

export interface SketchChangeProps {
  isTraces: boolean;
}

export interface UiSketchProps {
  width: number;
  height: number;
  pictureUrl?: string;
  pictureInitUrl?: string;
  onChange?: (value: SketchChangeProps) => void;
}

export interface ImageDimesion {
  widthImg: number;
  bases64: string;
}

const Operations: {
  Pencil: string;
  Select: string;
  Text: string;
  Pan: string;
} = {
  Pencil: "pencil",
  Select: "select",
  Text: "text",
  Pan: "pan",
};

function valuetext(value: number) {
  return `${value}`;
}

export function getImageDimension(pictureUrl: string, initHeight: number): Promise<ImageDimesion> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = (pictureUrl + `?timestamp= ${Date.now()}`) as string;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const coefficient = initHeight / img.height;
      const widthImg = img.width * coefficient;
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx!.drawImage(img, 0, 0, img.width, img.height);
      const bases64 = canvas.toDataURL("image/png");
      resolve({ widthImg, bases64 });
    };
    img.onerror = reject;
  });
}

export const UiSketch = forwardRef<HTMLDivElement, UiSketchProps>((props, ref) => {
  const { width, height, pictureUrl, pictureInitUrl, onChange } = props;
  const css = useStyles();
  const sketchRef = useRef<any>(null);
  const [color, setColor] = React.useState<string>("#E60313");
  const [lineWidth, setLineWidth] = React.useState<number | number[]>(10);
  const [tool, setTool] = React.useState<string>(Tools.Pencil);
  const [currentOperation, setCurrentOperation] = React.useState<string>(Operations.Pencil);
  const [openText, setOpenText] = React.useState<boolean>(false);
  const [traces, setTraces] = React.useState<{ undo: boolean; redo: boolean }>({ undo: false, redo: false });
  const [text, SetText] = React.useState<string>("");
  const [widthImg, setWidthImg] = React.useState<number>(0);
  const fieldItemColor = [
    "#E60313",
    "#F5A101",
    "#FED900",
    "#3DB135",
    "#02FCFC",
    "#0068B7",
    "#A6569D",
    "#E73C8D",
    "#9F4500",
    "#000000",
    "#BAC769",
  ];

  const handleClick = (open: boolean) => {
    setOpenText(open);
  };

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    isTraces: isTraces,
    dataURLtoObject: dataURLtoObject,
    chooseImage: chooseImage,
  }));

  React.useEffect(() => {
    if (pictureUrl && height) {
      getImageDimension(pictureUrl, height).then((value) => {
        setWidthImg(value.widthImg);
        chooseImage(value.bases64);
      });
    }
  }, [pictureUrl, height]);

  const dataURLtoObject = (imageName: string, type: "obj" | "blob") => {
    const base64Data = sketchRef.current.toDataURL();
    const byteString = atob(base64Data.split(",")[1]);
    const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    if (type === "obj") {
      return new File([ia], imageName, { type: mimeString });
    } else {
      const BlobModel = new Blob([ab], { type: mimeString });
      const fd = new FormData();
      fd.append("upfile", BlobModel, imageName + ".png");
      return fd;
    }
  };

  const chooseImage = (bases64: string) => {
    sketchRef.current.setBackgroundFromDataUrl(bases64, {
      stretchedY: true,
    });
  };

  const isTraces = useMemo(() => {
    return traces.undo;
  }, [traces]);

  const fieldItem = () => {
    return (
      <>
        {fieldItemColor.map((c) => {
          return (
            <div
              className={css.fieldItem}
              key={c}
              onClick={() => {
                setColor(c);
                setTool(Tools.DefaultTool);
                setTimeout(() => {
                  setTool(tool);
                });
              }}
              style={{ border: `1px solid ${c}` }}
            >
              <div key={c} style={{ backgroundColor: c, boxShadow: `0px 0px 8px 0px ${c}` }}></div>
            </div>
          );
        })}
      </>
    );
  };
  const handleChangeSetLineWidth = (event: any, value: number | number[]) => {
    setLineWidth(value);
    setTool(Tools.DefaultTool);
    setTimeout(() => {
      setTool(tool);
    });
  };
  return (
    <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {!widthImg && (
        <div style={{ height: height, display: "flex", alignItems: "center" }}>
          <CircularProgress />
        </div>
      )}
      <SketchField
        ref={sketchRef}
        style={{ display: widthImg ? "block" : "none" }}
        onChange={(e: any) => {
          onChange && e.type === "mouseup" && onChange({ isTraces: sketchRef.current.canUndo() });
          setTraces({ undo: sketchRef.current.canUndo(), redo: sketchRef.current.canRedo() });
        }}
        lineColor={color}
        tool={tool}
        width={widthImg ? widthImg : width}
        height={height}
        lineWidth={lineWidth}
      />
      <div className={css.toolsBar} style={{ width: width }}>
        {fieldItem()}
        <Divider orientation="vertical" flexItem />
        <div className={css.sliderBox}>
          <Typography id="discrete-slider" gutterBottom>
            Weight
          </Typography>
          <Slider
            defaultValue={lineWidth}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={10}
            max={100}
            onChange={handleChangeSetLineWidth}
          />
        </div>
        <Tooltip title="Pen">
          <CreateIcon
            style={{ color: color, border: currentOperation === Operations.Pencil ? "1px dashed black" : "none" }}
            onClick={() => {
              setCurrentOperation(Operations.Pencil);
              setTool(Tools.Pencil);
            }}
          />
        </Tooltip>
        <Tooltip title="Select">
          <TouchAppIcon
            style={{ border: currentOperation === Operations.Select ? "1px dashed black" : "none" }}
            onClick={() => {
              setCurrentOperation(Operations.Select);
              setTool(Tools.Select);
              handleClick(false);
            }}
          />
        </Tooltip>

        <Tooltip title="Pan">
          <OpenWithIcon
            style={{ border: currentOperation === Operations.Pan ? "1px dashed black" : "none" }}
            onClick={() => {
              setCurrentOperation(Operations.Pan);
              setTool(Tools.Pan);
              handleClick(false);
            }}
          />
        </Tooltip>

        <Tooltip title="Text">
          <TextFieldsIcon
            style={{ border: currentOperation === Operations.Text ? "1px dashed black" : "none" }}
            onClick={() => {
              setCurrentOperation(Operations.Text);
              setTool(Tools.Select);
              handleClick(true);
            }}
          />
        </Tooltip>
        {openText && (
          <div className={css.textField}>
            <TextField
              id="standard-basic"
              size="small"
              label="Text"
              onChange={(e) => {
                SetText(e.target.value);
              }}
            />
            <CheckIcon
              style={{ color: "blue", marginLeft: "10px" }}
              onClick={() => {
                sketchRef.current.addText(text);
              }}
            />
            <CloseIcon
              style={{ color: "red", marginLeft: "10px" }}
              onClick={() => {
                handleClick(false);
              }}
            />
          </div>
        )}
        <Tooltip title="Undo">
          <UndoIcon
            style={{ color: traces.undo ? "black" : "darkgray" }}
            onClick={() => {
              if (sketchRef.current.canUndo()) sketchRef.current.undo();
            }}
          />
        </Tooltip>

        <Tooltip title="Redo">
          <RedoIcon
            style={{ color: traces.redo ? "black" : "darkgray" }}
            onClick={() => {
              if (sketchRef.current.canRedo()) sketchRef.current.redo();
            }}
          />
        </Tooltip>

        <Tooltip title="Clean">
          <DeleteIcon
            onClick={() => {
              setWidthImg(0);
              setTraces({ undo: false, redo: false });
              sketchRef.current.clear();
              onChange && onChange({ isTraces: false });
              getImageDimension((pictureInitUrl ?? pictureUrl) as string, height).then((value) => {
                setWidthImg(value.widthImg);
                chooseImage(value.bases64);
              });
            }}
          />
        </Tooltip>
      </div>
    </Box>
  );
});
