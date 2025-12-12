export enum UserRole {
  ISSUER = 'ISSUER',
  LEARNER = 'LEARNER',
  VERIFIER = 'VERIFIER',
  ADMIN = 'ADMIN'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  expectedTimeSec: number; // Baseline for risk scoring
  type: 'LOGIC' | 'FACTUAL';
}

export interface ExamLog {
  questionId: string;
  timeSpentMs: number;
  tabSwitches: number;
  pasteEvents: number;
  timestamp: number;
}

export interface RiskReport {
  score: number; // 0-100
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: string[];
}

export interface CertificateData {
  id: string; // UUID
  issuerDid: string;
  recipientHash: string; // Hash of recipient PII
  issueDate: string;
  courseName: string;
  riskScore: number;
  signature: string; // ECDSA signature
  pqcSignature?: string; // Optional Post-Quantum signature
  txHash?: string; // Blockchain transaction hash
}

export interface VerificationResult {
  isValid: boolean;
  issuerTrusted: boolean;
  integrity: {
    blockchainMatch: boolean;
    signatureValid: boolean;
    stegoMatch: boolean;
  };
  details: CertificateData | null;
}