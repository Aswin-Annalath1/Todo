//All passed as props from parent component..
const InputComponent = ({editTaskId,setEditTaskId,taskList,setTaskList,text,setText,userid}) => {
  const handleTextchange = (event) => {
    setText(event.target.value);
  };

  const changeTaskWithEnterKey = (event) => {
    if (event.key === "Enter" && !!event.target.value) {
      setTaskList((taskList) => [
        ...taskList,
        {
          id: taskList.slice(-1)[0] ? taskList.slice(-1)[0].id + 1 : 1,
          name: event.target.value,
        },
      ]);
      setText("");
    }
  };
//Add todo case..
  const changeTask = () => {
    if (taskList.length > 4 && editTaskId < 1){ alert('Maximum 5 Todos Only')}else{
    if (!!text && editTaskId < 1) {
      //This is Adding to BE
      fetch("https://todo-wu1c.onrender.com/todos/"+userid,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ title: text}) 
      })
      .then((res) => {return res.json()})
      .then((data) => {(data)
      //This is Adding to FE
      setTaskList((taskList) => [
        ...taskList,  
        {
          id: taskList.slice(-1)[0] ? taskList.slice(-1)[0].id + 1 : 1, 
          name: text,
          _id: data._id,
          userID: data.userID,
          status:data.status,
          time:data.createdAt
        },
      ])
      setText("")
      // window.location.reload();
      })
      .catch((err) => {(err)})
      return;
    }}

//Edit a current todo case...
    let index = taskList.findIndex((obj) => obj.id === editTaskId);  //editTaskId we got from app.jsx
    if (index > -1) {
//This is Edited add to BE
    fetch("https://todo-wu1c.onrender.com/todos/"+userid+"/"+taskList[index]._id,{
    //PUT help again edit by admin if required..
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ title: text}) 
      })
      .then((res) => {return res.json()})
      .then((data) => {(data)})
      .catch((err) => {(err)})

//This is Edited add to FE taskList
      taskList[index].name = text;  //here name is set to current text.
      setTaskList([...taskList]); //setting tasklist with edited task..
      setEditTaskId(-1);
      setText("");
    }

  };

  return (
    <div className="py-3 flex w-full">
      <div className="grow">
        <input
          type="text"
          id="text"
          value={text}
          onChange={handleTextchange}
          onKeyDown={changeTaskWithEnterKey}
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:outline-none  focus:ring-1 focus:ring-blue-500 focus:border-blue-500 p-2.5"
          placeholder="Task giriniz..."
        />
      </div>
      <div>
        <button
          onClick={changeTask}
          className={`${
            setEditTaskId ? "w-24" : "w-14"
          } flex-none px-2.5 py-2 ml-2 hover:bg-red-300 bg-red-400 rounded-md text-gray-100`}
        >
          {editTaskId > -1 ? "Edit" : "Add"}
        </button>
      </div>
    </div>
  );
};


export default InputComponent;
