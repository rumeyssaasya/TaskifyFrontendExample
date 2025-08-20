import React, { useState,useEffect } from "react";
import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList";
import CreateTask from "../../component/CreateTask/createTask";
const Tasks= () => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
      
  return (
    <div>
        <Navbar />
        <CreateTask projectId={null} onTaskCreated={() => {}} />
        <TaskList project={null} />
    </div>
  );
}
export default Tasks;