import styles from "@/app/reserva_investimento/components/TextInput.module.css"

export default function TextInput(props) {
    return(
        <div className={styles.text_input}>
            <label className={styles.label} id={props.id}>{props.value}</label>
            <input className={styles.input} id={props.id}></input>
        </div>
    )
}