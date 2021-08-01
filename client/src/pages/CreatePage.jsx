import React, { useContext, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';

import 'materialize-css';

export const CreatePage = () => {
  const auth = useContext(AuthContext);
  const [link, setLink] = useState('');
  const { request } = useHttp();
  const history = useHistory();

  const pressHandler = async e => {
    if (e.key === 'Enter') {
      try {
        const data = await request('/api/link/generate', 'post', { from: link }, { Authorization: `Bearer ${auth.token}` });
        history.push(`/details/${data.link._id}`);
      } catch(err) {
        console.log(err);
      }
    }
  }
  return (
    <div className="container">
     <input
      id="link"
      name="link"
      value={link}
      onChange={e => setLink(e.target.value)}
      onKeyPress={pressHandler} placeholder="enter link" />
      <label htmlFor="link">Generate Link</label>
    </div>
  );
}

