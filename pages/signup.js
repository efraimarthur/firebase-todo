import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { set, ref, getDatabase } from "firebase/database";

const SignUp = () => {
  const { user, signup, logout, getDisplayName } = useAuth();
  // console.log(user?.uid);
  const [userLocal, setUserLocal] = useState("");

  const [data, setData] = useState({ name: "", email: "", password: "" });

  const router = useRouter();

  const writeUserData = async () => {
    const db = getDatabase();
    // console.log(user?.uid);
    await set(ref(db, "users/" + userLocal), {
      name: data.name,
      email: data.email,
    });
  };

  const addTodo = () => {
    const randomString = Math.random().toString(36).substring(2, 12);
    const db = getDatabase();
    const CapitalizeName =
      data.name.charAt(0).toUpperCase() + data.name.slice(1);
    // console.log(CapitalizeName);

    set(ref(db, "todo/" + user.uid + "/running" + "/" + randomString), {
      title: "Welcome, its Title",
      description: `Description : Hello my name is ${CapitalizeName}`,
    });

    set(ref(db, "todo/" + user.uid + "/done" + "/" + randomString), {
      title: `Congratulation,  ${CapitalizeName}`,
      description: `you've done your todo "example"`,
    });

    // console.log(data.title);
    // console.log(data.description);
    // setTodoId(todoId + 1);
    // console.log(todoId);
  };

  useEffect(() => {
    if (userLocal) {
      writeUserData();
      addTodo();
      logout();
      router.push("/login");
    }
  }, [userLocal]);

  const handleSignUp = async (user, event) => {
    event.preventDefault();
    try {
      //passing the email and password to create user
      const a = await signup(data.email, data.password);
      await getDisplayName(data.name);
      // console.log(data.name);
      setUserLocal(a.user.uid);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/gollum.jpg')] bg-cover bg-center ">
      <form className=" md:w-[400px] w-[95%] p-5 backdrop-blur-md bg-slate-400 bg-opacity-30 text-slate-50 rounded-md ">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        <div className="mt-5">
          <label className="block">Name</label>
          <input
            type="text"
            className="ring-1 w-full p-2 rounded-md focus:bg-slate-800 bg-slate-700 text-slate-50 ring-sky-700 mt-2 "
            placeholder="john"
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </div>
        <div className="mt-5">
          <label className="block">Email</label>
          <input
            type="email"
            className="ring-1 w-full p-2 rounded-md focus:bg-slate-800 bg-slate-700 text-slate-50 ring-sky-700 mt-2 "
            placeholder="john@email.com"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <div className="mt-5">
          <label className="block">Password</label>
          <input
            type="password"
            className="ring-1 w-full p-2 rounded-md focus:bg-slate-800 bg-slate-700 text-slate-50 ring-sky-700 mt-2"
            placeholder="*******"
            onChange={(e) => setData({ ...data, password: e.target.value })}
            disabled={!data.email}
          />
        </div>
        <button
          className="mt-5 w-full bg-slate-900 text-slate-100 rounded-md p-2 my-10 hover:opacity-80 active:bg-slate-500"
          onClick={(event) => handleSignUp(user, event)}
          // onClick={()=>console.log(user)}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignUp;
