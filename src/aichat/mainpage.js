import React, { useState } from 'react';
import './css/main-page.css';

function AichatPage({ user }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');
            setTimeout(() => {
                setMessages(prevMessages => [...prevMessages, { text: 'сорян', sender: 'ai' }]);
            }, 1000);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2 id='inter-font'>TalimGPT</h2>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>
                <i class="fa-solid fa-play"/>
                </button>
            </div>
        </div>
    );
}

export default AichatPage;