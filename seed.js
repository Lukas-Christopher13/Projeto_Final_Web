import fs from "fs"
import Aporte from "./models/Aporte.js"
import { connectDB } from "./utils/mongodb.js";

async function seed() {
    try {
        await connectDB()

        const dados = JSON.parse(
            fs.readFileSync("./seeds/aportes.seed.json", "utf-8")
        );

        await Aporte.deleteMany({});
        await Aporte.insertMany(dados);

        console.log("Seed executado!")
        process.exit();
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

seed();
