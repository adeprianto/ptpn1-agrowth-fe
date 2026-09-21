import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

type Context = { params: Promise<{ id: string }> };

// GET /api/vendors/{id} -> GET /vendors/{id}
export async function GET(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/vendors/${id}`);
}

// PUT /api/vendors/{id} -> PUT /vendors/{id}
export async function PUT(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/vendors/${id}`);
}

// DELETE /api/vendors/{id} -> DELETE /vendors/{id}
export async function DELETE(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/vendors/${id}`);
}
