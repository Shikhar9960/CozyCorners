import { useState } from "react";

const Chatbox = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    //http://localhost:3000/api/chat

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.reply);
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      setResponse("❌ API Error, try again!");
    }
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        onClick={toggleChatbox}
        className="fixed bottom-5 right-5 bg-darkpink  text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition z-50"
      >
        💬
      </button>

      {/* Chatbox Popup */}
      {isOpen && (
        <div className="fixed bottom-20 z-50 right-5 w-72 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col border border-gray-300">
          {/* Chat Header */}
          <div className="bg-darkpink  text-white p-3 flex justify-between items-center">
            <span className="font-semibold">💬 AI Chatbox</span>
            <button
              onClick={toggleChatbox}
              className="text-white hover:text-gray-200 transition"
            >
              ❌
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-3 h-48 overflow-y-auto bg-pink">
            {response && <p className="text-gray-800">🤖 {response}</p>}
          </div>

          {/* Chat Footer */}
          <div className="p-1  flex items-center border-t border-gray-300 bg-white">
            <textarea
              rows="2"
              className="flex-1 p-2 border  rounded-md focus:outline-none focus:ring-0"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-darkpink text-white rounded-md hover:bg-gray-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbox;
