import React, { useContext, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';

import 'materialize-css';

export const AuthPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { loading, error, request } = useHttp();
  const auth = useContext(AuthContext);

  const changeHandler = e => {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value })
  }

  const registerHelper = async () => {
    try {
      await request('/api/auth/register', 'POST', { ...form });
    } catch(err) {
      console.log(err);
    }
  }
  
  const loginHelper = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      auth.login(data.token, data.userId);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="row">
    <div className="col s12 m6">
      <div className="card">
        <div className="card-content white-text">
          <span className="card-title">Auth</span>
          <div>
            <form action="">
              <label htmlFor="email">Enter email</label>
              <input type="text" id="email" name="email" onChange={changeHandler} value={form.email} />
              <label htmlFor="password">Enter password</label>
              <input type="password" id="password" name="password" onChange={changeHandler} value={form.password} />
              <p style={{color: "red"}}>{error}</p>
            </form>
          </div>
        </div>
        <div className="card-action">
          <button onClick={loginHelper} disabled={loading}>Login</button>
          <button onClick={registerHelper} disabled={loading}>Register</button>
        </div>
      </div>
    </div>
  </div>
  );
}

