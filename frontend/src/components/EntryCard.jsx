import { CATEGORY_COLORS, CATEGORY_LABELS } from "../constants";
import VersionHistory from "./VersionHistory";
import styles from "../styles/EntryCard.module.css";

export default function EntryCard({ entry, isSelected, onClick }) {
  const colorVar = CATEGORY_COLORS[entry.track] || "l5";
  const dateStr = new Date(entry.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <div className={styles.top}>
        <span className={styles.title}>{entry.title}</span>
        <span className={`${styles.trackBadge} ${styles[colorVar]}`}>
          {CATEGORY_LABELS[entry.track]}
        </span>
      </div>

      <p className={styles.preview}>{entry.content}</p>

      <div className={styles.bottom}>
        <div className={styles.tags}>
          {entry.tags?.slice(0, 3).map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
          {entry.tags?.length > 3 && (
            <span className={styles.tagMore}>+{entry.tags.length - 3}</span>
          )}
        </div>
        <div className={styles.bottomRight}>
          <VersionHistory version={entry.version} versions={entry.versions} />
          <span className={styles.date}>{dateStr}</span>
        </div>
      </div>
    </div>
  );
}
