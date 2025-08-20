import { useEffect, useState } from "react";
import api from "../../api/axios";

const CreateTask = () => {
    const [projectID, setProjectID] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(""); 
    const [completed, setCompleted] = useState("");
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        await api.post("/tasks", {
            projectID,
            title,
            description,
            completed,
        });
        console.log("Görev başarıyla oluşturuldu");
    } catch (error) {
        console.error("Görev oluşturulamadı Hata:", error);
    }
}
export default CreateTask;