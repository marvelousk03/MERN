import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";

const SIGNUP_MUTATION = gql`
  mutation Signup($u: String!, $e: String!, $p: String!) {
    signup(username: $u, email: $e, password: $p)
  }
`;

export default function Signup() {
  const navigate = useNavigate();
  const [state, setState] = useState({ username: "", email: "", password: "" });
  const [signup] = useMutation(SIGNUP_MUTATION, {
    onCompleted: () => navigate("/"),
    onError: (e) => alert(e.message),
  });

  const submit = (e) => {
    e.preventDefault();
    signup({ variables: { u: state.username, e: state.email, p: state.password } });
  };

  return (
    <div className="page">
      <form className="form-container" onSubmit={submit}>
        <h2>Sign Up</h2>
        <label>Username</label>
        <input name="username" value={state.username} onChange={e => setState({...state, username: e.target.value})} required />
        <label>Email</label>
        <input name="email" type="email" value={state.email} onChange={e => setState({...state, email: e.target.value})} required />
        <label>Password</label>
        <input name="password" type="password" value={state.password} onChange={e => setState({...state, password: e.target.value})} required />
        <button type="submit">Register</button>
        <div className="link">Already have an account? <Link to="/login">Login</Link></div>
      </form>
    </div>
  );
}
