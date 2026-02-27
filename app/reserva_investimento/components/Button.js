import styles from "@/app/reserva_investimento/components/Button.module.css"

export default function Button(props) {
    return(
        <div className={styles.button}>
            <input type={props.type} value={props.value} />
        </div>
    )
}