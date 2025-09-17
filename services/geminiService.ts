import { GoogleGenAI, Type } from "@google/genai";
import type { PasswordStrengthResult, FictionalBreachReport, SimulatedNetworkReport, SecurityTip, PhishingEmail } from '../types';

// Singleton instance to avoid re-creating the client on every call
let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns the GoogleGenAI client.
 * Throws an error if the API key is not available in the environment.
 */
const getAiClient = (): GoogleGenAI => {
    if (ai) {
        return ai;
    }

    // This is the single point of access for the API key.
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        console.error("API_KEY environment variable not set.");
        // This error will be caught by the calling functions in the components.
        throw new Error("The AI service is not configured. Please ensure the API key is set.");
    }

    ai = new GoogleGenAI({ apiKey });
    return ai;
};


const passwordSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: "A score from 0 to 100 representing password strength." },
        strength: { type: Type.STRING, description: "A textual description: Very Weak, Weak, Medium, Strong, or Very Strong." },
        suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actionable suggestions to improve the password."
        },
        reasoning: { type: Type.STRING, description: "A brief, one-sentence explanation for why the password received its score (e.g., 'Good length and complexity', 'Too short and lacks symbols')."}
    },
    required: ["score", "strength", "suggestions", "reasoning"]
};

export const analyzePasswordStrength = async (password: string): Promise<PasswordStrengthResult> => {
    try {
        const genAI = getAiClient();
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the strength of the following password: "${password}". Consider length, complexity (uppercase, lowercase, numbers, symbols), and common patterns. Provide a score, a strength category, a brief one-sentence reasoning for the score, and suggestions for improvement.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: passwordSchema,
            },
        });
        const result = JSON.parse(response.text);
        return result as PasswordStrengthResult;
    } catch (error) {
        console.error("Error analyzing password strength:", error);
        if (error instanceof Error && error.message.includes("configured")) {
             throw error;
        }
        throw new Error("Failed to analyze password strength.");
    }
};

const breachSchema = {
    type: Type.OBJECT,
    properties: {
        breaches: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the breached service (e.g., 'Fictional SocialNet')." },
                    date: { type: Type.STRING, description: "Fictional date of the breach (e.g., 'Jan 2022')." },
                    exposedData: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Types of data exposed (e.g., 'Email addresses', 'Passwords')."
                    }
                },
                required: ["name", "date", "exposedData"]
            }
        },
        recommendation: { type: Type.STRING, description: "A summary recommendation for the user." }
    },
    required: ["breaches", "recommendation"]
};

export const checkDataBreaches = async (email: string): Promise<FictionalBreachReport> => {
    try {
        const genAI = getAiClient();
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a fictional but realistic-looking data breach report for the email address "${email}". Create 2-3 fictitious breaches. For each breach, list the service name, a plausible date, and the types of data exposed. Also provide an overall recommendation. This is for a security dashboard demo and should not reflect real data.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: breachSchema,
            },
        });
        const result = JSON.parse(response.text);
        return result as FictionalBreachReport;
    } catch (error) {
        console.error("Error checking data breaches:", error);
        if (error instanceof Error && error.message.includes("configured")) {
             throw error;
        }
        throw new Error("Failed to check for data breaches.");
    }
};


const networkSchema = {
    type: Type.OBJECT,
    properties: {
        vulnerabilities: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    device: { type: Type.STRING, description: "The type of device (e.g., 'Router', 'Smart TV')." },
                    ip: { type: Type.STRING, description: "A plausible local IP address (e.g., '192.168.1.1')." },
                    vulnerability: { type: Type.STRING, description: "Description of the vulnerability." },
                    severity: { type: Type.STRING, description: "Severity level: Low, Medium, High, or Critical." },
                    recommendation: { type: Type.STRING, description: "How to fix the vulnerability." }
                },
                required: ["device", "ip", "vulnerability", "severity", "recommendation"]
            }
        }
    },
    required: ["vulnerabilities"]
};

export const scanLocalNetwork = async (): Promise<SimulatedNetworkReport> => {
    try {
        const genAI = getAiClient();
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Act as a network security scanner. Generate a realistic-looking but fictional vulnerability report for a typical home network. Identify 3-4 common devices (like a router, a smart TV, a laptop, and an IP camera) and invent some plausible low-to-medium severity vulnerabilities for them. Provide a short description, severity, and a recommendation for each. This is for a security dashboard simulation.",
             config: {
                responseMimeType: "application/json",
                responseSchema: networkSchema,
            },
        });
        const result = JSON.parse(response.text);
        return result as SimulatedNetworkReport;
    } catch (error) {
        console.error("Error scanning network:", error);
        if (error instanceof Error && error.message.includes("configured")) {
             throw error;
        }
        throw new Error("Failed to perform simulated network scan.");
    }
};

const tipsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "The title of the security tip." },
            explanation: { type: Type.STRING, description: "A simple, one-sentence explanation of the tip." },
            action: { type: Type.STRING, description: "A one-sentence 'how-to' action for the user." }
        },
        required: ["title", "explanation", "action"]
    }
};

export const getSecurityTips = async (): Promise<SecurityTip[]> => {
    try {
        const genAI = getAiClient();
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate a list of 5 essential personal cybersecurity tips for non-technical users. For each tip, provide a clear title, a simple one-sentence explanation, and a one-sentence 'how-to' action.",
             config: {
                responseMimeType: "application/json",
                responseSchema: tipsSchema,
            },
        });
        const result = JSON.parse(response.text);
        return result as SecurityTip[];
    } catch (error) {
        console.error("Error fetching security tips:", error);
        if (error instanceof Error && error.message.includes("configured")) {
             throw error;
        }
        throw new Error("Failed to fetch security tips.");
    }
};

const phishingEmailSchema = {
    type: Type.OBJECT,
    properties: {
        subject: { type: Type.STRING, description: "The subject line of the email." },
        sender: { type: Type.STRING, description: "The sender's email address and name (e.g., 'Support <support@example-service.com>')." },
        body: { type: Type.STRING, description: "The HTML or text body of the email. Should include realistic details, maybe a link." },
        isPhishing: { type: Type.BOOLEAN, description: "A boolean indicating if this email is a phishing attempt." },
        explanation: { type: Type.STRING, description: "A detailed explanation of why the email is or is not phishing, highlighting the specific clues." },
    },
    required: ["subject", "sender", "body", "isPhishing", "explanation"]
};

export const generatePhishingEmail = async (): Promise<PhishingEmail> => {
    try {
        const genAI = getAiClient();
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a realistic email for a phishing simulator. The email can be either a legitimate message OR a phishing attempt. Randomly decide which one to create. If it's phishing, include subtle red flags like a sense of urgency, a generic greeting, a suspicious link, or a slightly-off sender address. If it's legitimate, make it look professional and safe. Provide the email content and a detailed explanation of the clues.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: phishingEmailSchema,
            },
        });
        const result = JSON.parse(response.text);
        return result as PhishingEmail;
    } catch (error) {
        console.error("Error generating phishing email:", error);
        if (error instanceof Error && error.message.includes("configured")) {
             throw error;
        }
        throw new Error("Failed to generate phishing email.");
    }
};

export const getMfaExplanation = async (): Promise<string> => {
    try {
        const genAI = getAiClient();
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Explain in about 50 words why Multi-Factor Authentication (MFA) is a crucial security layer for online accounts. Use simple, encouraging language for a non-technical audience.",
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching MFA explanation:", error);
        if (error instanceof Error && error.message.includes("configured")) {
             throw error;
        }
        throw new Error("Failed to fetch MFA explanation.");
    }
};