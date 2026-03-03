"use client"

import styles  from "@/app/reserva_investimento/historico.module.css"
import ExportarHistoricoButton from "./components/ExportarHistoricoButton"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FaPen, FaTrash } from "react-icons/fa"
import Modal from "./components/Modal"
import TextInput from "./components/TextInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { aporteSchema } from "@/schemas/aporte.schema"


export default function Historico() {
    const { register, handleSubmit, formState: { errors }} = useForm({
        resolver: zodResolver(aporteSchema),
        mode: "onBlur",
    })

    const [aports, setAportes] = useState([])
    const [aporteId, setAporteId] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isEditModalOpen, setEditModal] = useState(false)
   
    function abrirModal(id) {
        setAporteId(id)
        setIsOpen(true)
    }

    function fecharModal() {
        setAporteId(null)
        setIsOpen(false)
    }

    async function excluirAporte() {
        if (!aporteId) return;

        await fetch(`/api/aportes/${aporteId}`, {
            method: "DELETE",
        })

        setAportes(aports.filter(aporte => aporte.id !== aporteId))
        
        fecharModal()
    }

    useEffect(() => {
        async function getAportes() {
            const response = await fetch("/api/aportes")
            const result = await response.json()
            setAportes(result)
        }
        getAportes()
    }, [])

    return (
        <main className={styles.historico}>

            <header className={styles.header} >
                <p className={styles.titulo}>Histórico de Reservas</p>
                <ExportarHistoricoButton />
            </header>
            
            <Modal isOpen={isOpen} onClose={() => fecharModal()} >
                <div className={styles.excluir}>
                    <p>Realmente deseja excluir o aporte?</p>
                    <div className={styles.botoes}>
                        <button className={styles.botao_cancelar} onClick={() => fecharModal()} >Cancelar</button>
                        <button className={styles.botao_excluir} onClick={() => excluirAporte()} >Excluir</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setEditModal(false)}>
                <form className={styles.atualizar}>
                    <div className={styles.input}>
                        <TextInput 
                            {...register("valor")}
                            id={"valor"}
                            label="Valor (R$)" 
                            type="number"
                            placeholder="R$ 0,00"
                        />
                        {errors.valor && <p className={styles.error} >{errors.valor.message}</p>}
                    </div>

                    <div className={styles.input}>
                        <TextInput
                            {...register("data")}
                            id="data" 
                            label="Data"
                            type="date"
                        />
                        {errors.data && <p className={styles.error} >{errors.data.message}</p>}
                    </div>
        
                    <div className={styles.input}>
                        <TextInput 
                            {...register("fonte")}
                            id="fonte" 
                            label="Fonte do Dinheiro (Ex: Sobra do Salário, Venda do Item 13)"
                        />
                        {errors.fonte && <p className={styles.error} >{errors.fonte.message}</p>}
                    </div>

                    <div className={styles.botoes}>
                        <button className={styles.botao_atualizar}>Atualizar</button>
                        <button className={styles.botao_cancelar}>Cancelar</button>
                    </div>
                </form>
            </Modal>
                            
            <table className={styles.tabela}>
                <thead className={styles.cabesalho_tabela}>
                    <tr>
                        <th>FONTE</th>
                        <th>VALOR</th>
                        <th>DATA</th>
                        <th>AÇÕES</th>
                    </tr>
                </thead>
                <tbody className={styles.linhas_tabela}>
                    {aports.map((reserva) => (
                    <tr key={reserva.id}>
                        <td>{reserva.fonte}</td>
                        <td>R$ {reserva.valor}</td>
                        <td>{reserva.data}</td>
                        <td>
                            <button onClick={() => setEditModal(true)}><FaPen size={16}/></button>
                            <button onClick={() => abrirModal(reserva.id)}><FaTrash size={16}/></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}