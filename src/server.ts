import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { PlannerService } from "./planner.js";
import { validateOnboardingInput } from "./validators.js";

const planner = new PlannerService();

const publicRoot = join(process.cwd(), "public");

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
};

function json(
  req: import("node:http").IncomingMessage,
  res: import("node:http").ServerResponse,
  statusCode: number,
  body: unknown
): void {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json; charset=utf-8");
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  res.end(JSON.stringify(body));
}

async function serveStatic(
  req: import("node:http").IncomingMessage,
  pathname: string,
  res: import("node:http").ServerResponse
): Promise<boolean> {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const safePath = normalize(requested).replace(/^([.][.][/\\])+/, "");
  const filePath = join(publicRoot, safePath);

  try {
    const contents = await readFile(filePath);
    const extension = extname(filePath);
    res.statusCode = 200;
    res.setHeader("content-type", contentTypes[extension] ?? "application/octet-stream");
    if (req.method === "HEAD") {
      res.end();
      return true;
    }
    res.end(contents);
    return true;
  } catch {
    return false;
  }
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");

  if ((req.method === "GET" || req.method === "HEAD") && url.pathname === "/health") {
    json(req, res, 200, { status: "ok" });
    return;
  }

  if (req.method === "POST" && url.pathname === "/plan") {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        const onboarding = validateOnboardingInput(payload);
        const plan = planner.buildPlan(onboarding, {
          rain_forecast: typeof payload.rain_forecast === "number" ? payload.rain_forecast : 0,
          temp: typeof payload.temp === "number" ? payload.temp : 75,
          forecast_window_hours: typeof payload.forecast_window_hours === "number" ? payload.forecast_window_hours : 24,
          green_up: typeof payload.green_up === "number" ? payload.green_up : undefined
        });
        json(req, res, 200, plan);
      } catch (error) {
        const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
        json(req, res, 400, { error_code: "VALIDATION_ERROR", message });
      }
    });
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, url.pathname, res).then((served) => {
      if (!served) {
        json(req, res, 404, { error_code: "NOT_FOUND", message: "Route not found" });
      }
    });
    return;
  }

  json(req, res, 404, { error_code: "NOT_FOUND", message: "Route not found" });
});

const port = Number(process.env.PORT ?? 8787);
server.listen(port, () => {
  process.stdout.write(`GREENWARD runtime server listening on ${port}\n`);
});
