import fs from "fs"
import Aporte from "./models/Aporte.js"
import Cartao from "./models/Cartao.js"
import Despesa from "./models/Despesa.js"
import { connectDB } from "./utils/mongodb.js";
import Renda from "./models/Renda.js";

async function seed() {
    try {
        await connectDB()

        const dados = JSON.parse(
            fs.readFileSync("./seeds/aportes.seed.json", "utf-8")
        );

        await Aporte.deleteMany({});
        await Aporte.insertMany(dados);

        await carregarRendas();
        await carragarCartoesEDespesas();
        
        console.log("Seed executado!")
        process.exit();
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

async function carregarRendas() {
    await Renda.deleteMany({});

    const rendasData = JSON.parse(
        fs.readFileSync("./seeds/rendas.seed.json", "utf-8")
    );
    
    await Renda.insertMany(rendasData);
}

async function carragarCartoesEDespesas() {
    await Despesa.deleteMany({});
    await Cartao.deleteMany({});

    const cartoesData = JSON.parse(
        fs.readFileSync("./seeds/cartoes.seed.json", "utf-8")
    );

    const despesasData = JSON.parse(
        fs.readFileSync("./seeds/despesas.seed.json", "utf-8")
    );

    const cartoes = await Cartao.insertMany(cartoesData);

    const cataroNubank = cartoes.find(cartao => cartao.nome === "Nubank");
    const cartaoMercadoPago = cartoes.find(cartao => cartao.nome === "Mercado Pago");
    const cartaoBancoMaster = cartoes.find(cartao => cartao.nome === "Banco Master");

    const despesas = despesasData.map(despesa => {
        let random = Math.floor(Math.random() * 3);

        if (random === 0) {
            despesa.cartao = cataroNubank._id;
        }

        if (random === 1) {
            despesa.cartao = cartaoMercadoPago._id;
        }

        if (random === 2) {
            despesa.cartao = cartaoBancoMaster._id;
        } 

        return despesa;
    });
 
    await Despesa.insertMany(despesas);
}

seed();
