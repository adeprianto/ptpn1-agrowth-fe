import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

type Context = { params: Promise<{ id: string }> };

// GET /api/organizations/{id} -> GET /organizations/{id}
export async function GET(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/organizations/${id}`);
}

// PUT /api/organizations/{id} -> PUT /organizations/{id}
export async function PUT(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/organizations/${id}`);
}

// DELETE /api/organizations/{id} -> DELETE /organizations/{id}
export async function DELETE(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/organizations/${id}`);
}
