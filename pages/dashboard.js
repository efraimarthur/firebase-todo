import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <div>
      Dashboard
      <div>email : {user.email}</div>
    </div>
  );
};

export default Dashboard;
