import * as XLSX from "xlsx"
import AporteRepository from "../repositories/AporteRepository";

class AporteService {
    async getAllAportes() {
        let aportes = await AporteRepository.findAll();
        aportes.sort((a, b) => new Date(b.data) - new Date(a.data));

        return aportes.map(aporte => {
            let dataFormatada = new Date(aporte.data).toLocaleDateString("pt-BR")
            return { id: aporte._id, valor: aporte.valor, data: dataFormatada, fonte: aporte.fonte }
        })
    }

    async create(aporte) {
        return await AporteRepository.create(aporte)
    }

    async getTotalAcumulado() {
        let aportes = await AporteRepository.findAll();
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

    async getValorTotal() {
        let aporte = await AporteRepository.findAll();
        let valor = aporte.reduce((acc, aporte) => acc + aporte.valor, 0)

        valor = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valor)
            
        return {valorTotal: valor}
    }

    async exportarHistorico() {
        let aportes = await AporteRepository.findAll()
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