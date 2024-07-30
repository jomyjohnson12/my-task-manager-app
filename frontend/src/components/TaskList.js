import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTable } from 'react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // import the default styles
import './Tasklist.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('');
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/tasks?priority=${filter}`)
            .then((response) => {
                setTasks(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the tasks!", error);
            });
    }, [filter]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            axios.delete(`http://localhost:5000/api/tasks/${id}`)
                .then(() => {
                    setTasks(tasks.filter(task => task.id !== id));
                    toast.success('Task deleted successfully.');
                })
                .catch((error) => {
                    console.error("There was an error deleting the task!", error);
                });
        }
    };

    // Filter tasks based on search text
    const filteredTasks = tasks.filter(task =>
        task.heading.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = React.useMemo(
        () => [
            {
                Header: 'Heading',
                accessor: 'heading',
            },
            {
                Header: 'Description',
                accessor: 'description',
            },
            {
                Header: 'Date',
                accessor: 'date',
            },
            {
                Header: 'Time',
                accessor: 'time',
            },
            {
                Header: 'Image',
                accessor: 'image',
                Cell: ({ cell: { value } }) => (
                    value ? <img src={value} alt="Task" className="task-image" /> : <span>No image</span>
                )
            },
            {
                Header: 'Actions',
                Cell: ({ row: { original } }) => (
                    <div className="action-buttons">
                        <button className="view-button" onClick={() => navigate(`/task/${original.id}`)}>View</button>
                        <button className="delete-button" onClick={() => handleDelete(original.id)}>Delete</button>
                    </div>
                )
            }
        ],
        [tasks, navigate]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: filteredTasks });

    return (
        <div>
            <h1>Task List</h1>
            <div className="filter-container">
                <div className="filter-options">
                    <label>
                        <input
                            type="radio"
                            name="priority"
                            value=""
                            checked={filter === ''}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        All
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="priority"
                            value="low"
                            checked={filter === 'low'}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        Low
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="priority"
                            value="medium"
                            checked={filter === 'medium'}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        Medium
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="priority"
                            value="high"
                            checked={filter === 'high'}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        High
                    </label>
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by heading..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>
            <table {...getTableProps()} className="task-table">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th key={column.id} {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length}>No tasks found.</td>
                        </tr>
                    ) : (
                        rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr key={row.id} {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td key={cell.column.id} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
};

export default TaskList;
