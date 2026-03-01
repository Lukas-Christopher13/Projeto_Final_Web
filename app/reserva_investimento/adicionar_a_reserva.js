"use client"

import { useState } from "react"

import styles from "@/app/reserva_investimento/adicionar_a_reservar.module.css"

import TextInput from "./components/TextInput"
import Button from "./components/Button"
import { validarValor, validarString, validarData } from "@/utils/validarCampos"


export default function AdicionarAReserva() {

    const [valor, setValor] = useState();
    const [data, setData] = useState();
    const [fonte, setFonte] = useState("");

    return (
        <main className={styles.reserva}>
            <p className={styles.titulo}>Adicionar à Reserva</p>

            <form className={styles.form} >
                <div className={styles.inputs}>
                    <TextInput 
                        id="valor" 
                        label="Valor (R$)" 
                        placeholder="R$ 0,00"
                        value={valor}
                        validar={validarValor}
                        onChange={setValor}
                    />
                    <TextInput
                        id="data" 
                        label="Data"
                        type="date"
                        value={data}
                        validar={validarData}
                        onChange={setData}
                    />
                    <TextInput 
                        id="fonte" 
                        label="Fonte do Dinheiro (Ex: Sobra do Salário, Venda do Item 13)"
                        value={fonte}
                        validar={validarString}
                        onChange={setFonte}
                    />
                </div>

                <div className={styles.button}>
                    <Button type="submit" value="Guardar Dinheiro"/>
                </div>
            </form>
        </main>
    )
}