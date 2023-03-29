import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import MyPhoto from "./images/CO2.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
      boxShadow: "0 3px 5px 2px rgba(108, 122, 137, 1)",
      background: "linear-gradient(30deg, #FF00B4 30%, #007BFF 90%)"
    }
  },

  large: {
    width: theme.spacing(30),
    height: theme.spacing(30),
    fontSize: 20 * theme.spacing()
  }
}));

export default function ImageAvatars() {
  const classes = useStyles();
  const name = "Username";

  return (
    <div className={classes.root}>
      <Avatar alt={name} src={MyPhoto} className={classes.large} />
    </div>
  );
}
