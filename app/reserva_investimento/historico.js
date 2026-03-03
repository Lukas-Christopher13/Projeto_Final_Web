"use client"

import styles  from "@/app/reserva_investimento/historico.module.css"
import ExportarHistoricoButton from "./components/ExportarHistoricoButton"
import { useEffect, useState } from "react"
import { FaPen, FaTrash } from "react-icons/fa"
import Modal from "./components/Modal"


export default function Historico() {
    const [aports, setAportes] = useState([])
    const [aporteId, setAporteId] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

   
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
                    <div className={styles.botoes_excluir}>
                        <button className={styles.botao_cancelar} onClick={() => fecharModal()} >Cancelar</button>
                        <button className={styles.botao_excluir} onClick={() => excluirAporte()} >Excluir</button>
                    </div>
                </div>
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
                            <button><FaPen size={16}/></button>
                            <button onClick={() => abrirModal(reserva.id)}><FaTrash size={16}/></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}