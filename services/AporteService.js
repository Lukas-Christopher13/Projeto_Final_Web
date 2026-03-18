import * as XLSX from "xlsx"
import AporteRepository from "../repositories/AporteRepository";

class AporteService {
    async getAllAportes(userId) {
        let aportes = await AporteRepository.findAll(userId);
        aportes.sort((a, b) => new Date(b.data) - new Date(a.data));

        return aportes.map(aporte => {
            let dataFormatada = new Date(aporte.data).toLocaleDateString("pt-BR")
            return { id: aporte._id, valor: aporte.valor, data: dataFormatada, fonte: aporte.fonte }
        })
    }

    async create(aporte, userId) {
        return await AporteRepository.create(aporte, userId);
    }

    async update(id, body, userId) {
        return await AporteRepository.update(id, body, userId)
    }

    async findByIdAndDelete(id, userId) {
        return await AporteRepository.findByIdAndDelete(id, userId);
    }

    async getTotalAcumulado(userId) {
        let aportes = await AporteRepository.findAll(userId);
        aportes.sort((a, b) => new Date(a.data) - new Date(b.data))

        let acumulador = 0;

        aportes = aportes.map(aporte => {
            aporte.valor = aporte.valor + acumulador;
            acumulador = aporte.valor;

            let data = new Date(aporte.data).toLocaleDateString("pt-BR")
            
            return {data: data, valor: aporte.valor};
        })

        return aportes;
    }

    async getValorTotal(userId) {
        let aporte = await AporteRepository.findAll(userId);
        let valor = aporte.reduce((acc, aporte) => acc + aporte.valor, 0)

        valor = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valor)
            
        return {valorTotal: valor}
    }

    async exportarHistorico(userId) {
        let aportes = await AporteRepository.findAll(userId)
        aportes.sort((a, b) => new Date(a.data) - new Date(b.data))
        
        aportes = aportes.map(aporte => ({
            Fonte: aporte.fonte,
            Data: new Date(aporte.data).toLocaleDateString("pt-BR"),
            Valor: aporte.valor,
        }));

        const worksheet = XLSX.utils.json_to_sheet(aportes);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Aportes");

        return XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx"
        })
    }
}
export default new AporteService();
