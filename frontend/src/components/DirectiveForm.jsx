import { useState } from "react";
import { CATEGORIES, CATEGORY_LABELS, PRIORITIES } from "../constants";
import styles from "../styles/EntryForm.module.css";

function emptyForm() {
  return {
    content: "",
    category: CATEGORIES[0],
    priority: PRIORITIES[0],
  };
}

export default function DirectiveForm({ directive, onSave, onCancel, loading, error }) {
  const [form, setForm] = useState(() => {
    if (directive) {
      return {
        content: directive.content || "",
        category: directive.category || CATEGORIES[0],
        priority: directive.priority || PRIORITIES[0],
      };
    }
    return emptyForm();
  });

  const [prevDirective, setPrevDirective] = useState(directive);

  if (directive !== prevDirective) {
    setPrevDirective(directive);
    if (directive) {
      setForm({
        content: directive.content || "",
        category: directive.category || CATEGORIES[0],
        priority: directive.priority || PRIORITIES[0],
      });
    } else {
      setForm(emptyForm());
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      content: form.content.trim(),
      category: form.category,
      priority: form.priority,
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Edit Directive</h2>

      {error && <div className={styles.error}>{error}</div>}

      <label className={styles.label}>
        CATEGORY *
        <select
          className={styles.input}
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        PRIORITY *
        <select
          className={styles.input}
          name="priority"
          value={form.priority}
          onChange={handleChange}
          required
        >
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority.replace("_", " ")}
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
          placeholder="Directive content (supports markdown)..."
          rows={10}
        />
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
