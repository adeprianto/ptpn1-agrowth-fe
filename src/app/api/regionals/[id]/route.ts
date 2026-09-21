import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

type Context = { params: Promise<{ id: string }> };

// GET /api/regionals/{id} -> GET /regionals/{id}
export async function GET(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/regionals/${id}`);
}

// PUT /api/regionals/{id} -> PUT /regionals/{id}
export async function PUT(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/regionals/${id}`);
}

// DELETE /api/regionals/{id} -> DELETE /regionals/{id}
export async function DELETE(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/regionals/${id}`);
}
