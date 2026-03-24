import DirectiveCard from "./DirectiveCard";
import { CATEGORIES, PRIORITIES, STATUSES, CATEGORY_LABELS } from "../constants";
import styles from "../styles/DirectiveList.module.css";

const FILTER_GROUPS = [
  { key: "category", label: "Category", values: CATEGORIES, labels: CATEGORY_LABELS },
  { key: "priority", label: "Priority", values: PRIORITIES },
  { key: "status", label: "Status", values: STATUSES },
];

export default function DirectiveList({
  directives,
  selectedId,
  filters,
  onFilterChange,
  onSelect,
}) {
  return (
    <div className={styles.container}>
      {/* Filter pills */}
      <div className={styles.filterBar}>
        {FILTER_GROUPS.map((group) => (
          <div key={group.key} className={styles.filterGroup}>
            <span className={styles.filterLabel}>{group.label}</span>
            <div className={styles.pills}>
              <button
                className={`${styles.pill} ${!filters[group.key] ? styles.active : ""}`}
                onClick={() => onFilterChange(group.key, null)}
              >
                ALL
              </button>
              {group.values.map((v) => (
                <button
                  key={v}
                  className={`${styles.pill} ${filters[group.key] === v ? styles.active : ""}`}
                  onClick={() => onFilterChange(group.key, v)}
                >
                  {group.labels ? group.labels[v] || v : v.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Card list */}
      <div className={styles.list}>
        {directives.length === 0 && (
          <p className={styles.empty}>No directives found.</p>
        )}
        {directives.map((d) => (
          <DirectiveCard
            key={d._id}
            directive={d}
            isSelected={d._id === selectedId}
            onClick={() => onSelect(d)}
          />
        ))}
      </div>
    </div>
  );
}
