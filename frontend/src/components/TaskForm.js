import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskForm.css';
import { useNavigate, useParams } from 'react-router-dom';

const TaskForm = () => {
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState('low');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { taskId } = useParams();

    useEffect(() => {
        if (taskId) {
            axios.get(`http://localhost:5000/api/tasks/${taskId}`)
                .then((response) => {
                    const task = response.data;
                    setHeading(task.heading);
                    setDescription(task.description);
                    setDate(task.date);
                    setTime(task.time);
                    setPriority(task.priority);
                    if (task.image) {
                        setImagePreview(task.image);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('There was an error fetching the task!', error);
                    setError('Failed to load task. Please try again.');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [taskId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!heading || !description || !date || !time || !priority) {
            setError('All fields are required');
            return;
        }

        setError('');

        const formData = new FormData();
        formData.append('heading', heading);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('time', time);
        formData.append('priority', priority);
        if (image) {
            formData.append('image', image);
        }

        const url = taskId ? `http://localhost:5000/api/tasks/${taskId}` : 'http://localhost:5000/api/tasks';
        const method = taskId ? 'put' : 'post';

        axios({
            method,
            url,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                setSuccessMessage(`Task successfully ${taskId ? 'updated' : 'created'}!`);
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/'); // Redirect to home page after successful creation or update
                }, 2000);
            })
            .catch((error) => {
                console.error(`There was an error ${taskId ? 'updating' : 'creating'} the task!`, error);
                setError(`Failed to ${taskId ? 'update' : 'create'} task. Please try again.`);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-grid">
                <div className="image-section">
                    <label>
                        Image:
                        <input type="file" onChange={handleImageChange} />
                        {imagePreview && <img src={imagePreview} alt="Image preview" className="image-preview" />}
                    </label>
                </div>
                <div className="details-section">
                    <label>
                        Heading:
                        <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} required />
                    </label>
                    <label>
                        Description:
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </label>
                    <div className="datetime-container">
                        <label>
                            Date:
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </label>
                        <label>
                            Time:
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                        </label>
                    </div>
                    <fieldset className="priority-section">
                        <legend>Priority:</legend>
                        <label className="priority-option">
                            <input type="radio" value="low" checked={priority === 'low'} onChange={(e) => setPriority(e.target.value)} required />
                            Low
                        </label>
                        <label className="priority-option">
                            <input type="radio" value="medium" checked={priority === 'medium'} onChange={(e) => setPriority(e.target.value)} required />
                            Medium
                        </label>
                        <label className="priority-option">
                            <input type="radio" value="high" checked={priority === 'high'} onChange={(e) => setPriority(e.target.value)} required />
                            High
                        </label>
                    </fieldset>
                    <button type="submit" className="save-button">Save Task</button>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </div>
            </div>
        </form>
    );
};

export default TaskForm;
