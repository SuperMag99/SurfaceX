import { GoogleGenAI, Type } from "@google/genai";
import { ReconReport } from "../types";

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
        brandReputation: { type: Type.NUMBER }
      },
      required: ["initialAccess", "lateralMovement", "dataExposure", "brandReputation"]
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
          threatActorContext: { type: Type.STRING }
        },
        required: [
          "id",
          "module",
          "category",
          "title",
          "description",
          "severity",
          "confidence",
          "evidence",
          "affectedAsset",
          "impact",
          "recommendation",
          "threatActorContext"
        ]
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
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
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
          likelihood: { type: Type.STRING }
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
          value: { type: Type.STRING }
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
          value: { type: Type.STRING }
        },
        required: ["name", "present"]
      }
    }
  },

  required: [
    "domain",
    "overallScore",
    "riskLevel",
    "findings",
    "subdomains",
    "attackPaths",
    "summary",
    "dimensions",
    "dnsRecords",
    "securityHeaders",
    "techStack"
  ]
};

export const analyzeDomain = async (
  domain: string,
  depth: string = "balanced",
  apiKey?: string
): Promise<ReconReport> => {
  if (!apiKey) {
    throw new Error("Missing API key. Please provide it from the UI.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const isDeep = depth === "deep";
  const isRapid = depth === "rapid";
  const maxFindings = isDeep ? 6 : isRapid ? 3 : 5;

  const sessionSeed = Math.random().toString(36).slice(2);

  const prompt = `
Act as a Senior Attack Surface Engineer.

Target: ${domain}
Session: ${sessionSeed}

Return ONLY valid JSON matching schema.
Generate exactly ${maxFindings} findings.
Include realistic exploitation scenarios in threatActorContext.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: reportSchema,
      thinkingConfig: { thinkingBudget: 2000 }
    }
  });

  if (!response.text) {
    throw new Error("Empty response from model");
  }

  return JSON.parse(response.text) as ReconReport;
<<<<<<< HEAD
};
=======
};
>>>>>>> 4602b36fb7a834cfe3aeafae3625828e92a0b08b
