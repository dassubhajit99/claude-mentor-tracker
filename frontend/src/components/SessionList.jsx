import SessionCard from "./SessionCard";
import styles from "../styles/SessionList.module.css";

const FILTERS = ["all", "1", "2", "3", "4", "5"];

export default function SessionList({
  sessions,
  selectedId,
  activeFilter,
  onFilterChange,
  onSelect,
  onNewSession,
}) {
  const filtered =
    activeFilter === "all"
      ? sessions
      : sessions.filter((s) => s.roadmapLevel === Number(activeFilter));

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${activeFilter === f ? styles.active : ""}`}
            onClick={() => onFilterChange(f)}
          >
            {f === "all" ? "All" : `L${f}`}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.length === 0 && (
          <p className={styles.empty}>No sessions yet.</p>
        )}
        {filtered.map((s) => (
          <SessionCard
            key={s._id}
            session={s}
            isSelected={s._id === selectedId}
            onClick={() => onSelect(s)}
          />
        ))}
      </div>

      <button className={styles.newBtn} onClick={onNewSession}>
        + New Session
      </button>
    </div>
  );
}
