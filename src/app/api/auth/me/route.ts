import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

/** GET /api/auth/me -> GET /me. 401 berarti belum login. */
export async function GET(request: NextRequest) {
    return forward(request, "/me");
}
