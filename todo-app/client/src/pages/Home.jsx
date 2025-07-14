import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const GET_TODOS = gql`
  query { getTodos { id title completed } }
`;
const ADD_TODO = gql`
  mutation($title: String!) { addTodo(title: $title) { id title completed } }
`;
const TOGGLE_TODO = gql`
  mutation($id: ID!) { toggleTodo(id: $id) { id completed } }
`;
const DELETE_TODO = gql`
  mutation($id: ID!) { deleteTodo(id: $id) }
`;

export default function Home() {
    const navigate = useNavigate();
    const { loading, data, refetch } = useQuery(GET_TODOS, {
        fetchPolicy: 'network-only',
        onError: () => navigate('/login')
    });
    const [addTodo] = useMutation(ADD_TODO, { onCompleted: () => refetch() });
    const [toggleTodo] = useMutation(TOGGLE_TODO, { onCompleted: () => refetch() });
    const [deleteTodo] = useMutation(DELETE_TODO, { onCompleted: () => refetch() });

    const [text, setText] = useState("");

    if (loading) return <p className="page">Loading...</p>;

    const logout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate('/login');
    };

    return (
        <div className="page">
            <div className="todo-container">
                <h2>My To-Do List</h2>
                <div className="add-todo">
                    <input value={text} onChange={e => setText(e.target.value)} placeholder="New task..." />
                    <button onClick={() => { addTodo({ variables: { title: text } }); setText(""); }}>Add</button>
                </div>
                <div className="todo-list">
                    {(data?.getTodos || []).map(t => (
                        <div key={t.id} className={`todo-item ${t.completed ? 'completed' : ''}`}>
                            <span onClick={() => toggleTodo({ variables: { id: t.id } })}>{t.title}</span>
                            <button onClick={() => deleteTodo({ variables: { id: t.id } })}>Delete</button>
                        </div>
                    ))}
                </div>
                <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
        </div>
    );
}
