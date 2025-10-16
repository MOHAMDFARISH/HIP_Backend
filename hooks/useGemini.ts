// Fix: Add triple-slash directive to include Vite's client types.
/// <reference types="vite/client" />

import { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { OrderStatus, EmailContent } from '../types';
import { STATUS_OPTIONS } from '../constants';

// Fix: Per coding guidelines, the API key must be obtained from the environment.
// For Vite, this is import.meta.env.VITE_API_KEY.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  // Fix: The environment variable name was updated.
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

// Fix: Per coding guidelines, initialize with apiKey in an object.
const ai = new GoogleGenAI({ apiKey: apiKey });

const getStatusLabel = (status: OrderStatus): string => {
    return STATUS_OPTIONS.find(opt => opt.value === status)?.label || status;
}

export const useGemini = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateOrderStatusEmail = useCallback(async (
    customerName: string, 
    status: OrderStatus, 
    trackingNumber: string | null
  ): Promise<EmailContent | null> => {
    setLoading(true);
    setError(null);
    
    const statusLabel = getStatusLabel(status);
    const bookTitle = "The Art of Code";

    let details = `The new status of their order is "${statusLabel}".`;
    if (status === OrderStatus.Shipped && trackingNumber) {
        details += ` Their tracking number is ${trackingNumber}. Please include a placeholder link for tracking.`;
    }
    if (status === OrderStatus.ReadyForPickup) {
        details += ` Please inform them they can now pick up their order. Include placeholders for our store address and opening hours.`;
    }
    if (status === OrderStatus.Cancelled) {
        details += ` Inform them that their order has been cancelled. If they have questions, they should contact support. Include a placeholder for a support email address.`;
    }

    const prompt = `
        Generate an email to a customer about their book pre-order status update.
        The customer's name is ${customerName}.
        The book's title is "${bookTitle}".
        ${details}
        
        The response must be a JSON object with two keys: "subject" and "body".
        The "subject" should be a short, clear subject line for the email, including the book title.
        The "body" should be the email content. Start the body directly with the greeting (e.g., "Hi ${customerName},"). Do not wrap the response in markdown backticks.
      `;
    
    const systemInstruction = "You are an assistant for a bookstore. You generate concise, friendly, and professional emails.";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          // Fix: Added system instruction for better model guidance.
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING, description: 'Email subject line.' },
              body: { type: Type.STRING, description: 'Email body content.' },
            },
            required: ['subject', 'body'],
          },
        },
      });

      // Fix: Use response.text directly to parse as per guidelines.
      const emailContent = JSON.parse(response.text);
      return emailContent;
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      setError(err.message || 'Failed to generate email content.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateOrderStatusEmail, loading, error };
};