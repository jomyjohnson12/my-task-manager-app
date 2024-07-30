import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route path="/" element={<TaskList />} />
                <Route path="/add-task" element={<TaskForm />} />
                <Route path="/edit-task/:id" element={<TaskForm />} />
                <Route path="/task/:id" element={<TaskDetail />} />
            </Routes>
        </div>
    );
};

export default App;
