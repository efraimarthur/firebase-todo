import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

const Dashboard = () => {
  const { user, getDisplayName, logout } = useAuth();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState("");
  const userName = currentUser.name;
  const [data, setData] = useState({
    title: "",
    description: "",
  });
  // const [todoLength, setTodoLength] = useState();
  // const [todoId, setTodoId] = useState(null);
  const [todo, setTodo] = useState("");
  const [modal, setModal] = useState(false);
  const [nav, setNav] = useState(false);

  // console.log(todo);

  const getCurrentUserData = () => {
    const db = getDatabase();
    const userRef = ref(db, "users/" + user.uid);
    onValue(userRef, (snapshot) => {
      const rawData = snapshot.val();
      setCurrentUser(rawData);
    });
  };

  const getTodo = async () => {
    const db = getDatabase();
    const todoRef = ref(db, "todo/" + user.uid + "/running");
    onValue(todoRef, (snapshot) => {
      const rawData = snapshot.val();
      const arrData = [];
      {
        rawData
          ? Object.keys(rawData).map((e) => {
              arrData.push({ id: e, ...rawData[e] });
            })
          : null;
      }
      setTodo(arrData);
      // setTodoLength(!rawData?.length ? 1 : rawData.length);
    });
  };

  const addTodo = () => {
    const randomString = Math.random().toString(36).substring(2, 12);
    const db = getDatabase();
    set(ref(db, "todo/" + user.uid + "/running" + "/" + randomString), {
      title: data.title,
      description: data.description,
    });
    setModal(!modal);
    // console.log(data.title);
    // console.log(data.description);
    // setTodoId(todoId + 1);
    // console.log(todoId);
  };

  const deleteTodo = async (item) => {
    try {
      const itemId = item.id;
      const db = getDatabase();
      remove(ref(db, "todo/" + user.uid + "/running/" + itemId));
    } catch (error) {
      console.log(error);
    }
  };

  const onDoneTodo = async (item) => {
    //change from running ref to done ref in the same uid ref
    try {
      //delete from running ref
      const itemId = item.id;
      const db = getDatabase();
      remove(ref(db, "todo/" + user.uid + "/running/" + itemId));

      //write to done ref
      set(ref(db, "todo/" + user.uid + "/done" + "/" + itemId), {
        title: item.title,
        description: item.description,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // readUserData();
    if (user) {
      getCurrentUserData();
      // console.log(user.displayName);
    }
    if (userName) {
      getDisplayName(userName);
      // console.log(userName);
    }

    // if (todoLength) {
    //   setTodoId(todoLength);
    //   console.log(todoLength);
    // }

    getTodo();
  }, [userName, user]);

  const toggleModal = () => {
    setModal(!modal);
    setNav(!nav);
  };
  const navToggle = () => {
    setNav(!nav);
    console.log(nav);
  };

  const toggleMobileModal = () => {
    setModal(!modal);
  };

  return (
    <>
      {modal && (
        <div className="fixed top-10 left-0 bottom-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-hidden md:inset-0 h-modal md:h-full bg-slate-900 bg-opacity-90">
          <div className="relative w-full max-w-2xl min-h-screen md:h-auto mx-auto mt-[5%]">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Add new Todo
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={toggleModal}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <form className=" w-full p-5 backdrop-blur-md bg-slate-400 bg-opacity-30 text-slate-50 rounded-md ">
                <div className="mt-5">
                  <label className="block ml-3 text-xl font-semibold">
                    Title
                  </label>
                  <input
                    type="text"
                    className="ring-1 w-full p-2 rounded-md focus:bg-slate-800 bg-slate-700 text-slate-50 ring-sky-700 mt-2 "
                    placeholder="11 PM"
                    onChange={(e) =>
                      setData({ ...data, title: e.target.value })
                    }
                  />
                </div>
                <div className="mt-10">
                  <label className="block ml-3 text-xl font-semibold">
                    Description
                  </label>
                  <textarea
                    type="text"
                    className="ring-1 w-full p-2 rounded-md focus:bg-slate-800 bg-slate-700 text-slate-50 ring-sky-700 mt-2 caret-pink-500"
                    placeholder="go to bed"
                    onChange={(e) =>
                      setData({ ...data, description: e.target.value })
                    }
                  />
                </div>
              </form>

              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  onClick={addTodo}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add
                </button>
                <button
                  onClick={toggleModal}
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-slate-800">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className="bg-slate-900 hidden md:flex flex-col fixed w-[25%] h-screen left-0">
            <div className="flex flex-col gap-5 h-[70%] pt-10">
              <div className="text-sky-400 font-mono text-2xl mx-auto cursor-default w-[90%] flex items-center justify-center px-5 py-2 flex-col ">
                <Icon icon="mdi:face-man-profile" className="text-6xl mr-2" />
                <p className="capitalize relative before:absolute before:inset-0 before:border-b-[1.5px] before:border-sky-500 before:-skew-y-[4deg]">
                  {userName}
                </p>
              </div>
              <Link
                href={"/dashboard"}
                className="text-slate-50 text-xl bg-slate-500 cursor-pointer mx-auto h-16 w-[90%] flex items-center justify-center px-5 py-2 rounded-md hover:bg-sky-400"
              >
                <Icon icon="ic:baseline-home" className="mr-1 text-2xl" />
                <span>Home</span>
              </Link>
              <Link
                href={"/done"}
                className="text-slate-50 text-xl bg-slate-700 cursor-pointer mx-auto h-16 w-[90%] flex items-center justify-center px-5 py-2 rounded-md hover:bg-sky-400"
              >
                <Icon
                  icon="ic:baseline-library-add-check"
                  className="mr-1 text-2xl"
                />
                Done
              </Link>
              <button
                // href={"/add"}
                className="text-slate-50 text-xl bg-slate-700 cursor-pointer mx-auto h-16 w-[90%] flex items-center justify-center px-5 py-2 rounded-md hover:bg-sky-400"
                onClick={toggleModal}
              >
                <Icon
                  icon="ic:baseline-add-to-photos"
                  className="mr-1 text-2xl"
                />
                <span>Add new</span>
              </button>
            </div>
            <div className="flex flex-col gap-5 h-[20%] justify-end pb-10">
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-slate-50 text-xl bg-slate-700 mx-auto cursor-pointer h-16 w-[90%] flex items-center justify-center px-5 py-2 rounded-md hover:bg-sky-400"
              >
                <Icon
                  icon="material-symbols:logout"
                  className="mr-1 text-2xl"
                />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* MobileNav */}
          <div className="container flex md:hidden flex-wrap items-center justify-between w-full fixed bg-slate-900 z-50 px-4 py-1">
            <a href="https://flowbite.com/" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap flex items-center capitalize text-sky-400">
                <Icon icon="mdi:face-man-profile" className="mr-2 text-3xl" />
                {userName}
              </span>
            </a>
            <button
              className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={navToggle}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
            {nav && (
              <div className="w-full md:block md:w-auto h-screen z-50">
                <div className="flex flex-col justify-between p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 h-[80vh]">
                  <ul className="flex flex-col">
                    <Link
                      href={"/dashboard"}
                      className="text-slate-50 text-lg bg-slate-500 cursor-pointer mx-auto h-10 flex w-full items-center px-5 py-2  hover:bg-sky-400"
                    >
                      <span>Home</span>
                    </Link>
                    <Link
                      href={"/done"}
                      className="text-slate-50 text-lg bg-slate-700 cursor-pointer mx-auto h-10 flex w-full items-center px-5 py-2  hover:bg-sky-400"
                    >
                      Done
                    </Link>
                    <button
                      // href={"/add"}
                      className="text-slate-50 text-lg bg-slate-700 cursor-pointer mx-auto h-10 flex w-full items-center px-5 py-2 hover:bg-sky-400"
                      onClick={toggleModal}
                    >
                      <span>Add new</span>
                    </button>
                  </ul>

                  <div className="px-3 mb-10 py-2 text-center text-lg rounded-lg bg-slate-600 text-slate-50">
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-5 p-10 w-full md:w-[75%] absolute right-0 bg-slate-800">
            <p className="absolute text-[1.5em] text-slate-100 mt-5">
              {" "}
              Todo List :{" "}
            </p>
            {todo
              ? todo.map((item, index) => (
                  <>
                    <div
                      className="bg-slate-700 text-slate-50 p-3 shadow-lg flex flex-col rounded-md aspect-square hover:scale-105 duration-300 my-5 relative w-[30%] mx-auto hover:bg-slate-600 mt-20"
                      key={item.id}
                    >
                      <div className="text-xl font-bold w-full border-b border-b-slate-500">
                        {item.title}
                      </div>
                      <div className="text-lg">{item.description}</div>
                      {/* <div className="text-rose-500">{`${item.isDone}`}</div> */}
                      <div className="flex absolute gap-1 bottom-3 left-1/2 -translate-x-1/2">
                        <button
                          className="bg-slate-900 py-2 px-3 rounded-xl hover:bg-emerald-400 duration-200 flex items-center justify-center"
                          onClick={() => onDoneTodo(item)}
                        >
                          <Icon
                            icon="mdi:success-circle"
                            className="mr-1 text-2xl"
                          />
                          Done
                        </button>
                        <button
                          className="bg-slate-900 py-2 px-3 rounded-xl hover:bg-rose-400 duration-200 flex items-center justify-center "
                          onClick={() => deleteTodo(item)}
                        >
                          <Icon
                            icon="material-symbols:delete-sharp"
                            className="mr-1 text-2xl"
                          />
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                ))
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
