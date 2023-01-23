import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

const Navbar = () => {
  const { user, logout } = useAuth();
  console.log(user);

  const router = useRouter();

  return (
    <div className="flex justify-between px-5 h-10 items-center bg-slate-700 text-slate-100">
      <div className="text-2xl">Logo</div>
      <div></div>

      <div className="flex gap-5">
        {user ? (
          <>
            <div className="px-2 py-1">Login as : {user.displayName}</div>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="px-2 py-1"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href={"/signup"} className=" px-2 py-1">
              SignUp
            </Link>
            <Link href={"/login"} className=" px-2 py-1">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
