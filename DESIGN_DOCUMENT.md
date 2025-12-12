# CertiFier: Design & Implementation Plan

## 1. Product Requirements Document (PRD)

### User Stories
*   **Issuer (Academy/Org):**
    *   I want to complete KYC so I can be authorized to issue certificates.
    *   I want to review flagged exam sessions (high risk) before approving issuance.
    *   I want to revoke a certificate if cheating is discovered post-factum.
*   **Learner:**
    *   I want to take a course and a proctored exam to earn a credential.
    *   I want to download my certificate as a PDF/PNG that I can share on LinkedIn.
    *   I want my privacy protected (name only revealed if I consent or if the verifier has the file).
*   **Verifier (Public/Employer):**
    *   I want to verify a certificate by uploading a file or scanning a QR code without logging in.
    *   I want to see if the certificate is valid, revoked, or if the digital signature is broken.
    *   I want to verify the "invisible" watermark matches the blockchain record.
*   **Admin:**
    *   I want to authorize new Issuers.
    *   I want to view global system health and contract gas usage.

## 2. System Architecture

*   **Blockchain (Trust Layer):**
    *   **Network:** Polygon PoS (Production) or Base (L2). *Recommendation:* Base. Low fees, Ethereum compatibility, backing by Coinbase implies longevity for verification.
    *   **Data:** Only `keccak256` hashes of the certificate content and the Recipient's identity commitment are stored. No PII.
*   **Backend (API & Logic):**
    *   **Node.js/Express:** Handles business logic, image processing (sharp), and PDF generation (pdf-lib).
    *   **Stego Module:** Embeds encrypted metadata into the certificate image LSBs (Least Significant Bits).
    *   **Key Management:** AWS KMS or HashiCorp Vault for Issuer private keys (Custodial). Support for "Bring Your Own Key" (Non-Custodial) via local signing.
*   **Frontend (UX):**
    *   **React/Vite:** Client-side application.
    *   **Verifier Engine:** Client-side extraction of steganography using HTML5 Canvas API (prevents server dependency for verification).
*   **Storage:**
    *   **Postgres:** Relational data (User profiles, Course progress, Exam logs).
    *   **S3 (Encrypted):** Storage for the physical certificate files (PDF/PNG).

## 3. Database Schema (PostgreSQL)

```sql
CREATE TABLE issuers (
  id UUID PRIMARY KEY,
  did VARCHAR(255) UNIQUE, -- Decentralized Identifier
  org_name VARCHAR(255),
  public_key TEXT, -- Ed25519 or ECDSA public key
  status VARCHAR(20) -- 'pending', 'active', 'suspended'
);

CREATE TABLE learners (
  id UUID PRIMARY KEY,
  email_hash VARCHAR(64) UNIQUE, -- Privacy preservation
  name_encrypted TEXT -- Encrypted at rest
);

CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  issuer_id UUID REFERENCES issuers(id),
  learner_id UUID REFERENCES learners(id),
  blockchain_tx_hash VARCHAR(66),
  on_chain_id BYTES32, -- The ID stored in smart contract
  content_hash VARCHAR(66), -- Hash of the JSON payload
  revoked BOOLEAN DEFAULT FALSE,
  metadata_json JSONB, -- The full canonical certificate data
  risk_score_at_issuance INTEGER
);

CREATE TABLE exam_attempts (
  id UUID PRIMARY KEY,
  learner_id UUID,
  risk_score INTEGER,
  flags JSONB, -- e.g. ["tab_switch_detected", "fast_answer"]
  details JSONB -- Detailed timing logs
);
```

## 4. Smart Contract Design (Solidity)

See `contracts/CertificateRegistry.sol` in the file list.
*   **Pattern:** Registry.
*   **Struct:** `Certificate { address issuer; bytes32 contentHash; bool revoked; uint48 issueDate; }`
*   **Key Function:** `issue(bytes32 certId, bytes32 contentHash)`
*   **Quantum Readiness:** The contract signature is standard ECDSA (for transaction validity). The *contentHash* represents a JSON object that includes a `pqc_signature` (Post-Quantum Cryptography), signed off-chain using Dilithium or Falcon.

## 5. Canonical Certificate JSON & Hashing

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "id": "urn:uuid:1234...",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "did:web:academy.com",
  "issuanceDate": "2023-10-27T12:00:00Z",
  "credentialSubject": {
    "id": "did:key:z6Mk...", // Learner DID
    "degree": {
      "type": "Bachelor of Science",
      "name": "Computer Science"
    }
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "verificationMethod": "did:web:academy.com#key-1",
    "proofValue": "..."
  },
  "extensions": {
    "pqc_signature": "...", // Dilithium signature for future-proofing
    "risk_score": 12 // Immutable record of exam integrity
  }
}
```
**Hashing Strategy:** `Keccak256(CanonicalStringify(JSON))`

## 6. Steganography Algorithm (LSB)

**Embedding (Pseudo-code):**
1.  Convert metadata (Cert ID + Hash + Signature) to binary string.
2.  Encrypt binary string with a shared viewing key (optional) or leave plain for public verification.
3.  Add Reed-Solomon error correction codes.
4.  Load image pixels (RGBA).
5.  Iterate through pixels:
    *   Replace the Least Significant Bit of the Blue channel with the next data bit.
    *   Spread bits pseudo-randomly based on a seed (Cert ID) to prevent visual artifacts in flat color areas.

**Extraction:**
1.  Load image pixels.
2.  Extract LSB of Blue channel based on the same seed pattern.
3.  Reassemble binary stream.
4.  Apply Error Correction.
5.  Parse JSON.

## 7. Risk Scoring Model (Heuristic)

**Inputs:** `time_per_question`, `tab_switches`, `mouse_velocity`, `copy_paste_count`.

**Algorithm:**
```javascript
let score = 0;
// 1. Tab Focus
score += (tab_switch_count * 10);

// 2. Speed Anomaly (Too fast)
// baseline_avg comes from aggregated anon data
if (time_taken < (baseline_avg[q_id] * 0.2)) {
    score += 20; // Impossible speed
}

// 3. Paste Detection
if (pasted_chars > 50) score += 15;

// 4. Latency Consistency (Bot check)
if (standard_deviation(response_times) < 0.1) {
    score += 30; // Robotic consistency
}
```

**Output:**
0-19: Low Risk (Auto-issue)
20-49: Medium Risk (Flag)
50+: High Risk (Manual Review)

## 8. Implementation Plan

**MVP (2-4 Weeks):**
*   **Week 1:** Setup Monorepo, Postgres, and Smart Contract deployment on Base Sepolia.
*   **Week 2:** Frontend Verifier (Canvas LSB) and Issuer Dashboard (Manual entry).
*   **Week 3:** Exam module with `useExamProctor` hook and basic heuristic scoring.
*   **Week 4:** Integration, PDF generation with embedded unique images (QR + Stego), Deployment.

**Hardening:**
*   **Security:** Move issuer keys to HSM. Implement rotation.
*   **Scalability:** Move stego processing to a queue (BullMQ + Redis) on backend. Index events using The Graph.
*   **Quantum:** Integrate a WASM-based Dilithium library for the off-chain "future-proof" signing.
