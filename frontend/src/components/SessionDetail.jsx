import styles from "../styles/SessionDetail.module.css";

const LEVEL_PROJECTS = {
  1: "Arena Allocator",
  2: "Zero-copy file parser / mmap reader",
  3: "Thread pool or work-stealing scheduler",
  4: "Redis-wire-protocol server",
  5: "Log-structured KV store OR llama.cpp wrapper in Rust",
};

export default function SessionDetail({ session, onEdit, onDelete }) {
  const dateStr = new Date(session.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const project = LEVEL_PROJECTS[session.roadmapLevel];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{session.title}</h2>
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={onEdit}>
            Edit
          </button>
          <button className={styles.deleteBtn} onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.phase}>{session.roadmapPhase}</span>
        {session.subPhase && (
          <span className={styles.subPhase}>{session.subPhase}</span>
        )}
        <span className={styles.date}>{dateStr}</span>
      </div>

      {project && (
        <div className={styles.projectBanner}>
          <span className={styles.projectLabel}>Project</span>
          <span className={styles.projectName}>{project}</span>
        </div>
      )}

      {session.currentProgressDescription && (
        <section className={styles.section}>
          <h3>Current Progress</h3>
          <p>{session.currentProgressDescription}</p>
        </section>
      )}

      {session.keyDecisions && session.keyDecisions.length > 0 && (
        <section className={styles.section}>
          <h3>Key Decisions</h3>
          <ul className={styles.decisions}>
            {session.keyDecisions.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      {session.notes && (
        <section className={styles.section}>
          <h3>Notes</h3>
          <p className={styles.notes}>{session.notes}</p>
        </section>
      )}
    </div>
  );
}
