"use client"

import styles  from "@/app/reserva_investimento/historico.module.css"
import ExportarHistoricoButton from "../components/ExportarHistoricoButton"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FaPen, FaTrash } from "react-icons/fa"
import Modal from "./components/Modal"
import TextInput from "./components/TextInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { aporteSchema } from "@/schemas/aporte.schema"


export default function Historico() {
    const { register, handleSubmit, reset, formState: { errors }} = useForm({
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

    function abrirEditModal(aporte) {
        setAporteId(aporte.id)
        reset(aporte)
        setEditModal(true)
    }

    function fecharEditModal() {
        setAporteId(null)
        setEditModal(false)
    }

    async function atualizarAporte(data) {
        if (!aporteId) return;

        const response = await fetch(`/api/aportes/${aporteId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error("Erro ao atualizar")
        }

        fecharEditModal();
    }

    async function excluirAporte() {
        if (!aporteId) return;

        await fetch(`/api/aportes/${aporteId}`, {
            method: "DELETE",
        })

        setAportes(aports.filter(aporte => aporte.id !== aporteId));
        fecharModal();
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
                <form className={styles.atualizar} onSubmit={handleSubmit(atualizarAporte)}> 
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
                        <button className={styles.botao_atualizar} type="submit" >Atualizar</button>
                        <button className={styles.botao_cancelar} onClick={fecharEditModal} >Cancelar</button>
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
                    {aports.map((aporte) => (
                    <tr key={aporte.id}>
                        <td>{aporte.fonte}</td>
                        <td className={styles.valor}>R$ {aporte.valor}</td>
                        <td>{aporte.data}</td>
                        <td className={styles.acao}>
                            <button onClick={() => abrirEditModal(aporte)}><FaPen size={16}/></button>
                            <button onClick={() => abrirModal(aporte.id)}><FaTrash size={16}/></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}