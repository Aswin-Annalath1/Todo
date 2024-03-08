import React from 'react'
import { useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import InputComponent from './InputComponent'
import {format} from "date-fns";


const Todolistmain = () => {
    const [taskList, setTaskList] = useState([]);
    const {userid}=useParams()
    const navigate = useNavigate()

    const [text, setText] = useState("");
    const [editTaskId, setEditTaskId] = useState(-1);
  
//Called for Api call
    useEffect(() => {
      fetch("https://todo-wu1c.onrender.com/todos/"+userid)
      .then((res) => {return res.json()})
      .then((data) => {(data)
  
        //This is to make a normal id number to store with task name...
        data.map((task) => {
          setTaskList((taskList) => [
            ...taskList,   //It take whatever in the list and also going to add new one...
            {
              id: taskList.slice(-1)[0] ? taskList.slice(-1)[0].id + 1 : 1,  //here we take id = last index of tasklist array object and then take 1st key(id) of that object.
              name: task.title,    //This task is the fetched data that is maped 
              _id: task._id,      
              userID: task.userID,
              status:task.status,
              time:task.createdAt
            },
          ]);
        })
      })
      .catch((err) => {(err)})
    },[])
  
//Here wew are deleting task..
    const deleteTask = (i) => {
      let index = taskList.findIndex((obj) => obj.id === i); //here checking task.id == obj.id
      if (index > -1) {
      //This is removal from BE
        fetch(`https://todo-wu1c.onrender.com/todos/${userid}/${taskList[index]._id}`, {
          method: "DELETE",
          headers: {"Content-Type": "application/json"}})
          .then((res) => {return res.json()})  
          .then((data) => {(data)
      //This is removal from FE
             taskList.splice(index, 1);    
             setTaskList([...taskList]);  
          })
          .catch((err) => {(err)})
          setText("");      
          setEditTaskId(-1); 
      }
    };
//Here we are editing task 
    const editTask = (id) => {
      let index = taskList.findIndex((obj) => obj.id === id);
      if (index > -1) {
        setText(taskList[index].name);
        setEditTaskId(id);
      }
    };
//Here wew are doing logout...
  const handlelogout = async()=>{
    fetch('https://todo-wu1c.onrender.com/users/logout',{
      method:'GET',
      headers:{'Content-Type':'application/json'},
    })
    .then(res=>res.json())
    .then(data=>{(data) 
      navigate("/login")})
    }

//To change the status 
  const editStatus = (i) => {
    let index = taskList.findIndex((obj) => obj.id === i);
    if (index > -1) {
    fetch(`https://todo-wu1c.onrender.com/todos/${userid}/status/${taskList[index]._id}`,{
      //PUT Method help again to edit by admin if required..
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ status: "Completed"})  //Whatever i write currently in FE 
      })
      .then((res) => {return res.json()})
      .then((data) => {(data)
      window.location.reload();
      })
      .catch((err) => {(err)})
  }
}    
return (
  <div>

    <nav className="bg-violet-700 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ListLoom</span>
        </a>
        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <button className="block py-6 px-6 my-2 mx-2 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page" onClick={handlelogout}>Logout</button>
            </li>

          </ul>
        </div>
      </div>
    </nav>

   <div id="app" className="min-w-[400px] w-1/2 mx-auto mt-16">
      <div className="max-w-4xl bg-violet-500 p-4 rounded-lg shadow-lg ">
        <div className=" font-medium text-3xl text-center">
          <p className="py-2 text-white">Todo List</p>
        </div>

        {/* 2 task ---- add the todo and to edit a todo */}
        <InputComponent
          editTaskId={editTaskId}  
          setEditTaskId={setEditTaskId}
          text={text}        
          setText={setText}
          taskList={taskList} 
          setTaskList={setTaskList}
          userid={userid}
        />
        {taskList.map((task, index) => (
          <div
            key={index}
            className="p-1 m-1 border border-violet-500 bg-violet-200 hover:bg-violet-100 rounded-md"
          >
            <div key={task.id} className="p-1">
              <div className="flex justify-between items-center">
              <div>
                <div style={{ fontSize: 'small', color: 'rgba(0, 0, 0, 0.6)', marginBottom: '5px' }}>
                  <time>{format(new Date(task.time), "dd-MM/hh:mm a")}</time>
                </div>
                  {task.name}
                </div>
                <div className="flex ">
                <button onClick={() => editStatus(task.id)} type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2 ">{task.status}</button>
                  <div
                    onClick={() => editTask(task.id)}
                    className="bg-green-100 hover:bg-green-200 px-2 py-1 mx-1 rounded-md cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-green-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </div>
                  <div
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-100 hover:bg-red-200 px-2 py-1 mx-1 rounded-md cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-red-500 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default Todolistmain