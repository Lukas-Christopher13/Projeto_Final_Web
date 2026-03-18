import Renda from "@/models/Renda";
import { connectDB } from "../utils/mongodb";

class RendaRepository {
    async create(data, userId) {
        await connectDB();
        return await Renda.create({ ...data, usuarioId: userId });
    }

    async findByMesAno(mes, ano, userId) {
        await connectDB();

        const inicio = new Date(ano, mes - 1, 1);
        const fim = new Date(ano, mes, 0, 23, 59, 59);

        return await Renda.find({
        data: {
            $gte: inicio,
            $lte: fim
        },
        usuarioId: userId
        }).sort({ data: -1 });

    }

    async getRendaPorAno(ano, userId) {
        await connectDB();
        const inicioAno = new Date(`${ano}-01-01`);
        const fimAno = new Date(`${ano}-12-31`);

        return await Renda.find({
            data: {
                $gte: inicioAno,
                $lte: fimAno
            },
            usuarioId: userId
        }).exec();
    }

    async delete(id, userId) {
        await connectDB();
        return await Renda.findOneAndDelete({ _id: id, usuarioId: userId });
    }

    async update(id, data, userId) {
        await connectDB();
        return await Renda.findOneAndUpdate(
            { _id: id, usuarioId: userId },
            data,
            { new: true }
        );
    }

}

export default new RendaRepository();
