# 🛡️ SurfaceX | Enterprise Attack Surface Intelligence

**SurfaceX** is a professional External Attack Surface Management (EASM) snapshot tool designed for security engineers, SOC analysts, and vulnerability researchers. It provides a fast, structured, and explainable view of an organization's public exposure through passive OSINT and light metadata analysis.

> "Fast, explainable exposure visibility — not exploitation."

![FootprintX Hero Screenshot](https://github.com/SuperMag99/SurfaceX/blob/main/screenshot/1.png)
![FootprintX Hero Screenshot](https://github.com/SuperMag99/SurfaceX/blob/main/screenshot/2.png)
---

## 🎯 Project Overview

SurfaceX bridges the gap between basic OSINT scripts and heavy enterprise EASM platforms. It focuses on identifying **what** is exposed and **why** it matters, without performing intrusive scans or authenticated exploits.

---

## 🚀 Quick Start & Installation

To get SurfaceX running on your local machine, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SuperMag99/SurfaceX.git
   cd surfacex
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

---

## 🛠️ Execution Modes

SurfaceX provides two primary ways to analyze a target:

### 🔹 Option 1: AI Intelligence Mode (Recommended)
Uses LLM-powered correlation to simulate attack paths, predict high-risk exposures, and map findings to compliance frameworks. 
**Requires a Google Gemini API Key.**

#### 🔑 How to set your API Key:
If your `.env` file is not being picked up or you are running in a restricted environment, you can set the key directly in the browser:

1. **Standard .env Method**:
   Add a `.env` file to your project root:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

2. **Console Override (F12 Shortcut)**:
   If the `.env` fails or you are using the hosted version, open your browser's Developer Tools (F12 or Cmd+Option+I), go to the **Console** tab, and type:
   ```javascript
   window.SURFACEX_API_KEY = 'your_gemini_api_key_here';
   ```
   *Then, simply start your scan as usual.*

### 🔹 Option 2: Local Snapshot Mode (Zero API Key)
The "Pure OSINT" mode. Requires **no API keys** and **no backend**.
- Performs real-time client-side DNS lookups via Cloudflare DOH.
- Queries Certificate Transparency (CT) logs directly.
- Safely probes ports via native browser HTTP handshakes.
- **Perfect for rapid, private reconnaissance without third-party LLM processing.**

---

## 🔍 Key Modules

1. **Domain & DNS Intelligence**: Resolution patterns, MX/SPF/DMARC health, and cloud hosting indicators.
2. **Infrastructure Inventory**: Automated categorization of subdomains (Auth, Remote, Admin, Dev, SaaS).
3. **Cloud & SaaS Exposure**: Detection of 3rd-party services, CDN providers, and potential cloud leaks.
4. **Service Exposure Matrix**: Light TCP connect checks on common risk ports (SSH, RDP, Database).
5. **Security Headers & TLS**: Posture analysis of HSTS, CSP, and certificate chain trust.
6. **Attack Path Correlation**: Theoretical chaining of low-risk exposures into high-impact scenarios.

---

## ⚖️ Legal & Ethical Model (CRITICAL)

SurfaceX is for **defensive and authorized use only**. It follows these strict operational rules:
- ✅ Publicly accessible data only.
- ✅ Passive OSINT + light, non-intrusive active checks.
- ❌ No authentication bypass.
- ❌ No brute force or dictionary attacks.
- ❌ No exploitation of identified vulnerabilities.
- ❌ No scraping behind logins.

---

## 📦 Repository Hygiene
- Sensitive files (like `.env`) are excluded via `.gitignore`.
- Findings and samples used for testing are sanitized of PII.
- **No malware binaries** or malicious payloads are stored in this repository.

---

## 📄 Disclaimer
This project is provided **"as is"** without warranty of any kind. The authors and maintainers are not responsible for any misuse, unintended consequences, or damages resulting from the use of this tool. SurfaceX is intended for **defensive cybersecurity purposes only**. Always ensure you have explicit authorization before assessing any target infrastructure.

---

## 📌 Project Status
🚧 **Active Development**  
Features, detection logic, and risk heuristics evolve as the global threat landscape changes.

---

## 🧭 Support
- **Issues**: Use [GitHub Issues](https://github.com/SuperMag99/SurfaceX/issues).
- **Security**: Refer to `SECURITY.md`.

---

## ⭐ Support the Project
If SurfaceX helps your SOC team or security research, consider giving the repository a ⭐.

*Maintained by security professionals, for security professionals.*

---

## 📄 License
Distributed under the **MIT License**.  
Copyright (c) 2025 SurfaceX

---

## 👤 Maintainer
**SuperMag99**  
🔗 GitHub: [SuperMag99](https://github.com/SuperMag99)  
🔗 LinkedIn: [mag99](https://www.linkedin.com/in/mag99/)
