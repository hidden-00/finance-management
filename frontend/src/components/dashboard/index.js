import React, { } from "react";
import { useAuth } from "../../provider/auth";
import { Button } from "@mui/material";

const Dashboard = () => {
  const auth = useAuth();
  return (
    <div className="container">
      <div>
        <h1>Welcome! {auth.user?.name}</h1>
        <h2>Finance Management, Mike</h2>
        <text>The website provides tools for users to manage personal or group finances.</text>
        <h2>
          Stack Technology (MERN)
        </h2>
        <li>Backend: NodeJS - ExpressJS</li>
        <li>Frontend: ReactJS</li>
        <li>Database: MongoDB</li>
        <h2>Features</h2>
        <li>Manage personal finance</li>
        <li>Group financial management</li>
        <br />
        <text>The source code is designed to serve both individuals and groups. You can create your own group and invite other members to your financial group, sharing personal financial income and expenses together in groups.</text>
        <br></br>
        <Button
          onClick={() => auth.logOut()}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >Logout</Button>
      </div>
    </div>
  );
};

export default Dashboard;
