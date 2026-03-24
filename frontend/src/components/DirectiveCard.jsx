import { CATEGORY_COLORS, CATEGORY_LABELS, STATUS_LABELS } from "../constants";
import VersionHistory from "./VersionHistory";
import styles from "../styles/DirectiveCard.module.css";

export default function DirectiveCard({ directive, isSelected, onClick }) {
  const colorVar = CATEGORY_COLORS[directive.category] || "l5";
  const dateStr = new Date(directive.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      data-color={colorVar}
      onClick={onClick}
    >
      <div className={styles.top}>
        <span className={`${styles.categoryBadge} ${styles[colorVar]}`}>
          {CATEGORY_LABELS[directive.category]}
        </span>
        <div className={styles.topRight}>
          <VersionHistory version={directive.version} versions={directive.versions} />
          <span className={styles.date}>{dateStr}</span>
        </div>
      </div>

      <p className={styles.content}>{directive.content}</p>

      <div className={styles.bottom}>
        <span className={`${styles.priority} ${styles[`priority_${directive.priority}`]}`}>
          <span className={styles.dot} />
          {directive.priority.replace("_", " ")}
        </span>
        <span className={`${styles.status} ${styles[`status_${directive.status}`]}`}>
          {STATUS_LABELS[directive.status]}
        </span>
      </div>
    </div>
  );
}
