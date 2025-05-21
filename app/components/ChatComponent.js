"use client";

import { useState } from "react";
import styles from "./ChatComponent.module.css";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const systemPrompt = {
    role: "system",
    content: `You are a specialized local shopping search engine that helps users find products from independent retailers and small businesses. Your primary goal is to connect users with local and independent sellers.

Rules:
1. ONLY provide shopping results - no informational content or general descriptions
2. EXCLUSIVELY return results from independent retailers and small businesses
3. NEVER include results from: Amazon, Walmart, Apple, Best Buy, Target, Ebay, Google, or any other large corporations
4. Prioritize local businesses when a location is mentioned
5. Return results in JSON format only, with no additional text or explanations

Result Format:
Return 10-20 results in this JSON structure:
{
  "results": [
    {
      "title": "Product or Store Name",
      "url": "https://store-website.com",
      "description": "Brief product/store description",
      "price": "Price if available",
      "location": "City, State",
      "store_type": "Boutique/Shop/Store/etc",
      "local_rating": "Local rating if available",
      "specialties": ["Specialty 1", "Specialty 2"],
      "contact": {
        "phone": "Phone number if public",
        "address": "Physical address if public"
      }
    }
  ],
  "local_focus": true/false,
  "search_location": "Detected location if any"
}

Guidelines:
1. When a location is mentioned, prioritize businesses within 25 miles
2. Include a mix of online and physical stores
3. Focus on unique, specialty, and artisanal products
4. Include relevant store specialties and unique selling points
5. Add contact information when publicly available
6. Include price information when available
7. Highlight local ratings and reviews when available
8. For physical stores, include business hours if available

Remember: Quality over quantity. Better to return fewer, highly relevant results than many mediocre ones.`,
  };

  const handleSend = async () => {
    const newMessage = { role: "user", content: input };
    // Reset messages to only include the new user message and system prompt
    const messagesToSend = [systemPrompt, newMessage];

    setMessages([newMessage]); // Clear previous results and set only the new message
    setInput("");

    const model = "sonar";
    const options = {
      frequency_penalty: 1,
      max_tokens: 50000,
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
        ...messagesToSend,
        { role: "assistant", content: JSON.stringify(result) }, // Store the result as a JSON string
      ]);
    }
  };

  // Function to render results in the new format
  const renderResults = (result) => {
    return (
      <div className={styles.results}>
        {result.results.map((item, index) => (
          <div key={index} className={styles.result}>
            <div className={styles.resultTitle}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
              {item.price && <span className={styles.price}>{item.price}</span>}
            </div>
            <div className={styles.resultDescription}>{item.description}</div>
            <div className={styles.resultDetails}>
              {item.location && (
                <div className={styles.location}>
                  <span className={styles.label}>Location:</span>{" "}
                  {item.location}
                </div>
              )}
              {item.store_type && (
                <div className={styles.storeType}>
                  <span className={styles.label}>Type:</span> {item.store_type}
                </div>
              )}
              {item.local_rating && (
                <div className={styles.rating}>
                  <span className={styles.label}>Rating:</span>{" "}
                  {item.local_rating}
                </div>
              )}
              {item.specialties && item.specialties.length > 0 && (
                <div className={styles.specialties}>
                  <span className={styles.label}>Specialties:</span>{" "}
                  {item.specialties.join(", ")}
                </div>
              )}
              {item.contact && (
                <div className={styles.contact}>
                  {item.contact.phone && (
                    <div className={styles.phone}>
                      <span className={styles.label}>Phone:</span>{" "}
                      {item.contact.phone}
                    </div>
                  )}
                  {item.contact.address && (
                    <div className={styles.address}>
                      <span className={styles.label}>Address:</span>{" "}
                      {item.contact.address}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {result.local_focus && (
          <div className={styles.localFocus}>
            Showing local results for: {result.search_location}
          </div>
        )}
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
