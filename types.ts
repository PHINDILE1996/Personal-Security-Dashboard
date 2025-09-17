export interface PasswordStrengthResult {
  score: number; // 0-100
  strength: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  suggestions: string[];
  reasoning: string;
}

export interface Breach {
  name: string;
  date: string;
  exposedData: string[];
}

export interface FictionalBreachReport {
  breaches: Breach[];
  recommendation: string;
}

export interface Vulnerability {
  device: string;
  ip: string;
  vulnerability: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendation: string;
}

export interface SimulatedNetworkReport {
    vulnerabilities: Vulnerability[];
}

export interface SecurityTip {
  title: string;
  explanation: string;
  action: string;
}

export interface PhishingEmail {
    subject: string;
    sender: string;
    body: string;
    isPhishing: boolean;
    explanation: string;
}

export interface SecurityScores {
    password: number;
    breach: number;
    network: number;
    phishing: number;
    mfa: number;
}