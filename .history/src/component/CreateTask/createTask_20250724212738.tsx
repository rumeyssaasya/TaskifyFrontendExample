import { useEffect, useState } from "react";
import api from "../../api/axios";

interface Task {
    id: number;
    project: number; // Proje ID'si
    title: string;
    description: string;
    completed: boolean;
}

const CreateTask = () => {
    
}
export default CreateTask;