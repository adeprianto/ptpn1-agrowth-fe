import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

type Context = { params: Promise<{ id: string }> };

// GET /api/employees/{id} -> GET /employees/{id}
export async function GET(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/employees/${id}`);
}
