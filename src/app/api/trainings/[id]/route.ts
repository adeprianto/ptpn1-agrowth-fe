import { NextRequest } from "next/server";
import { forward } from "@/lib/api-client";

type Context = { params: Promise<{ id: string }> };

// GET /api/trainings/{id} -> GET /trainings/{id}
export async function GET(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/trainings/${id}`);
}

// PUT /api/trainings/{id} -> PUT /trainings/{id}
export async function PUT(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/trainings/${id}`);
}

// DELETE /api/trainings/{id} -> DELETE /trainings/{id}
export async function DELETE(request: NextRequest, { params }: Context) {
    const { id } = await params;
    return forward(request, `/trainings/${id}`);
}
