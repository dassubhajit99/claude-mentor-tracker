import Markdown from "react-markdown";
import { CATEGORY_COLORS, CATEGORY_LABELS, STATUSES, STATUS_LABELS } from "../constants";
import VersionHistory from "./VersionHistory";
import styles from "../styles/DirectiveDetail.module.css";

export default function DirectiveDetail({
  directive,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  const colorVar = CATEGORY_COLORS[directive.category] || "l5";
  const dateStr = new Date(directive.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={`${styles.categoryBadge} ${styles[colorVar]}`}>
            {CATEGORY_LABELS[directive.category]}
          </span>
          <span className={styles.date}>{dateStr}</span>
          <VersionHistory version={directive.version} versions={directive.versions} />
        </div>
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={onEdit}>Edit</button>
          <button className={styles.deleteBtn} onClick={onDelete}>Delete</button>
        </div>
      </div>

      {/* Priority */}
      <div className={`${styles.priority} ${styles[`priority_${directive.priority}`]}`}>
        <span className={styles.dot} />
        {directive.priority.replace("_", " ")}
      </div>

      {/* Content — markdown */}
      <div className={styles.content}>
        <Markdown>{directive.content}</Markdown>
      </div>

      {/* Status toggles */}
      <div className={styles.statusSection}>
        <span className={styles.statusLabel}>STATUS</span>
        <div className={styles.statusButtons}>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`${styles.statusBtn} ${directive.status === s ? styles[`active_${s}`] : ""}`}
              onClick={() => onStatusChange(directive._id, s)}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
