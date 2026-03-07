import DespesasRepository from "@/repositories/DespesasRepository";
import RendaRepository from "@/repositories/RendaRepository";

class DespesasService {
    async getGrapBarCharData(ano) {    
        const mesesNomes = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    
        const meses = mesesNomes.map(m => ({
            mes: m,
            renda: 0,
            despesa: 0
        }));
    
        const despesas = await DespesasRepository.getDespesasPorAno(ano);
        const rendas = await RendaRepository.getRendaPorAno(ano)
    
        despesas.forEach(d => meses[new Date(d.data).getMonth()].despesa += d.valor);
        rendas.forEach(r => meses[new Date(r.data).getMonth()].renda += r.valor);
    
        return meses;
    }
}

export default new DespesasService()