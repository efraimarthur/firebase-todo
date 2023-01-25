import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

const Done = () => {
  const { user, getDisplayName, logout } = useAuth();
  const router = useRouter();
  //   const [currentUser, setCurrentUser] = useState("");
  //   const userName = currentUser.name;
  const [data, setData] = useState({
    title: "",
    description: "",
  });
  // const [todoLength, setTodoLength] = useState();
  // const [todoId, setTodoId] = useState(null);
  const [todo, setTodo] = useState("");
  const [modal, setModal] = useState(false);

  const getTodo = async () => {
    const db = getDatabase();
    const todoRef = ref(db, "todo/" + user.uid + "/done");
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
    //change from done ref to running ref in the same uid ref
    try {
      //write to done ref
      const itemId = item.id;
      const db = getDatabase();
      remove(ref(db, "todo/" + user.uid + "/done/" + itemId));

      //delete from running ref
      set(ref(db, "todo/" + user.uid + "/running" + "/" + itemId), {
        title: item.title,
        description: item.description,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodo();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-800">
        <div className="flex min-h-screen">
          {modal && (
            <div className="fixed top-0 left-0 bottom-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-hidden md:inset-0 h-modal md:h-full bg-slate-900 bg-opacity-90">
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

          <div className=" bg-slate-900 flex flex-col fixed w-[25%] h-screen left-0">
            <div className="flex flex-col gap-5 h-[70%] pt-10">
              <div className="text-sky-400 font-mono text-2xl mx-auto cursor-default w-[90%] flex items-center justify-center px-5 py-2 flex-col ">
                <Icon icon="mdi:face-man-profile" className="text-6xl mr-2" />
                <p className="capitalize relative before:absolute before:inset-0 before:border-b-[1.5px] before:border-sky-500 before:-skew-y-[4deg]">
                  {user.displayName}
                </p>
              </div>
              <Link
                href={"/dashboard"}
                className="text-slate-50 text-xl bg-slate-700 cursor-pointer mx-auto h-16 w-[90%] flex items-center justify-center px-5 py-2 rounded-md hover:bg-sky-400"
              >
                <Icon icon="ic:baseline-home" className="mr-1 text-2xl" />
                <span>Home</span>
              </Link>
              <Link
                href={"/done"}
                className="text-slate-50 text-xl bg-slate-500 cursor-pointer mx-auto h-16 w-[90%] flex items-center justify-center px-5 py-2 rounded-md hover:bg-sky-400"
              >
                <Icon
                  icon="ic:baseline-library-add-check"
                  className="mr-1 text-2xl"
                />
                Done
              </Link>
              <button
                // href={"/add"}
                className="text-slate-50 text-xl bg-slate-700 cursor-pointer mx-auto h-16 w-[90%] flex items-center justify-center px-5 py-2 rounded-md hover:bg-sky-500"
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

          <div className="flex flex-wrap gap-5 p-10 w-[75%] absolute right-0 bg-slate-800">
            {todo
              ? todo.map((item, index) => (
                  <div
                    className="bg-slate-700 text-slate-50 p-3 shadow-lg flex flex-col rounded-md aspect-square hover:scale-105 duration-300 my-5 relative w-[30%] mx-auto hover:bg-slate-600"
                    key={item.id}
                  >
                    <div className="text-xl font-bold w-full border-b border-b-slate-500">
                      {item.title}
                    </div>
                    <div className="text-lg">{item.description}</div>
                    {/* <div className="text-rose-500">{`${item.isDone}`}</div> */}
                    <div className="flex absolute gap-1 bottom-3 left-1/2 -translate-x-1/2">
                      <button
                        className="bg-slate-900 py-2 px-3 rounded-xl hover:bg-yellow-400 duration-200 flex items-center justify-center"
                        onClick={() => onDoneTodo(item)}
                      >
                        <Icon
                          icon="ion:arrow-undo-circle-sharp"
                          className="mr-1 text-2xl"
                        />
                        Undone
                      </button>
                      <button
                        className="bg-slate-900 py-2 px-3 rounded-xl hover:bg-rose-400 duration-200 flex items-center justify-center "
                        onClick={() => deleteTodo(item)}
                      >
                        <Icon
                          icon="material-symbols:delete-sharp"
                          className="mr-1 text-2xl "
                        />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Done;