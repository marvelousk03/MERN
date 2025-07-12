import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { useAuth } from "../context/AuthContext";

const LOGIN = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation] = useMutation(LOGIN);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await loginMutation({ variables: { username, password } });
    login(data.login.token);
    navigate("/todos");
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}