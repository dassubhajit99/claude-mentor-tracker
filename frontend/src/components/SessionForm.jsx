import { useState } from "react";
import styles from "../styles/SessionForm.module.css";

const PHASES = [
  "Level 1: Memory & Data Representation",
  "Level 2: Ownership, Borrowing & Systems I/O",
  "Level 3: Concurrency",
  "Level 4: Networking & Protocols",
  "Level 5: Storage Engine & Inference Runtime",
];

const PHASE_LEVEL_MAP = {
  "Level 1: Memory & Data Representation": 1,
  "Level 2: Ownership, Borrowing & Systems I/O": 2,
  "Level 3: Concurrency": 3,
  "Level 4: Networking & Protocols": 4,
  "Level 5: Storage Engine & Inference Runtime": 5,
};

// Sub-phases only exist for Level 1
const L1_SUBPHASES = [
  "Phase 0: Rust Syntax Bootcamp",
  "Phase 1: Memory Theory",
  "Phase 2: Build: Arena Allocator",
];

function emptyForm() {
  return {
    title: "",
    roadmapPhase: PHASES[0],
    roadmapLevel: 1,
    subPhase: L1_SUBPHASES[0],
    currentProgressDescription: "",
    keyDecisions: "",
    notes: "",
  };
}

export default function SessionForm({
  session,
  onSave,
  onCancel,
  loading,
  error,
}) {
  const [form, setForm] = useState(() => {
    if (session) {
      return {
        title: session.title || "",
        roadmapPhase: session.roadmapPhase || PHASES[0],
        roadmapLevel: session.roadmapLevel || 1,
        subPhase:
          session.subPhase ||
          (session.roadmapLevel === 1 ? L1_SUBPHASES[0] : ""),
        currentProgressDescription: session.currentProgressDescription || "",
        keyDecisions: session.keyDecisions
          ? session.keyDecisions.join("\n")
          : "",
        notes: session.notes || "",
      };
    }
    return emptyForm();
  });

  const [prevSession, setPrevSession] = useState(session);

  if (session !== prevSession) {
    setPrevSession(session);
    if (session) {
      setForm({
        title: session.title || "",
        roadmapPhase: session.roadmapPhase || PHASES[0],
        roadmapLevel: session.roadmapLevel || 1,
        subPhase:
          session.subPhase ||
          (session.roadmapLevel === 1 ? L1_SUBPHASES[0] : ""),
        currentProgressDescription: session.currentProgressDescription || "",
        keyDecisions: session.keyDecisions
          ? session.keyDecisions.join("\n")
          : "",
        notes: session.notes || "",
      });
    } else {
      setForm(emptyForm());
    }
  }

  const handlePhaseChange = (e) => {
    const phase = e.target.value;
    const level = PHASE_LEVEL_MAP[phase];
    setForm((f) => ({
      ...f,
      roadmapPhase: phase,
      roadmapLevel: level,
      subPhase: level === 1 ? L1_SUBPHASES[0] : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      roadmapPhase: form.roadmapPhase,
      roadmapLevel: form.roadmapLevel,
      subPhase: form.roadmapLevel === 1 ? form.subPhase : undefined,
      currentProgressDescription: form.currentProgressDescription.trim(),
      keyDecisions: form.keyDecisions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      notes: form.notes.trim(),
    };
    onSave(payload);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>
        {session ? "Edit Session" : "New Session"}
      </h2>

      {error && <div className={styles.error}>{error}</div>}

      <label className={styles.label}>
        Title *
        <input
          className={styles.input}
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g. Arena allocator deep-dive"
        />
      </label>

      <label className={styles.label}>
        Roadmap Level *
        <select
          className={styles.input}
          name="roadmapPhase"
          value={form.roadmapPhase}
          onChange={handlePhaseChange}
          required
        >
          {PHASES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      {form.roadmapLevel === 1 && (
        <label className={styles.label}>
          Sub-phase
          <select
            className={styles.input}
            name="subPhase"
            value={form.subPhase}
            onChange={handleChange}
          >
            {L1_SUBPHASES.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className={styles.label}>
        Current Progress
        <input
          className={styles.input}
          name="currentProgressDescription"
          value={form.currentProgressDescription}
          onChange={handleChange}
          placeholder="e.g. Finished move_semantics exercises in Rustlings"
        />
      </label>

      <label className={styles.label}>
        Key Decisions
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          name="keyDecisions"
          value={form.keyDecisions}
          onChange={handleChange}
          placeholder="Enter one decision per line"
          rows={4}
        />
        <span className={styles.hint}>Enter one decision per line</span>
      </label>

      <label className={styles.label}>
        Notes
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Open scratch pad..."
          rows={4}
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
