"use client"

import styles from "@/app/reserva_investimento/components/TextInput.module.css"
import { useState } from "react"

export default function TextInput({
    id,
    label,
    placeholder,
    value,
    onChange,
    validar,
    type = "text"
}) {

    const [error, setError] = useState("")

    function handleChange(e) {
        e.preventDefault()

        const novoValor = e.target.value;
        onChange(novoValor)
        validar(novoValor, setError)
    }

    return(
        <div className={styles.text_input}>
            <label className={styles.label} htmlFor={id}>{label}</label>
            <input 
                className={styles.input} 
                id={id} 
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                type={type}
            />
            <p className={styles.error}>
                {error ? error : ""}
            </p>
        </div>
    )
}