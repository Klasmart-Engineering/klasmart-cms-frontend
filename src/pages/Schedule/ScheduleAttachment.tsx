import { Box, TextField } from "@material-ui/core";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { CloudDownloadOutlined, CloudUploadOutlined, InfoOutlined } from "@material-ui/icons";
import React from "react";
import { apiResourcePathById } from "../../api/extra";
import { SingleUploader } from "../../components/SingleUploader";

const useStyles = makeStyles(() => ({
  fieldset: {
    marginTop: 20,
    width: "100%",
  },
  fieldBox: {
    position: "relative",
  },
  iconField: {
    position: "absolute",
    top: "48%",
    cursor: "pointer",
  },
}));

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "#FFFFFF",
    maxWidth: 260,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

const tipsText = (
  <div style={{ paddingBottom: "8px" }}>
    <div style={{ color: "#000000", fontWeight: "bold" }}>
      <p>Max: 100MB</p>
      <span>Support files In:</span>
    </div>
    <div style={{ color: "#666666" }}>
      <span>Video (avi, mov,mp4)</span>
      <br />
      <span>Audio (mp3, wav)</span>
      <br />
      <span>Image (jpg, jpeg, png, gif, bmp)</span>
      <br />
      <span>Document (doc, docx, ppt, pptx, xls, xlsx, pdf)</span>
    </div>
  </div>
);

interface ScheduleAttachmentProps {
  setAttachmentId: (id: string) => void;
  attachmentId: string;
}

export default function ScheduleAttachment(props: ScheduleAttachmentProps) {
  const { setAttachmentId, attachmentId } = props;
  const css = useStyles();
  const downloadFile = () => {
    const url: any = apiResourcePathById(attachmentId);
    console.log(url, 111);
    setDownloadUrl(url);
  };
  const handleOnChange = (value: any) => {
    setAttachmentId(value);
    const url: any = apiResourcePathById(value);
    setDownloadUrl(url);
  };

  const [downloadUrl, setDownloadUrl] = React.useState("");

  return (
    <SingleUploader
      partition="attachment"
      onChange={handleOnChange}
      render={({ uploady, item, btnRef, value, isUploading }) => (
        <Box className={css.fieldBox}>
          <TextField disabled className={css.fieldset} placeholder="Attachment" value={item ? item.file.name : attachmentId}></TextField>
          <HtmlTooltip title={tipsText}>
            <InfoOutlined className={css.iconField} style={{ left: "110px", display: item ? "none" : "block" }} />
          </HtmlTooltip>
          <input type="file" style={{ display: "none" }} />
          {
            // @ts-ignore
            <CloudUploadOutlined className={css.iconField} style={{ right: "10px" }} ref={btnRef} />
          }
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            {attachmentId && <CloudDownloadOutlined className={css.iconField} style={{ right: "50px" }} />}
          </a>
        </Box>
      )}
    />
  );
}
