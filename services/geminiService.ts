
import { GoogleGenAI, Type } from "@google/genai";
import { ReconReport, RiskLevel } from "../types";

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    domain: { type: Type.STRING },
    timestamp: { type: Type.STRING },
    overallScore: { type: Type.NUMBER },
    riskLevel: { type: Type.STRING },
    summary: { type: Type.STRING },
    dimensions: {
      type: Type.OBJECT,
      properties: {
        initialAccess: { type: Type.NUMBER },
        lateralMovement: { type: Type.NUMBER },
        dataExposure: { type: Type.NUMBER },
        brandReputation: { type: Type.NUMBER },
      },
      required: ["initialAccess", "lateralMovement", "dataExposure", "brandReputation"],
    },
    findings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          module: { type: Type.STRING },
          category: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          severity: { type: Type.STRING },
          confidence: { type: Type.STRING },
          evidence: { type: Type.STRING },
          affectedAsset: { type: Type.STRING },
          impact: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          threatActorContext: { type: Type.STRING },
          compliance: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                framework: { type: Type.STRING },
                control: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["framework", "control", "description"],
            }
          }
        },
        required: ["id", "module", "category", "title", "description", "severity", "confidence", "evidence", "affectedAsset", "impact", "recommendation", "threatActorContext"]
      }
    },
    subdomains: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          ip: { type: Type.STRING },
          category: { type: Type.STRING },
          ports: { type: Type.ARRAY, items: { type: Type.NUMBER } },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          provider: { type: Type.STRING },
        },
        required: ["name", "ip", "category", "ports", "tags"]
      }
    },
    attackPaths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskLevel: { type: Type.STRING },
          likelihood: { type: Type.STRING },
        },
        required: ["id", "name", "steps", "riskLevel", "likelihood"]
      }
    },
    dnsRecords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          value: { type: Type.STRING },
        },
        required: ["type", "value"]
      }
    },
    techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
    securityHeaders: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          present: { type: Type.BOOLEAN },
          value: { type: Type.STRING },
        },
        required: ["name", "present"]
      }
    },
  },
  required: ["domain", "overallScore", "riskLevel", "findings", "subdomains", "attackPaths", "summary", "dimensions", "dnsRecords", "securityHeaders", "techStack"]
};

export const analyzeDomain = async (domain: string, depth: string = 'balanced'): Promise<ReconReport> => {
  // Defensive API key retrieval
  let apiKey = (window as any).SURFACEX_API_KEY;
  
  if (!apiKey) {
    try {
      if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        apiKey = process.env.API_KEY;
      }
    } catch (e) {
      // process.env might not be defined in pure browser environments
    }
  }
  
  if (!apiKey) {
    throw new Error("API Key Missing. Configure your .env or set it in the console: window.SURFACEX_API_KEY = 'your_key'");
  }

  const ai = new GoogleGenAI({ apiKey });
  const isDeep = depth === 'deep';
  const isRapid = depth === 'rapid';
  
  const maxFindings = isDeep ? 6 : (isRapid ? 3 : 5);
  const sessionSeed = Math.random().toString(36).substring(7);

  const prompt = `
    Act as a Senior Attack Surface Engineer for SurfaceX. Generate a unique, high-fidelity intelligence report for the target domain: ${domain}.
    Analyze passive OSINT indicators, metadata, and common exposure patterns.
    
    Session Seed: ${sessionSeed}.

    REQUIREMENTS:
    - Return valid JSON matching the specified schema.
    - Provide EXACTLY ${maxFindings} diverse and realistic findings.
    - Each finding must include a 'threatActorContext' which is a specific, real-world Exploitation Scenario.
    - 'evidence' should mimic real technical tool outputs.
    - Ensure 'overallScore' reflects the severity of the findings (0-100).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        thinkingConfig: { thinkingBudget: 2000 },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("The intelligence engine returned an empty response.");
    }

    try {
      return JSON.parse(text) as ReconReport;
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("The intelligence engine returned a malformed report.");
    }
  } catch (error: any) {
    console.error("SurfaceX Engine Error:", error);
    if (error.message?.includes("API_KEY") || error.message?.includes("unauthorized") || error.message?.includes("API key")) {
      throw new Error("Invalid or missing API Key. Check your configuration or Console settings.");
    }
    throw error;
  }
};
