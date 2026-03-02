import {z} from "zod";

export const aporteSchema = z.object({
    valor: z.coerce
        .number()
        .positive("O valor deve ser positivo!"),
        
    data: z.string().nonempty("Data obrigatória!"),
    fonte: z.string().min(3, "Fonte deve ter no minimo 3 caracteres")
})