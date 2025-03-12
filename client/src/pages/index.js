import React, {useState} from 'react'

function index() {
  const [message, setMessage] = useState('Loading message...');

  // API Fetch
  fetch('http://localhost:8080/api/home')
        .then(res => res.json())
        .then(data => setMessage(data.message));

  return (
      <h1>{message}</h1>
  )
}

export default index;