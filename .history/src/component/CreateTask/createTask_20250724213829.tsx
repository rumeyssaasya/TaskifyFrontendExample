import React,{ useEffect, useState } from "react";
import api from "../../api/axios";

const CreateTask = () => {
    const [projectName, setProjectName] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(""); 
    const [completed, setCompleted] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await api.post("/tasks", {
                projectName,
                title,
                description,
                completed,
            });
            console.log("Görev başarıyla oluşturuldu");
        } catch (error) {
            console.error("Görev oluşturulamadı Hata:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <input
                type="text"
                placeholder="Completed"
                value={completed}
                onChange={e => setCompleted(e.target.value)}
            />
            <button type="submit">Create Task</button>
        </form>
    );
};

export default CreateTask;