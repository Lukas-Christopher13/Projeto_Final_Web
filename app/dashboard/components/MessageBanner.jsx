import styles from "./MessageBanner.module.css";

export default function MessageBanner({ message }) {
  if (!message) return null;
  return <div className={styles.banner}>{message}</div>;
}
