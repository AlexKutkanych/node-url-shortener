import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';

export const DetailsPage = () => {
  const [link, setLink] = useState('');
  const { request } = useHttp();
  const { id: linkId } = useParams();
  const { token } = useContext(AuthContext);

  const getLink = useCallback(async () => {
    try {
      const fetchedLink = await request(`/api/link/${linkId}`, 'GET', null, { Authorization: `Bearer ${token}` });
      setLink(fetchedLink);
    } catch(err) {
      console.log(err);
    }
  }, [linkId, request, token]);

  useEffect(() => {
    getLink();
  }, [getLink]);
  return (
    <div className="container">
     <h1>DetailsPage</h1>
     <p>
       Original link: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a>
     </p>
     <p>
       Generated link: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a>
     </p>
     <p>
       Number of clicks: <strong>{link.clicks}</strong>
     </p>
    </div>
  );
}

