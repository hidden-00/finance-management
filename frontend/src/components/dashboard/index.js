import React, { } from "react";
import { useAuth } from "../../provider/auth";
import { Button } from "@mui/material";

const Dashboard = () => {
  const auth = useAuth();
  return (
    <div className="container">
      <div>
        <h1>Welcome! {auth.user?.name}</h1>
        <Button
          onClick={()=> auth.logOut()}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >Logout</Button>
      </div>
    </div>
  );
};

export default Dashboard;
