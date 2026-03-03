import AporteController from "@/controllers/AporteController"

export async function DELETE(req, { params }) {
    const { id } = await params

    return AporteController.delete(id);
}
