import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { ElasticLayerControl } from "./types";
import { Box } from "@material-ui/core";
/*import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import BorderColorIcon from "@material-ui/icons/BorderColor";*/
import CloseIcon from "@material-ui/icons/Close";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: "20%",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[6],
      padding: theme.spacing(2, 4, 3),
      textAlign: "center",
    },
    commentBox: {
      position: "absolute",
      width: "30%",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[6],
      padding: theme.spacing(2, 0, 3, 0),
      textAlign: "center",
      "& h3": {
        textAlign: "initial",
        padding: "0px 0px 20px 20px",
        margin: "0",
        borderBottom: "1px solid #EEEEEE",
      },
    },
    DetailViewBox: {
      position: "absolute",
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[6],
      padding: theme.spacing(2, 0, 1, 0),
      textAlign: "center",
      "& h3": {
        textAlign: "initial",
        padding: "0px 20px 20px 20px",
        margin: "0",
        borderBottom: "1px solid #EEEEEE",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
    },
  })
);

interface elasticLayerControlProps {
  elasticLayerControlData?: ElasticLayerControl;
  handleElasticLayerControl: (elasticLayerControlData: ElasticLayerControl) => void;
}

interface NoticeProps extends elasticLayerControlProps {
  contentText: string;
}

/*function NoticeTemplate(props: NoticeProps) {
  const {contentText, handleElasticLayerControl} = props;
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  return (
    <Box style={modalStyle} className={classes.paper}>
      <p style={{lineHeight: "28px", color: "#666666"}}>{contentText}</p>
      <span style={{display: "flex", justifyContent: "flex-end"}}>
        <Button color="primary" onClick={()=>{handleElasticLayerControl({ link: "", openStatus: false, type: "" })}}>Cancel</Button>
        <Button color="primary" onClick={()=>{handleElasticLayerControl({ link: "", openStatus: false, type: "" })}}>OK</Button>
      </span>
    </Box>
  )
}*/

/*interface CommentsProps extends elasticLayerControlProps{
  commentText: string
}*/
/*function CommentsTemplate(props: CommentsProps) {
  const {commentText, handleElasticLayerControl} = props
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  return (
    <Box style={modalStyle} className={classes.commentBox}>
      <h3>Add comments</h3>
      <div style={{padding: "16px"}}>
        <TextField
          id="filled-multiline-flexible"
          style={{width: "100%"}}
          multiline
          rows={8}
          variant="outlined"
          placeholder=" Leave a message to your student!"
          InputProps={{
            startAdornment: <InputAdornment position="start"><BorderColorIcon style={{ fontSize: "15px", position: "absolute", top: "20px", left: "5px" }} /></InputAdornment>,
          }}
        />
      </div>
      <span style={{display: "flex", justifyContent: "flex-end"}}>
        <Button style={{marginRight: "16px"}} variant="outlined" color="primary" onClick={()=>{handleElasticLayerControl({ link: "", openStatus: false, type: "" })}}>Cancel</Button>
        <Button style={{marginRight: "16px"}} variant="contained" color="primary" onClick={()=>{handleElasticLayerControl({ link: "", openStatus: false, type: "" })}}>OK</Button>
      </span>
    </Box>
  )
}*/

function DetailedViewTemplate(props: NoticeProps) {
  //const {contentText, handleElasticLayerControl} = props
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  return (
    <Box style={modalStyle} className={classes.DetailViewBox}>
      <h3>
        Add comments <CloseIcon />
      </h3>
      <p style={{ padding: "12px", lineHeight: "30px" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus felis ac diam placerat, ut scelerisque massa scelerisque. Ut
        sollicitudin erat mauris, a aliquam est posuere ut. In convallis erat id sem blandit ornare. Sed convallis sed massa ac hendrerit.
        Maecenas quis dui diam. Curabitur varius nunc sit amet metus semper fermentum. Duis vitae venenatis ligula, et aliquet mi. Quisque
        nunc ligula, condimentum luctus luctus ac, pulvinar ut dui. Pellentesque euismod ultricies nulla sed faucibus. Nulla facilisi. Class
        aptent taciti sociosqu ad litora
      </p>
    </Box>
  );
}

export default function ResourcesView(props: elasticLayerControlProps) {
  const { elasticLayerControlData, handleElasticLayerControl } = props;

  const handleClose = () => {
    handleElasticLayerControl({ link: "", openStatus: false, type: "" });
  };

  const body = (
    <DetailedViewTemplate
      contentText={"There are still students not start their Study activities. You cannot change the assessment after clicking Complete."}
      handleElasticLayerControl={handleElasticLayerControl}
    />
  );

  return (
    <div>
      <Modal
        open={elasticLayerControlData?.openStatus ?? false}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
