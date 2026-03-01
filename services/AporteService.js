import AporteRepository from "../repositories/AporteRepository";

class AporteService {
    async getAllAportes() {
        return await AporteRepository.findAll();
    }

    async getTotalAcumulado() {
        let aportes = await AporteRepository.findAll();
        aportes.sort((a, b) => new Date(a.data) - new Date(b.data))

        let acumulador = 0;

        aportes = aportes.map(aporte => {
            aporte.valor = aporte.valor + acumulador;
            acumulador = aporte.valor;

            let data =  new Date(aporte.data).toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo"
            })
            
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
}

export default new AporteService();