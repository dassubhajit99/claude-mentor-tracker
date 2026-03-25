import { CATEGORY_COLORS, CATEGORY_LABELS, STATUS_LABELS } from "../constants";
import VersionHistory from "./VersionHistory";
import styles from "../styles/DirectiveCard.module.css";

function getDirectivePreview(content) {
  return content
    .replace(/```([\s\S]*?)```/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function DirectiveCard({ directive, isSelected, onClick }) {
  const colorVar = CATEGORY_COLORS[directive.category] || "l5";
  const dateStr = new Date(directive.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const preview = getDirectivePreview(directive.content) || directive.content;

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

      <p className={styles.content}>{preview}</p>

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
