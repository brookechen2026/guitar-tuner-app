'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function Home() {
  const [message, setMessage] = useState<string>('');   // State for input message
  const [response, setResponse] = useState<string>(''); // State for server response
  const socketRef = useRef<Socket | null>(null);        // UseRef to store the socket instance

  useEffect(() => {
    // Initialize the socket connection
    socketRef.current = io('http://localhost:5001', {  
        transports : ['websocket'] })
    
    // Listen for messages from the server
    socketRef.current.on('message', (msg: string) => {
      console.log('Received message from server: ', msg);
      setResponse(msg);
    });

    return () => {
      // Cleanup the socket connection when component unmounts
      socketRef.current?.disconnect(); 
    };
  }, []);

  // Function to handle sending a message to the server
  const sendMessage = () => {
    if (message.trim() !== '' && socketRef.current) {
      socketRef.current.emit('message', message); // Use the socketRef to emit the message
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Next.js & Flask WebSocket with TypeScript</h1>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send Message</button>

      <div>
        <h2>Response from server:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}
