import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const ChatMessages = () => {
  const [socketUrl, setSocketUrl] = useState('ws://localhost:5184');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage]);
    }
  }, [lastMessage, setMessageHistory]);

  const handleNicknameChange = useCallback(
    (event: { target: { value: React.SetStateAction<string>; }; }) => setNickname(event.target.value),
    []
  );

  const handleMessageChange = useCallback(
    (event: { target: { value: React.SetStateAction<string>; }; }) => setMessage(event.target.value),
    []
  );

  const handleSubmit = useCallback(
    (event: { preventDefault: () => void; }) => {
      event.preventDefault();
      if (nickname && message) {
        const formattedMessage = JSON.stringify({
          nickname,
          message,
        });
        sendMessage(formattedMessage);
        setMessage('');
      }
    },
    [nickname, message, sendMessage]);

    return (
        <div>
        <h1>Chat</h1>
        <div>
        {readyState === ReadyState.CONNECTING && <p>Connecting...</p>}
        {readyState === ReadyState.OPEN && <p>Connected</p>}
        {readyState === ReadyState.CLOSING && <p>Connection Closing...</p>}
        {readyState === ReadyState.CLOSED && <p>Connection Closed</p>}
        </div>
        <form onSubmit={handleSubmit}>
        <label>
        Nickname:
        <input type="text" value={nickname} onChange={handleNicknameChange} />
        </label>
        <br />
        <label>
        Message:
        <input type="text" value={message} onChange={handleMessageChange} />
        </label>
        <br />
        <button type="submit">Send</button>
        </form>
        <h2>Messages</h2>
        <div>
        {messageHistory.map((message, index) => (
        <p key={index}>
            {JSON.parse(message.data).nickname}: {JSON.parse(message.data).message}
        </p>
        ))}
        </div>
        </div>
        );
        };