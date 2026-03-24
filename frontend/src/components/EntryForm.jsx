import { useState } from "react";
import { CATEGORIES, CATEGORY_LABELS } from "../constants";
import styles from "../styles/EntryForm.module.css";

function emptyForm() {
  return {
    title: "",
    content: "",
    track: CATEGORIES[0],
    tags: "",
  };
}

export default function EntryForm({ entry, onSave, onCancel, loading, error }) {
  const [form, setForm] = useState(() => {
    if (entry) {
      return {
        title: entry.title || "",
        content: entry.content || "",
        track: entry.track || CATEGORIES[0],
        tags: entry.tags ? entry.tags.join(", ") : "",
      };
    }
    return emptyForm();
  });

  const [prevEntry, setPrevEntry] = useState(entry);

  if (entry !== prevEntry) {
    setPrevEntry(entry);
    if (entry) {
      setForm({
        title: entry.title || "",
        content: entry.content || "",
        track: entry.track || CATEGORIES[0],
        tags: entry.tags ? entry.tags.join(", ") : "",
      });
    } else {
      setForm(emptyForm());
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      track: form.track,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSave(payload);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>
        {entry ? "Edit Entry" : "New Entry"}
      </h2>

      {error && <div className={styles.error}>{error}</div>}

      <label className={styles.label}>
        TITLE *
        <input
          className={styles.input}
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g. Completed NeetCode Arrays section"
        />
      </label>

      <label className={styles.label}>
        TRACK *
        <select
          className={styles.input}
          name="track"
          value={form.track}
          onChange={handleChange}
          required
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        CONTENT *
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          name="content"
          value={form.content}
          onChange={handleChange}
          required
          placeholder="Detailed notes (supports markdown)..."
          rows={10}
        />
      </label>

      <label className={styles.label}>
        TAGS
        <input
          className={styles.input}
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="redis, tcp, day-15 (comma-separated)"
        />
        <span className={styles.hint}>Comma-separated, e.g. redis, tcp, day-15</span>
      </label>

      <div className={styles.buttons}>
        <button type="submit" className={styles.saveBtn} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
