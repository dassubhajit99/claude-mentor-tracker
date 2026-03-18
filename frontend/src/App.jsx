import { useState, useEffect } from "react";
import SessionList from "./components/SessionList";
import SessionDetail from "./components/SessionDetail";
import SessionForm from "./components/SessionForm";
import { fetchSessions, createSession, updateSession, deleteSession } from "./api";
import styles from "./styles/App.module.css";

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [formMode, setFormMode] = useState(null); // "create" | "edit" | null
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      setLoading(true);
      const data = await fetchSessions();
      setSessions(data);
    } catch (e) {
      setError("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }

  const currentLevel = sessions.length > 0 ? sessions[0].roadmapPhase : null;

  function handleSelect(session) {
    setSelectedSession(session);
    setFormMode(null);
    setError(null);
  }

  function handleNewSession() {
    setSelectedSession(null);
    setFormMode("create");
    setError(null);
  }

  function handleEdit() {
    setFormMode("edit");
    setError(null);
  }

  async function handleDelete() {
    if (!selectedSession) return;
    if (!window.confirm("Delete this session?")) return;
    try {
      setLoading(true);
      await deleteSession(selectedSession._id);
      setSessions((prev) => prev.filter((s) => s._id !== selectedSession._id));
      setSelectedSession(null);
      setFormMode(null);
    } catch (e) {
      setError("Failed to delete session.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(payload) {
    try {
      setLoading(true);
      setError(null);
      if (formMode === "create") {
        const created = await createSession(payload);
        setSessions((prev) => [created, ...prev]);
        setSelectedSession(created);
      } else {
        const updated = await updateSession(selectedSession._id, payload);
        setSessions((prev) =>
          prev.map((s) => (s._id === updated._id ? updated : s))
        );
        setSelectedSession(updated);
      }
      setFormMode(null);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to save session.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setFormMode(null);
    setError(null);
  }

  return (
    <div className={styles.appGrid}>
      <header className={styles.header}>
        <span className={styles.appName}>Claude Mentor Tracker</span>
        {currentLevel && (
          <span className={styles.currentLevel}>{currentLevel}</span>
        )}
      </header>

      <aside className={styles.leftPanel}>
        <SessionList
          sessions={sessions}
          selectedId={selectedSession?._id}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onSelect={handleSelect}
          onNewSession={handleNewSession}
        />
      </aside>

      <main className={styles.rightPanel}>
        {loading && !formMode && sessions.length === 0 && (
          <p className={styles.empty}>Loading...</p>
        )}

        {formMode ? (
          <SessionForm
            session={formMode === "edit" ? selectedSession : null}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading}
            error={error}
          />
        ) : selectedSession ? (
          <SessionDetail
            session={selectedSession}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <p className={styles.empty}>
            Select a session or create a new one.
          </p>
        )}
      </main>
    </div>
  );
}
