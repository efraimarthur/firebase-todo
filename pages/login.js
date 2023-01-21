import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, login } = useAuth();
  const [data, setData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();

    console.log("user: " + user);
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/glum.jpg')] bg-cover bg-center">
      <form className=" w-[400px] p-5 backdrop-blur-md bg-slate-400 bg-opacity-30 text-slate-50 rounded-md ">
        <h1 className="text-2xl font-bold text-center">Login</h1>
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
          onClick={(event) => handleLogin(event)}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
