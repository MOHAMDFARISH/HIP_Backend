import { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { OrderStatus, EmailContent } from '../types';
import { STATUS_OPTIONS } from '../constants';

// FIX: Adhering to @google/genai guidelines to use process.env.API_KEY for the API key.
// This also resolves the TypeScript error on `import.meta.env`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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
        You are an assistant for a bookstore.
        Generate a concise, friendly, and professional email to a customer about their book pre-order status update.
        The customer's name is ${customerName}.
        The book's title is "${bookTitle}".
        ${details}
        
        Your response must be a JSON object with two keys: "subject" and "body".
        The "subject" should be a short, clear subject line for the email, including the book title.
        The "body" should be the email content. Start the body directly with the greeting (e.g., "Hi ${customerName},"). Do not wrap the response in markdown backticks.
      `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
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