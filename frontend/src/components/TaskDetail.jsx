import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TaskDetail.css';

const TaskDetail = () => {
    const [task, setTask] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/tasks/${id}`)
            .then((response) => {
                setTask(response.data);
                setImagePreview(response.data.image); // Set initial image preview
            })
            .catch(error => {
                console.error("There was an error fetching the task!", error);
            });
    }, [id]);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            axios.delete(`http://localhost:5000/api/tasks/${id}`)
                .then(() => {
                    navigate('/');
                })
                .catch(error => {
                    console.error("There was an error deleting the task!", error);
                });
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prevTask => ({
            ...prevTask,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setTask(prevTask => ({
            ...prevTask,
            imageFile: file
        }));
        setImagePreview(URL.createObjectURL(file)); // Update image preview
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('heading', task.heading);
        formData.append('description', task.description);
        formData.append('date', task.date);
        formData.append('time', task.time);
        formData.append('priority', task.priority);
        if (task.imageFile) {
            formData.append('image', task.imageFile);
        }

        axios.put(`http://localhost:5000/api/tasks/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                setIsEditing(false);
                // Redirect to the home page after saving
                navigate('/');
            })
            .catch(error => {
                console.error("There was an error updating the task!", error);
            });
    };

    return (
        <div className="task-detail">
            <div className="task-image">
                {imagePreview ? (
                    <img src={imagePreview} alt={task.heading} />
                ) : (
                    <p>No image available</p>
                )}
            </div>
            <div className="task-info">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="heading"
                            value={task.heading}
                            onChange={handleChange}
                        />
                        <textarea
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                        />
                        <input
                            type="date"
                            name="date"
                            value={task.date}
                            onChange={handleChange}
                        />
                        <input
                            type="time"
                            name="time"
                            value={task.time}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="priority"
                            value={task.priority}
                            onChange={handleChange}
                        />
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                        />
                        <button onClick={handleSave} className="btn btn-save">Save</button>
                    </>
                ) : (
                    <>
                        <p><strong>{task.heading}</strong></p>
                        <p>{task.description}</p>
                        <p><strong>Date:</strong> {task.date}</p>
                        <p><strong>Time:</strong> {task.time}</p>
                        <p><strong>Priority:</strong> {task.priority}</p>
                        <button onClick={handleEdit} className="btn btn-edit">Edit</button>
                    </>
                )}
                <button onClick={handleDelete} className="btn btn-delete">Delete</button>
            </div>
        </div>
    );
};

export default TaskDetail;
