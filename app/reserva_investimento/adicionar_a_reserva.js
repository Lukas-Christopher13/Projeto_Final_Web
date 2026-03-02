"use client"

import styles from "@/app/reserva_investimento/adicionar_a_reservar.module.css"

import Button from "./components/Button"
import TextInput from "./components/TextInput"

import { validar } from "./vaidarFormulario"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { aporteSchema } from "@/schemas/aporte.schema"


async function handleSubmfit(e) {
    if(!validar(valor, data, fonte)) {
        alert("Preencha os campos corretamente");
        return;
    } 

    await fetch("/api/aportes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            valor: Number(valor),
            data,
            fonte
        })
    });

    alert("Aporte criado");

    setValor("");
    setData("");
    setFonte("");
}


export default function AdicionarAReserva() {
    const { register, handleSubmit, formState: { errors }} = useForm({
        resolver: zodResolver(aporteSchema),
        mode: "onBlur",
    })

    function onSubmit(data) {
        console.log(data)
    }

    return (
        <main className={styles.reserva}>
            <p className={styles.titulo}>Adicionar à Reserva</p>

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)} >
                <div className={styles.inputs}>
                    <div>
                        <TextInput 
                            {...register("valor")}
                            id={"valor"}
                            label="Valor (R$)" 
                            placeholder="R$ 0,00"
                        />
                        {errors.valor && <p className={styles.error} >{errors.valor.message}</p>}
                    </div>

                    <div>
                        <TextInput
                            {...register("data")}
                            id="data" 
                            label="Data"
                            type="date"
                        />
                        {errors.data && <p className={styles.error} >{errors.data.message}</p>}
                    </div>
        
                    <div>
                        <TextInput 
                            {...register("fonte")}
                            id="fonte" 
                            label="Fonte do Dinheiro (Ex: Sobra do Salário, Venda do Item 13)"
                        />
                        {errors.fonte && <p className={styles.error} >{errors.fonte.message}</p>}
                    </div>
                </div>

                <div className={styles.button}>
                    <Button type="submit" value="Guardar Dinheiro"/>
                </div>
            </form>
        </main>
    )
}