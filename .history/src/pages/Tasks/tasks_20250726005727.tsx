const Tasks= () => {

      useEffect(() => {
        fetchTasks();
      }, []);
}
export default Tasks;