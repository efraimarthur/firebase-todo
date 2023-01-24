import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

const Dashboard = () => {
  const { user, getDisplayName, logout } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const userName = currentUser.name;
  const [data, setData] = useState({
    title: "new title",
    description: "new desc",
  });
  // const [todoLength, setTodoLength] = useState();
  // const [todoId, setTodoId] = useState(null);
  const [todo, setTodo] = useState("");
  console.log(todo);

  // const readUserData = () => {
  //   const db = getDatabase();
  //   const userRef = ref(db, "users");
  //   onValue(userRef, (snapshot) => {
  //     const rawData = snapshot.val();
  //     const arrData = [];
  //     Object.keys(rawData).map((e) => {
  //       arrData.push({ uid: e, ...rawData[e] });
  //     });
  //     // console.log(arrData[0].uid);
  //     setUsers(arrData);
  //   });
  // };

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
    // console.log(data.title);
    // console.log(data.description);
    // setTodoId(todoId + 1);
    // console.log(todoId);
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todo/${id}`);
      getTodo();
    } catch (error) {
      console.log(error);
    }
  };

  const onDoneTodo = async (item) => {
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
    getCurrentUserData();
    if (userName) {
      getDisplayName(userName);
    }

    // if (todoLength) {
    //   setTodoId(todoLength);
    //   console.log(todoLength);
    // }

    getTodo();
  }, [userName]);

  return (
    <>
      <div className="min-h-screen bg-slate-800">
        <div className="flex min-h-screen">
          <div className=" bg-slate-900 flex flex-col fixed w-[25%] h-screen left-0">
            <div className="flex flex-col gap-5 h-[70%] pt-10">
              <div className="text-sky-400 font-mono text-2xl font-bold mx-auto cursor-default w-[90%] flex items-center justify-center px-5 py-2 flex-col ">
                <Icon icon="gg:profile" className="text-5xl mr-2" />
                <p className="capitalize">{userName}</p>
              </div>
              <Link
                href={"/"}
                className="text-slate-50 text-xl bg-slate-500 cursor-pointer mx-auto h-16 w-[90%] flex items-center justify-center px-5 py-2 rounded-md hover:bg-slate-400"
              >
                <Icon icon="ic:baseline-home" className="mr-1 text-2xl" />
                <span>Home</span>
              </Link>
              <Link
                href={"/done"}
                className="text-slate-50 text-xl bg-slate-700 cursor-pointer mx-auto h-16 w-[90%] flex items-center justify-center px-5 py-2 rounded-md hover:bg-slate-500"
              >
                <Icon
                  icon="ic:baseline-library-add-check"
                  className="mr-1 text-2xl"
                />
                Done
              </Link>
              <Link
                href={"/add"}
                className="text-slate-50 text-xl bg-slate-700 cursor-pointer mx-auto h-16 w-[90%] flex items-center justify-center px-5 py-2 rounded-md hover:bg-slate-500"
              >
                <Icon
                  icon="ic:baseline-add-to-photos"
                  className="mr-1 text-2xl"
                />
                <span>Add new</span>
              </Link>
            </div>
            <div className="flex flex-col gap-5 h-[20%] justify-end pb-10">
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-slate-50 text-xl bg-slate-700 mx-auto cursor-pointer h-16 w-[90%] flex items-center justify-center px-5 py-2 rounded-md hover:bg-slate-500"
              >
                <Icon
                  icon="material-symbols:logout"
                  className="mr-1 text-2xl"
                />
                <span>Logout</span>
              </button>
              <button onClick={addTodo}>add todo</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 p-10 w-[75%] absolute right-0 bg-slate-800">
            {todo
              ? todo.map((item, index) => (
                  <div
                    className="bg-slate-700 text-slate-50 p-3 shadow-lg flex flex-col rounded-md aspect-square hover:scale-105 duration-300 my-5 relative w-[30%] mx-auto"
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
                        // onClick={() => deleteTodo(item.id)}
                      >
                        <Icon
                          icon="material-symbols:delete-sharp"
                          className="mr-1 text-2xl"
                        />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              : console.log("not found")}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
