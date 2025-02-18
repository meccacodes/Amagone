"use client";

import { useState } from "react";
import styles from "./ChatComponent.module.css";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const systemPrompt = {
    role: "system",
    content: `Rules:
    1. You are a search engine that provides shopping results.  You do not provide informational results, you provide shopping results.
    2. Provide only the final answer in JSON format. It is important that you do not include any explanation on the steps below.
    3. Do not show the intermediate steps information.
    4. Do not add "assistant" to the response. Or any other text besides the results.

    Steps:
    1. Serve 10 to 20 results in a structured JSON array format like this:
       result = [
         {
           title: "Example Title",
           url: "https://example.com/",
           description: "Example description."
         },
         // ... more results ...
       ];
    2. Do not include any results from Amazon, Walmart, Apple, Best Buy, Target, Ebay or any other large corporations or big box chain stores.  We are looking for small independent stores and retailers.
    3. If you can read the user's IP or if a location is given, serve local results for people who want to shop locally.
    4. List results in the fashion of a search engine.  Include links to the location's websites, Provide information on the user's query with relevant web links.
    5. Do not add "assistant" to the response. Or any other text besides the results.`,
  };

  const handleSend = async () => {
    const newMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];

    // Include the system prompt only once at the beginning
    const messagesToSend = [
      systemPrompt,
      ...updatedMessages.flatMap((msg, index) => {
        // Alternate roles: if the index is even, it's the user's turn, if odd, it's the assistant's turn
        return index % 2 === 0 ? [msg] : [{ role: "assistant", content: "" }];
      }),
    ];

    setMessages(updatedMessages);
    setInput("");

    const model = "sonar";
    const options = {
      frequency_penalty: 1,
      max_tokens: 5000,
      temperature: 0.7,
    };

    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: messagesToSend, model, options }),
    });

    const textData = await response.text(); // Get the response as text
    console.log("Raw response text:", textData); // Log the raw text response

    let data;
    try {
      data = JSON.parse(textData); // Attempt to parse the text as JSON
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return; // Exit the function if parsing fails
    }

    // Log the parsed data to check the format
    console.log("Parsed response data:", data);

    if (data.choices && data.choices.length > 0) {
      // Extract the content from the message
      const messageContent = data.choices[0].message.content;

      // Clean up the message content to remove the code block markers
      const cleanedContent = messageContent.replace(/```json\n|\n```/g, ""); // Remove the code block markers

      // Parse the cleaned content as JSON
      const result = JSON.parse(cleanedContent); // Parse the JSON string

      // Add the result to the messages
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: JSON.stringify(result) }, // Store the result as a JSON string
      ]);
    }
  };

  // Function to render results in the new format
  const renderResults = (result) => {
    return (
      <div className={styles.results}>
        {result.map((item, index) => (
          <div key={index} className={styles.result}>
            <div className={styles.resultTitle}>
              <a href={item.url}>{item.title}</a>
            </div>
            <div className={styles.resultDescription}>{item.description}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className={styles.searchInput}
      />
      <button onClick={handleSend} className={styles.searchButton}>
        Send
      </button>
      <div className={styles.resultsContainer}>
        {messages.map((msg, index) => {
          if (msg.role === "user" || msg.role === "system") return null; // Skip rendering user and system messages
          const result = JSON.parse(msg.content); // Parse the JSON string to an object
          return (
            <div key={index} className={styles.resultCard}>
              {renderResults(result)} {/* Render the results */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatComponent;
