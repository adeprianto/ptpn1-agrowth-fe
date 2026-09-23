import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

type Context = { params: Promise<{ id: string }> };

// GET /api/training-realizations/{id} -> GET /training-realizations/{id}
export async function GET(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/training-realizations/${id}`);
}

// PUT /api/training-realizations/{id} -> PUT /training-realizations/{id}
export async function PUT(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/training-realizations/${id}`);
}

// DELETE /api/training-realizations/{id} -> DELETE /training-realizations/{id}
export async function DELETE(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/training-realizations/${id}`);
}
