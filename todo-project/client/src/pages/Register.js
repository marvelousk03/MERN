import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { useAuth } from "../context/AuthContext";

const REGISTER = gql`
  mutation($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      token
    }
  }
`;

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useMutation(REGISTER);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await register({ variables: { username, password } });
    login(data.register.token);
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
