import { jsonData, jsonError } from "@/lib/api/http";
import { getHealth } from "@/lib/health";

export async function GET(): Promise<Response> {
  try {
    const health = await getHealth();
    const status = health.status === "ok" ? 200 : 503;
    return jsonData(health, status);
  } catch (error) {
    return jsonError(error);
  }
}
