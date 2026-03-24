import Markdown from "react-markdown";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../constants";
import VersionHistory from "./VersionHistory";
import styles from "../styles/EntryDetail.module.css";

export default function EntryDetail({ entry, onEdit, onDelete }) {
  const colorVar = CATEGORY_COLORS[entry.track] || "l5";
  const dateStr = new Date(entry.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{entry.title}</h2>
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={onEdit}>Edit</button>
          <button className={styles.deleteBtn} onClick={onDelete}>Delete</button>
        </div>
      </div>

      {/* Meta row */}
      <div className={styles.meta}>
        <span className={`${styles.trackBadge} ${styles[colorVar]}`}>
          {CATEGORY_LABELS[entry.track]}
        </span>
        <span className={styles.date}>{dateStr}</span>
        <VersionHistory version={entry.version} versions={entry.versions} />
      </div>

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className={styles.tags}>
          {entry.tags.map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      )}

      {/* Content — markdown */}
      <div className={styles.content}>
        <Markdown>{entry.content}</Markdown>
      </div>
    </div>
  );
}
