import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SelectBtn from "../components/selectBtn";
import school from "../../../mocks/school.json";

const useStyles = makeStyles(() =>
  createStyles({
    lineStyle: {
      flex: 4,
      height: "746px",
      opacity: 1,
      background: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.20), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14)",
      padding: "24px 24px 40px 24px",
      boxSizing: "border-box",
      marginRight: "47px",
    },
    pieStyle: {
      flex: 1,
      height: "746px",
      opacity: 1,
      background: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.20), 0px 1px 10px 0px rgba(0,0,0,0.12), 0px 4px 5px 0px rgba(0,0,0,0.14)",
      padding: "24px 24px 40px 24px",
      boxSizing: "border-box",
    },
    detailStyle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textStyle: {
      fontSize: "20px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
      color: "#000000",
    },
    title: {
      fontSize: "20px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
      color: "#000000",
      marginBottom: "48px",
    },
    pie: {
      height: "370px",
      marginBottom: "20px",
    },
    number: {
      fontSize: "18px",
      fontFamily: "Helvetica, Helvetica-Regular",
      fontWeight: 400,
      color: "#666666",
      textAlign: "center",
    },
    view: {
      width: "273px",
      height: "48px",
      margin: "108px auto 0",
      display: "flex",
      justifyContent: "center",
    },
    btn: {
      width: "100%",
      height: "100%",
      fontSize: "16px",
      fontFamily: "Helvetica, Helvetica-Bold",
      fontWeight: 700,
    },
  })
);

export default function () {
  const css = useStyles();
  const [value, setValue] = useState({
    schoolVal: "",
    classVal: "",
    timeVal: "",
  });
  const [data, setData] = useState({
    schoolData: [""],
    classData: [""],
    timeData: [""],
  });

  useEffect(() => {
    const sData = ["All"];
    const cData = ["All"];
    const tData = ["latest 4 weeks", "latest 3 months", "latest 12 months"];
    school.forEach((item: any) => sData.push(item.name));
    sData.push("None");
    switch (value.schoolVal) {
      case "All":
        school.forEach((item: any) => item.classes.forEach((value: any) => cData.push(value.name)));
        break;
      case "None":
        break;
      case "":
        break;
      default:
        setValue({ ...value, classVal: cData[0] });
        school.forEach((item: any) => {
          if (item.name === value.schoolVal) {
            item.classes.forEach((value: any) => cData.push(value.name));
          }
        });
        break;
    }
    setData({ schoolData: sData, classData: cData, timeData: tData });

    // eslint-disable-next-line
  }, [value.schoolVal]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, schoolVal: event.target.value as string });
  };
  const handleChange2 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, classVal: event.target.value as string });
  };
  const handleChange3 = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue({ ...value, timeVal: event.target.value as string });
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
      <div className={css.lineStyle}>
        <div className={css.detailStyle}>
          <div className={css.textStyle}>Class Registration Details</div>
          <div>
            <SelectBtn value={value.schoolVal} handleChange={handleChange} label="School" data={data.schoolData} />
            <SelectBtn value={value.classVal} handleChange={handleChange2} label="Class" data={data.classData} />
            <SelectBtn value={value.timeVal} handleChange={handleChange3} data={data.timeData} />
          </div>
        </div>
        <div></div>
      </div>
      <div className={css.pieStyle}>
        <div className={css.title}>
          Number of students
          <br />
          created account
        </div>
        <div className={css.pie}>饼图</div>
        <div className={css.number}>
          Out of 9400
          <br />
          students
        </div>
        <div className={css.view}>
          <Button variant="contained" color="primary" className={css.btn}>
            View full list
          </Button>
        </div>
      </div>
    </div>
  );
}
