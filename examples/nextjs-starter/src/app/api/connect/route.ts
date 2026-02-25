import { NextResponse } from "next/server";
import { connect } from "@opendatalabs/connect/server";
import { ConnectError } from "@opendatalabs/connect/core";
import { config } from "@/config";

const SCOPE_MAP: Record<string, string[]> = {
  spotify: ["spotify.history"],
  chatgpt: ["chatgpt.conversations"],
  linkedin: ["linkedin.profile"],
  instagram: ["instagram.profile"],
  github: ["github.profile"],
};

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get("service") || "";
    const scopes = SCOPE_MAP[service] || config.scopes;

    const sessionConfig = {
      ...config,
      scopes,
    };
    const result = await connect(sessionConfig);
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof ConnectError ? err.message : "Failed to create session";
    const status = err instanceof ConnectError ? (err.statusCode ?? 500) : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
