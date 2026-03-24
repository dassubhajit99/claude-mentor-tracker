import { useState } from "react";
import EntryCard from "./EntryCard";
import { CATEGORIES, CATEGORY_LABELS } from "../constants";
import styles from "../styles/EntryList.module.css";

export default function EntryList({
  entries,
  selectedId,
  activeTrack,
  onTrackChange,
  onSearch,
  onSelect,
  onNewEntry,
}) {
  const [searchInput, setSearchInput] = useState("");

  function handleSearchChange(e) {
    setSearchInput(e.target.value);
    onSearch(e.target.value);
  }

  return (
    <div className={styles.container}>
      {/* Search + Filters */}
      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search entries..."
            value={searchInput}
            onChange={handleSearchChange}
          />
          <button className={styles.newBtn} onClick={onNewEntry}>
            + new_entry
          </button>
        </div>
        <div className={styles.filters}>
          <button
            className={`${styles.pill} ${!activeTrack ? styles.active : ""}`}
            onClick={() => onTrackChange(null)}
          >
            ALL
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`${styles.pill} ${activeTrack === c ? styles.active : ""}`}
              onClick={() => onTrackChange(c)}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Card list */}
      <div className={styles.list}>
        {entries.length === 0 && (
          <p className={styles.empty}>No entries yet.</p>
        )}
        {entries.map((e) => (
          <EntryCard
            key={e._id}
            entry={e}
            isSelected={e._id === selectedId}
            onClick={() => onSelect(e)}
          />
        ))}
      </div>
    </div>
  );
}
