import Navbar from "../../component/Navbar/navbar";
import TaskList from "../../component/TaskList/taskList";
import CreateTask from "../../component/CreateTask/createTask";
const Tasks= () => {
  return (
    <div>
        <Navbar />
        <CreateTask projectId={null} onTaskCreated={() => {}} />
        <TaskList project={null} />
    </div>
  );
}
export default Tasks;