import styles from "../styles/SessionCard.module.css";

const LEVEL_COLORS = {
  1: "green",
  2: "blue",
  3: "orange",
  4: "red",
  5: "purple",
};

export default function SessionCard({ session, isSelected, onClick }) {
  const color = LEVEL_COLORS[session.roadmapLevel] || "gray";
  const levelClass = `level${session.roadmapLevel}`;
  const dateStr = new Date(session.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`${styles.card} ${isSelected ? `${styles.selected} ${styles[levelClass]}` : ""}`}
      onClick={onClick}
    >
      <div className={styles.top}>
        <span className={styles.title}>{session.title}</span>
        <span className={`${styles.badge} ${styles[color]}`}>
          L{session.roadmapLevel}
        </span>
      </div>
      <div className={styles.bottom}>
        {session.subPhase && (
          <span className={styles.subPhase}>{session.subPhase}</span>
        )}
        <span className={styles.date}>{dateStr}</span>
      </div>
    </div>
  );
}
