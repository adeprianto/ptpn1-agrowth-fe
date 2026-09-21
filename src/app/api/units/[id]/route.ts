import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

type Context = { params: Promise<{ id: string }> };

// GET /api/units/{id} -> GET /units/{id}
export async function GET(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/units/${id}`);
}

// PUT /api/units/{id} -> PUT /units/{id}
export async function PUT(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/units/${id}`);
}

// DELETE /api/units/{id} -> DELETE /units/{id}
export async function DELETE(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/units/${id}`);
}
