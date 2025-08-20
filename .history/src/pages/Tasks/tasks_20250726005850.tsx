const Tasks= () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
      useEffect(() => {
        fetchTasks();
      }, []);
}
export default Tasks;