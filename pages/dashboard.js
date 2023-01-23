import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, onValue } from "firebase/database";

const Dashboard = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  const readUserData = () => {
    //read data from db
    const db = getDatabase();
    const userRef = ref(db, "users");
    onValue(userRef, (snapshot) => {
      const rawData = snapshot.val();
      const arrData = [];
      Object.keys(rawData).map((e) => {
        arrData.push({ uid: e, ...rawData[e] });
      });
      // console.log(arrData[0].uid);
      setUsers(arrData);
    });
  };

  const getCurrentUserData = () => {
    const db = getDatabase();
    const userRef = ref(db, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const rawData = snapshot.val();
      setCurrentUser(rawData);
    });
  };

  useEffect(() => {
    readUserData();
    getCurrentUserData();
  }, []);

  return (
    <div>
      Dashboard
      <div>Current user login : {currentUser.name}</div>
      <div className="mt-5">
        {users.map((e, index) => (
          <div key={e.uid} className="flex gap-5">
            <span>{index + 1}</span>
            <span>{e.name}</span>
            <span>{e.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
