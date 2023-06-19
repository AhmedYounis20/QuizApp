import React, { useContext, useEffect, useState } from "react";
import { stateContext } from "../hooks/useStateContext";
import { BASE_URL, EndPoints, createAPIEndpoint } from "../api";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { getFormatedTime } from "../helper";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const { context, setContext } = useContext(stateContext);
  const [qns, setQns] = useState([]);
  const [qnIndex, setQnIndex] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const navigate= useNavigate();
  let timer;
  const startTimer = () => {
    timer = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, [1000]);
  };

  useEffect(() => {
    createAPIEndpoint(EndPoints.question)
      .fetch()
      .then((res) => {
        setQns(res.data);
        startTimer();
      })
      .catch((err) => console.log(err));

    return () => {
      clearInterval(timer);
    };
  }, []);

  const updateAnswer = (qnId, optionIdx) => {
    const temp = [...context.selectedOptions];
    temp.push({
      qnId,
      selected: optionIdx+1,
    });

    if (qnIndex < 4) {
      setContext({ ...context,selectedOptions: [...temp] });
      setQnIndex(qnIndex + 1);
    } 
    else{
      setContext({ ...context,selectedOptions: [...temp], timeTaken });
      navigate("/result");
    }
  };

  return qns.length != 0 ? (
    <Card
      sx={{
        maxWidth: 640,
        mx: "auto",
        mt: 5,
        "& .MuiCardHeader-action": { m: 0, alignSelf: "center" },
      }}
    >
      <CardHeader
        title={"Question " + (qnIndex + 1) + " of 5"}
        action={<Typography>{getFormatedTime(timeTaken)}</Typography>}
      />
      <Box>
        <LinearProgress
          variant="determinate"
          value={((qnIndex + 1) * 100) / 5}
        />
      </Box>
      {qns[qnIndex].imageName==null ? null:<CardMedia component={"img"} image={BASE_URL+'images/'+qns[qnIndex].imageName} sx={{width:'auto',m:"10px auto"}}  /> }
      <CardContent>
        <Typography variant="h6"> {qns[qnIndex].qnInWords}</Typography>
        <List>
          {qns[qnIndex].options.map((item, idx) => {
            return (
              <ListItemButton
                key={idx}
                disableRipple
                onClick={() => updateAnswer(qns[qnIndex].qnId, idx)}
              >
                <div>
                  {String.fromCharCode(65 + idx)} . {item}
                </div>
              </ListItemButton>
            );
          })}
          <ListItem></ListItem>
        </List>
      </CardContent>
    </Card>
  ) : null;
}
