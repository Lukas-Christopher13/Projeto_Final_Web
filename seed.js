import fs from "fs"
import Aporte from "./models/Aporte.js"
import Cartao from "./models/Cartao.js"
import Despesa from "./models/Despesa.js"
import { connectDB } from "./utils/mongodb.js";
import Renda from "./models/Renda.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

async function seed() {
    try {
        await connectDB()

        const seedUser = await getOrCreateSeedUser();

        const dados = JSON.parse(
            fs.readFileSync("./seeds/aportes.seed.json", "utf-8")
        );

        await Aporte.deleteMany({});
        await Aporte.insertMany(dados.map((a) => ({ ...a, usuarioId: seedUser._id })));

        await carregarRendas(seedUser._id);
        await carragarCartoesEDespesas(seedUser._id);
        
        console.log("Seed executado!")
        process.exit();
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

async function carregarRendas(usuarioId) {
    await Renda.deleteMany({});

    const rendasData = JSON.parse(
        fs.readFileSync("./seeds/rendas.seed.json", "utf-8")
    );
    
    await Renda.insertMany(rendasData.map((r) => ({ ...r, usuarioId })));
}

async function carragarCartoesEDespesas(usuarioId) {
    await Despesa.deleteMany({});
    await Cartao.deleteMany({});

    const cartoesData = JSON.parse(
        fs.readFileSync("./seeds/cartoes.seed.json", "utf-8")
    );

    const despesasData = JSON.parse(
        fs.readFileSync("./seeds/despesas.seed.json", "utf-8")
    );

    const cartoes = await Cartao.insertMany(
        cartoesData.map((c) => ({ ...c, usuarioId }))
    );

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

        return { ...despesa, usuarioId };
    });
 
    await Despesa.insertMany(despesas);
}

async function getOrCreateSeedUser() {
    const email = process.env.ADMIN_EMAIL || "admin@financeapp.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const existing = await User.findOne({ email });
    if (existing) return existing;

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
        name: "Admin Seed",
        email,
        password: hashed,
        role: "admin",
        isActive: true,
    });
    return user;
}

seed();
