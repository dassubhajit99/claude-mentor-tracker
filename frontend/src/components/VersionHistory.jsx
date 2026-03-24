import { useState } from "react";
import styles from "../styles/VersionHistory.module.css";

export default function VersionHistory({ version, versions }) {
  const [open, setOpen] = useState(false);

  if (!versions || versions.length === 0) {
    return <span className={styles.badge}>v{version}</span>;
  }

  return (
    <div className={styles.container}>
      <button className={styles.badge} onClick={() => setOpen(!open)}>
        v{version}
        <span className={styles.arrow}>{open ? "\u25B4" : "\u25BE"}</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>Version History</div>
          {[...versions].reverse().map((v, i) => (
            <div key={i} className={styles.entry}>
              <div className={styles.entryMeta}>
                <span className={styles.entryVersion}>
                  v{versions.length - i}
                </span>
                <span className={styles.entryDate}>
                  {new Date(v.editedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className={styles.entryContent}>
                {v.content || v.title || "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
