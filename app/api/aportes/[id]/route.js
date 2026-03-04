import AporteController from "@/controllers/AporteController"

export async function DELETE(req, { params }) {
    const { id } = await params;

    return AporteController.delete(id);
}

export async function PUT(req, {params}) {
    const { id } = await params;
    const body = await req.json();

    return AporteController.update(id, body)
}