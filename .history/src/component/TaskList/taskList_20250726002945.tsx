import React, { useEffect, useState } from "react";

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    projectId: number;
}

interface TaskListProps {
    projectId: number; // Hangi proje altında görev listelenecek
    tasks: Task[];
}