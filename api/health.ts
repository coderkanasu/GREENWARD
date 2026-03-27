export default function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ error_code: "METHOD_NOT_ALLOWED", message: "Use GET" });
    return;
  }

  if (req.method === "HEAD") {
    res.status(200).end();
    return;
  }

  res.status(200).json({ status: "ok" });
}
