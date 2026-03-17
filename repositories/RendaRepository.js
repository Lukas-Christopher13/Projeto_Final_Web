import Renda from "@/models/Renda";
import { connectDB } from "../utils/mongodb";

class RendaRepository {
    async create(data) {
        await connectDB();
        return await Renda.create(data);
    }

    async findByMesAno(mes, ano) {
        await connectDB();

        const inicio = new Date(ano, mes - 1, 1);
        const fim = new Date(ano, mes, 0, 23, 59, 59);

        return await Renda.find({
        data: {
            $gte: inicio,
            $lte: fim
        }
        }).sort({ data: -1 });

    }

    async getRendaPorAno(ano) {
        await connectDB();
        const inicioAno = new Date(`${ano}-01-01`);
        const fimAno = new Date(`${ano}-12-31`);

        return await Renda.find({
            data: {
                $gte: inicioAno,
                $lte: fimAno
            }
        }).exec();
    }

    async delete(id) {
        await connectDB();
        return await Renda.findByIdAndDelete(id);
    }

    async update(id, data) {
        await connectDB();
        return await Renda.findByIdAndUpdate(id, data, { new: true });
    }

}

export default new RendaRepository();

