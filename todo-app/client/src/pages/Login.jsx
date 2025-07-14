import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($e: String!, $p: String!) {
    login(email: $e, password: $p)
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [state, setState] = useState({ email: "", password: "" });
  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted: () => navigate("/"),
    onError: (e) => alert(e.message),
  });

  const submit = (e) => {
    e.preventDefault();
    login({ variables: { e: state.email, p: state.password } });
  };

  return (
    <div className="page">
      <form className="form-container" onSubmit={submit}>
        <h2>Login</h2>
        <label>Email</label>
        <input name="email" type="email" value={state.email} onChange={e => setState({...state, email: e.target.value})} required />
        <label>Password</label>
        <input name="password" type="password" value={state.password} onChange={e => setState({...state, password: e.target.value})} required />
        <button type="submit">Login</button>
        <div className="link">New? <Link to="/signup">Sign up</Link></div>
      </form>
    </div>
  );
}
