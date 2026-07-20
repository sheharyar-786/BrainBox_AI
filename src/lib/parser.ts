/**
 * Utility helper to extract plain text from file buffers.
 * Dynamically requires pdf-parse and mammoth to avoid bundler pollution.
 */
export async function parseFileText(buffer: Buffer, filename: string): Promise<string> {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  if (extension === "pdf") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(buffer) as { text?: string };
      return data.text || "";
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse PDF document: ${msg}`);
    }
  }

  if (extension === "docx") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer }) as { value?: string };
      return result.value || "";
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse DOCX document: ${msg}`);
    }
  }

  // Fallback for standard text/markdown files
  return buffer.toString("utf-8");
}
