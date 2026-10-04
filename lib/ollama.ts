const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL || "http://localhost:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL || "gemma3:4b";

export interface OllamaStatus {
  online: boolean;
  model: string;
  baseUrl: string;
  availableModels: string[];
  error?: string;
}

export async function checkOllamaStatus(): Promise<OllamaStatus> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return {
        online: false,
        model: OLLAMA_MODEL,
        baseUrl: OLLAMA_BASE_URL,
        availableModels: [],
        error: `Ollama returned HTTP ${res.status}`,
      };
    }

    const data = await res.json();
    const models = Array.isArray(data.models) ? data.models.map((m: any) => m.name) : [];

    return {
      online: true,
      model: OLLAMA_MODEL,
      baseUrl: OLLAMA_BASE_URL,
      availableModels: models,
    };
  } catch (err: any) {
    return {
      online: false,
      model: OLLAMA_MODEL,
      baseUrl: OLLAMA_BASE_URL,
      availableModels: [],
      error: "Ollama service is unreachable at " + OLLAMA_BASE_URL,
    };
  }
}

export async function generateWithGemma(prompt: string, format?: "json"): Promise<string> {
  try {
    const payload: any = {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: format === "json" ? 0.2 : 0.7,
      },
    };

    if (format === "json") {
      payload.format = "json";
    }

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`Ollama error (${response.status}): ${errText || response.statusText}`);
    }

    const data = await response.json();
    if (!data.response) {
      throw new Error("No response received from Gemma");
    }

    return data.response;
  } catch (error: any) {
    console.error("Local Gemma inference error:", error);

    const isConnectionError =
      error.name === "TimeoutError" ||
      error.cause?.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed") ||
      error.message?.includes("unreachable");

    if (isConnectionError) {
      throw new Error(
        `Saarthi's local AI engine isn't running. Please start Ollama using 'ollama serve' and ensure '${OLLAMA_MODEL}' is installed ('ollama pull ${OLLAMA_MODEL}').`
      );
    }

    throw error;
  }
}

export async function generateJsonWithGemma<T = any>(prompt: string): Promise<T> {
  const raw = await generateWithGemma(prompt, "json");
  try {
    return JSON.parse(raw);
  } catch {
    // If wrapped in markdown ```json ... ```
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      return JSON.parse(match[1]);
    }
    // Attempt to extract outermost { ... }
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      return JSON.parse(raw.substring(firstBrace, lastBrace + 1));
    }
    throw new Error("Failed to parse JSON response from Gemma: " + raw.substring(0, 100));
  }
}
