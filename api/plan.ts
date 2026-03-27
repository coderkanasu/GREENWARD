import { buildPlanFromPayload } from "../src/runtimeAdapter.js";

function parseBody(req: any): unknown {
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }
  return req.body;
}

export default function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error_code: "METHOD_NOT_ALLOWED", message: "Use POST" });
    return;
  }

  try {
    const payload = parseBody(req);
    const plan = buildPlanFromPayload(payload);
    res.status(200).json(plan);
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    res.status(400).json({ error_code: "VALIDATION_ERROR", message });
  }
}
