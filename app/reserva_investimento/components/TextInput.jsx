"use client"

import React from "react";
import styles from "@/app/reserva_investimento/components/TextInput.module.css"


const TextInput = React.forwardRef(
    ({ id, label, placeholder, type = "text", ...rest }, ref) => {
        return (
            <div className={styles.text_input}>
                <label className={styles.label} htmlFor={id}>
                    {label}
                </label>

                <input
                    ref={ref}
                    id={id}
                    className={styles.input}
                    placeholder={placeholder}
                    type={type}
                    {...rest}                
                />
            </div>
        );
    }
);

TextInput.displayName = "TextInput";

export default TextInput;