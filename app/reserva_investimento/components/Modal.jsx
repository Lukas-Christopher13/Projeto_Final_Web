"use client"

import { useEffect } from "react"
import styles from "./Modal.module.css"
import {FaTimes} from "react-icons/fa"

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>
          <FaTimes size={16} />
        </button>

        {children}
      </div>
    </div>
  )
}