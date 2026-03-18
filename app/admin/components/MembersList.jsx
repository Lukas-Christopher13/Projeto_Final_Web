"use client";

import { useState } from "react";
import styles from "./MembersList.module.css";

function DeleteModal({ name, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalIcon}>🗑️</div>
        <h3 className={styles.modalTitle}>Excluir membro</h3>
        <p className={styles.modalText}>
          Tem certeza que deseja excluir permanentemente <strong>{name}</strong>
          ? Esta ação não pode ser desfeita.
        </p>
        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MembersList({ members, fetching, onToggle, onDelete }) {
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

  const handleDeleteClick = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirm = () => {
    onDelete(deleteTarget.id, deleteTarget.name);
    setDeleteTarget(null);
  };

  return (
    <>
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={handleConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Membros Cadastrados</h2>
          <span className={styles.badge}>{members.length}</span>
        </div>

        {fetching ? (
          <p className={styles.empty}>Carregando...</p>
        ) : members.length === 0 ? (
          <div className={styles.emptyBox}>
            <p className={styles.emptyTitle}>Nenhum Membro Cadastrado</p>
            <p className={styles.emptyText}>
              Use o formulário acima para adicionar o primeiro membro.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {members.map((m) => (
              <div key={m._id} className={styles.row}>
                <div className={styles.avatar}>{m.name[0].toUpperCase()}</div>
                <div className={styles.info}>
                  <span className={styles.name}>{m.name}</span>
                  <span className={styles.email}>{m.email}</span>
                </div>
                <span
                  className={`${styles.status} ${m.isActive ? styles.statusActive : styles.statusInactive}`}
                >
                  {m.isActive ? "Ativo" : "Inativo"}
                </span>
                <button
                  className={styles.ghostBtn}
                  onClick={() => onToggle(m._id)}
                >
                  {m.isActive ? "Desativar" : "Ativar"}
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteClick(m._id, m.name)}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
