import {
  Box,
  Button,
  CardContent,
  TextField,
  Card,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import Center from "./Center";
import useForm from "../hooks/useForm";
import { EndPoints, createAPIEndpoint } from "../api";
import { useStateContext } from "../hooks/useStateContext";
import { useNavigate } from "react-router-dom";
const getFreshModel = () => ({
  email: "",
  name: "",
});
export default function Login() {
  const { values, setValues, errors, setErrors, handleInputChange } =
    useForm(getFreshModel);
  const {context,setContext,resetContext} =useStateContext();
  const navigate = useNavigate();

  useEffect(()=>{
    resetContext()
  },[])

  const login = (e) => {
    e.preventDefault();
    if (validate())
      createAPIEndpoint(EndPoints.participant)
        .post(values)
        .then(res => {
           setContext({participantId:res.data.participantId});
           navigate("/quiz");
        })
        .catch((err) => console.log(err));
  };
  const validate = () => {
    let temp = {};
    temp.email = /\S+@\S+\.\S+/.test(values.email) ? "" : "email not vaild";
    temp.name = values.name !== "" ? "" : "this field is required";
    setErrors(temp);
    return Object.values(temp).every((x) => x === "");
  };
  return (
    <Center>
      <Card sx={{ width: 400 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ my: 3 }}>
            Quiz App
          </Typography>
          <Box
            sx={{
              "& .MuiTextField-root": {
                margin: 1,
                width: "90%",
              },
            }}
          >
            <form noValidate onSubmit={login} autoComplete="false">
              <TextField
                label="email"
                name="email"
                variant="outlined"
                value={values.email}
                onChange={handleInputChange}
                {...(errors.email && { error: true, helperText: errors.email })}
              />
              <TextField
                label="name"
                name="name"
                variant="outlined"
                value={values.name}
                onChange={handleInputChange}
                {...(errors.name && { error: true, helperText: errors.name })}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ width: "90%", margin: 1 }}
              >
                start
              </Button>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Center>
  );
}
