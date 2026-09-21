import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

type Context = { params: Promise<{ id: string }> };

// GET /api/regionals/{id}/units -> GET /regionals/{id}/units
export async function GET(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/regionals/${id}/units`);
}
