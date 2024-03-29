import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, login } = useAuth();
  const [data, setData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();

    // console.log("user: " + user);
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Login - TodoDo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center items-center min-h-screen bg-[url('/glum.jpg')] bg-cover bg-center">
        <form className=" md:w-[400px] w-[95%] p-5 backdrop-blur-md bg-slate-400 bg-opacity-30 text-slate-50 rounded-md ">
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
          <p className="mt-2 font-thin text-slate-200">
            {"Don't have account yet?"}
            <Link
              href={"/signup"}
              className="ml-2 font-bold text-blue-400 underline hover:text-blue-600"
            >
              Create Account
            </Link>
          </p>
          <button
            className="mt-5 w-full bg-slate-900 text-slate-100 rounded-md p-2 my-10 hover:opacity-80 active:bg-slate-500"
            onClick={(event) => handleLogin(event)}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
