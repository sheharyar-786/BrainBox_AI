export interface AIProvider {
  generateText(prompt: string, systemInstruction?: string): Promise<string>;
  generateStream(prompt: string, systemInstruction?: string): Promise<ReadableStream<string>>;
}

interface GeminiPayload {
  contents: Array<{
    role: string;
    parts: Array<{ text: string }>;
  }>;
  systemInstruction?: {
    parts: Array<{ text: string }>;
  };
}

export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private modelName = "gemini-flash-latest";

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || "";
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Gemini API key is not configured inside server environment variables.");
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    const payload: GeminiPayload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API Error (${res.status}): ${errText}`);
    }

    const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  async generateStream(prompt: string, systemInstruction?: string): Promise<ReadableStream<string>> {
    if (!this.apiKey) {
      throw new Error("Gemini API key is not configured inside server environment variables.");
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:streamGenerateContent?key=${this.apiKey}`;
    const payload: GeminiPayload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini Streaming API Error (${res.status}): ${errText}`);
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    return new ReadableStream<string>({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Stream parsing by extraction of matching curly braces JSON blocks
            let braceCount = 0;
            let startIndex = -1;
            for (let i = 0; i < buffer.length; i++) {
              if (buffer[i] === "{") {
                if (braceCount === 0) startIndex = i;
                braceCount++;
              } else if (buffer[i] === "}") {
                braceCount--;
                if (braceCount === 0 && startIndex !== -1) {
                  const jsonStr = buffer.slice(startIndex, i + 1);
                  try {
                    const parsed = JSON.parse(jsonStr) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
                    const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                      controller.enqueue(text);
                    }
                  } catch {
                    // Ignore parse errors on partial JSON chunks
                  }
                  startIndex = -1;
                }
              }
            }

            if (startIndex !== -1) {
              buffer = buffer.slice(startIndex);
            } else {
              buffer = "";
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });
  }
}

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private modelName = "gpt-4o-mini";

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key is not configured inside server environment variables.");
    }

    const endpoint = "https://api.openai.com/v1/chat/completions";
    const messages: OpenAIMessage[] = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.modelName,
        messages
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API Error (${res.status}): ${errText}`);
    }

    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content || "";
  }

  async generateStream(prompt: string, systemInstruction?: string): Promise<ReadableStream<string>> {
    if (!this.apiKey) {
      throw new Error("OpenAI API key is not configured inside server environment variables.");
    }

    const endpoint = "https://api.openai.com/v1/chat/completions";
    const messages: OpenAIMessage[] = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.modelName,
        messages,
        stream: true
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI Streaming API Error (${res.status}): ${errText}`);
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    return new ReadableStream<string>({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const cleanLine = line.trim();
              if (!cleanLine) continue;
              if (cleanLine === "data: [DONE]") continue;

              if (cleanLine.startsWith("data: ")) {
                try {
                  const parsed = JSON.parse(cleanLine.slice(6)) as { choices?: Array<{ delta?: { content?: string } }> };
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) {
                    controller.enqueue(delta);
                  }
                } catch {
                  // Ignore partial parsing errors
                }
              }
            }
          }

          // Process remaining buffer
          if (buffer.startsWith("data: ") && !buffer.includes("[DONE]")) {
            try {
              const parsed = JSON.parse(buffer.slice(6)) as { choices?: Array<{ delta?: { content?: string } }> };
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                controller.enqueue(delta);
              }
            } catch {
              // Ignore partial parsing errors
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });
  }
}

// Get active provider based on environment setting (defaults to Gemini)
export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || "gemini";
  if (provider === "openai") {
    return new OpenAIProvider();
  }
  return new GeminiProvider();
}
