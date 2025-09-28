import Category from "@/models/Category";

export async function GET(request, { params }) {
    const id = params.id;
    const category = await Category.findById(id)
    return Response.json(category);
}

export async function DELETE(request, { params }) {
    const id = params.id;
    const category = await Category.findByIdAndDelete(id)
    return Response.json(category);
}

export async function PUT(request, { params }) {
    const id = params.id;
    const body = await request.json();
    const category = await Category.findByIdAndUpdate(id, body)
    return Response.json(category);
}