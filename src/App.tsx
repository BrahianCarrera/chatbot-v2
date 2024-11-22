import { useEffect, useRef, useState } from "react";
import "./App.css"; // Import custom styles
import avatar from "./assets/avatar.png"; // Import image asset

function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "¡Hola! Soy tu asistente virtual especializado en sistemas de información. ¿Cómo te llamas?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [currentStep, setCurrentStep] = useState("personName");
  const [responses, setResponses] = useState<string[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null); 

  const predefinedOptions = {
    systemType: [
      "¿En qué tipo de sistema de información estás interesado? Por ejemplo: ERP, CRM, Sistemas de Gestión Académica, etc.",
    ],
    requirements: [
      "¿Cuáles son las principales necesidades o procesos que necesitas cubrir con el sistema de información?",
    ],
    budget: [
      "¿Tienes un presupuesto estimado para la implementación del sistema?",
    ],
    platform: [
      "¿Prefieres un sistema basado en la nube o uno que puedas instalar localmente?",
    ],
    confirmation: [
      "Para confirmar, estás interesado en un sistema {systemType}, que cubra {requirements}, con un presupuesto de {budget}, y que sea {platform}. ¿Es correcto? Por favor responde sí o no.",
    ],
    thanks: [
      "¡Gracias por usar nuestro asistente! Si necesitas más ayuda, no dudes en escribirnos.",
    ],
    default: ["Lo siento, no entendí eso. Por favor, responde con información válida."],
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    switch (currentStep) {
      case "personName":
        setCurrentStep("systemType");
        return [`Encantado de conocerte, ${userMessage}.`, ...predefinedOptions.systemType];

      case "systemType":
        setResponses((prev) => [...prev, userMessage]);
        setCurrentStep("requirements");
        return predefinedOptions.requirements;

      case "requirements":
        setResponses((prev) => [...prev, userMessage]);
        setCurrentStep("budget");
        return predefinedOptions.budget;

      case "budget":
        setResponses((prev) => [...prev, userMessage]);
        setCurrentStep("platform");
        return predefinedOptions.platform;

      case "platform":
        setResponses((prev) => [...prev, userMessage]);
        const [systemType, requirements, budget] = responses;
        setCurrentStep("confirmation");
        return predefinedOptions.confirmation.map((msg) =>
          msg
            .replace("{systemType}", systemType || "N/A")
            .replace("{requirements}", requirements || "N/A")
            .replace("{budget}", budget || "N/A")
            .replace("{platform}", userMessage || "N/A")
        );

      case "confirmation":
        if (lowerMessage.includes("s")) {
          setCurrentStep("end");
          return predefinedOptions.thanks;
        } else if (lowerMessage.includes("no")) {
          setCurrentStep("systemType");
          return predefinedOptions.systemType;
        }
        break;

      case "end":
        return predefinedOptions.thanks;

      default:
        return predefinedOptions.default;
    }

    return predefinedOptions.default;
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    // Agregar mensaje del usuario
    setMessages((prev) => [...prev, { sender: "user", text: newMessage }]);

    // Obtener respuesta del bot
    const botReplies = handleBotResponse(newMessage);

    // Simular un tiempo de respuesta del bot
    setTimeout(() => {
      botReplies.forEach((reply) => {
        setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      });
    }, 1000);

    setNewMessage("");
  };

  return (
    <div className="chatbot-app">
      <div className="chat-header">Asistente Virtual - Sistemas de Información</div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble ${message.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
            {message.sender === "bot" && <img src={avatar} alt="Bot Avatar" className="bot-image" />}
            <div className="message-content">{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Elemento para hacer scroll */}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          placeholder="Escribe tu mensaje aquí..."
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}

export default App;
