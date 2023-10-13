import React, { useContext, useEffect, useState } from "react";
import { BASE_URL, EndPoints, createAPIEndpoint } from "../api";
import { useStateContext } from "../hooks/useStateContext";
import { Box, Card,CardContent, CardMedia, Typography } from "@mui/material";

export default function Result() {
  const { context, setContext } = useStateContext();
  const [score,setScore]= useState(0);
  const [isLoading,setIsLoading ] = useState(true);
  useEffect(() => {
    const ids = context.selectedOptions.map((x) => x.qnId);
    createAPIEndpoint(EndPoints.getAnswers)
      .post(ids)
      .then((res) => {
      const qna = context.selectedOptions.map((x) => ({
        ...x,
        ...res.data.find((y) => y.qnId === x.qnId),
      }));
      calculateScore(qna);
        setIsLoading(false);
    })
    .catch((err) => console.log(err));
  }, []);

  const calculateScore = qna => {
    let tempScore= qna.reduce((acc,curr)=>{
        return curr.answer === curr.selected? acc+1: acc;
    },0)
    console.log(tempScore);
    setScore(tempScore);
  }
  return (
    <Card
      sx={{
        mx: "auto",
        mt: 5,
        display: "flex",
        width: "100%",
        maxWidth: 640,
      }}
    >
      {!isLoading && (
        <>
          <CardContent sx={{ textAlign: "center", flex: "1 0 auto" }}>
            {score >= 3 && (
              <Typography variant="h5"> Congratulations!</Typography>
            )}
            <Typography variant="h5"> YOUR SCORE</Typography>
            <Typography variant="h5"> {score}/5</Typography>
            <Typography variant="h5"> Took {context.timetaken} mins</Typography>
          </CardContent>
          {score >= 3 && (
            <Box
              sx={{
                maxWidth: 640,
                maxHeight: 400,
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <CardMedia
                component={"img"}
                image={BASE_URL + "images/" + "result.png"}
                sx={{ width: "250px", m: "10px auto" }}
              />
            </Box>
          )}
        </>
      )}
    </Card>
  );
}
