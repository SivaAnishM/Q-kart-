import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { Link, useHistory } from "react-router-dom";

const Register = () => {

  const { enqueueSnackbar } = useSnackbar();
 
  const userData = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(userData);
  const [isLoading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const history=useHistory();
  // console.log(formData)


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async () => {
    if(validateInput(formData)){
      postData(formData)
    }
  };

  const postData = async (data) =>{
    setLoading(true)
    let url=config.endpoint;
    let newdata ={
      username : data.username,
      password : data.password
    }
    try {
    let res =await axios.post(`${url}/auth/register`,newdata);
    if( res.data.success){
      enqueueSnackbar("Registered successfully", { variant: "success" });
      history.push("/login", { from: "Register" })
    }
    } catch (e) {
      if (!e.response.data.success) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
    setLoading(false)
  }

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    
    let username = data.username
    let password = data.password
    let confirmPassword = data.confirmPassword

    if(username === ""){
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    
    if(username.length < 6){
      enqueueSnackbar("Username must contain atleast 6 characters", { variant: "warning" });
      return false
    }
    if(password === "" || confirmPassword === ""){
      enqueueSnackbar("password is a required field", { variant: "warning" });
      return false
    }
    if(password.length < 6){
      enqueueSnackbar("password must contain atleast 6 characters required field", { variant: "warning" });
      return false
    }
    if(password !== confirmPassword){
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false
    }
    return true
  };


  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            value={formData.confirmPassword}
            type="password"
            fullWidth
          />
           {isLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress color="success" />
            </Box>
          ) : (
            <Button className="button" variant="contained" onClick={register}>
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
             <Link className="link" to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
