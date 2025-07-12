import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const GET_TODOS = gql`
  query {
    getTodos {
      id
      task
      completed
    }
  }
`;

const ADD_TODO = gql`
  mutation($task: String!) {
    addTodo(task: $task) {
      id
      task
      completed
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation($id: ID!) {
    toggleTodo(id: $id) {
      id
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export default function TodoList() {
  const { data, loading, refetch } = useQuery(GET_TODOS);
  const [addTodo] = useMutation(ADD_TODO);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [task, setTask] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;

  const handleAdd = async () => {
    if (!task.trim()) return;
    await addTodo({ variables: { task } });
    setTask("");
    refetch();
  };

  return (
    <div className="todo-container">
      <button onClick={() => { logout(); navigate("/login"); }}>Logout</button>
      <h2>To-Do List</h2>
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {data.getTodos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.completed ? "line-through" : "none" }}
              onClick={async () => {
                await toggleTodo({ variables: { id: todo.id } });
                refetch();
              }}
            >
              {todo.task}
            </span>
            <button onClick={async () => {
              await deleteTodo({ variables: { id: todo.id } });
              refetch();
            }}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
