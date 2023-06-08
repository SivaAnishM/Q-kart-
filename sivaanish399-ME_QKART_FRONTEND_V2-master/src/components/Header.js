import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {  Stack,Avatar,Button } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { Link, useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const username = localStorage.getItem("username");
  function useLogOut() {
    localStorage.clear();
    window.location.reload();
  }
  // console.log(children,hasHiddenAuthButtons)

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children && <Box sx={{ width: "30rem" }}>{children}</Box>}
        {hasHiddenAuthButtons === "yes" ? (
        !username ? (
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              variant="text"
              onClick={() => history.push("/login", { from: "Products" })}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => history.push("/register", { from: "Products" })}
            >
              Register
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar alt={username} src="avatar.png" />
            <p>{username}</p>
            <Button variant="text" onClick={useLogOut}>
              Logout
            </Button>
          </Stack>
        )
        ) : (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          <Link to="/" 
          className="link" 
          variant="text"
            onClick={() => {
              history.push("/");
            }}> 
          Back to explore
          </Link>
        </Button>
        )}
      </Box>
    );
};

export default Header;
