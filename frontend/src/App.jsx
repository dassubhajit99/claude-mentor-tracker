import { useState, useEffect, useCallback } from "react";
import DirectiveList from "./components/DirectiveList";
import DirectiveDetail from "./components/DirectiveDetail";
import EntryList from "./components/EntryList";
import EntryDetail from "./components/EntryDetail";
import EntryForm from "./components/EntryForm";
import ConfirmModal from "./components/ConfirmModal";
import {
  fetchDirectives,
  patchDirectiveStatus,
  fetchEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from "./api";
import styles from "./styles/App.module.css";

const TABS = [
  { key: "directives", label: "> mentor_directives" },
  { key: "entries", label: "> learning_log" },
];

function getErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("directives");

  // ── Directives state ──
  const [directives, setDirectives] = useState([]);
  const [selectedDirective, setSelectedDirective] = useState(null);
  const [directiveFilters, setDirectiveFilters] = useState({});

  // ── Entries state ──
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [entryFormMode, setEntryFormMode] = useState(null); // "create" | "edit" | null
  const [entryTrackFilter, setEntryTrackFilter] = useState(null);
  const [entrySearch, setEntrySearch] = useState("");

  // ── Shared state ──
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null); // { id, title }

  // ── Load data ──
  const loadDirectives = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (directiveFilters.category) params.category = directiveFilters.category;
      if (directiveFilters.priority) params.priority = directiveFilters.priority;
      if (directiveFilters.status) params.status = directiveFilters.status;
      const data = await fetchDirectives(params);
      setDirectives(data);
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e, "Failed to load directives."));
    } finally {
      setLoading(false);
    }
  }, [directiveFilters]);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (entryTrackFilter) params.track = entryTrackFilter;
      if (entrySearch.trim()) params.search = entrySearch.trim();
      const data = await fetchEntries(params);
      setEntries(data);
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e, "Failed to load entries."));
    } finally {
      setLoading(false);
    }
  }, [entryTrackFilter, entrySearch]);

  useEffect(() => {
    loadDirectives();
  }, [loadDirectives]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // ── Directive handlers ──
  function handleSelectDirective(d) {
    setSelectedDirective(d);
    setError(null);
  }

  function handleDirectiveFilterChange(key, value) {
    setDirectiveFilters((prev) => ({ ...prev, [key]: value }));
    setSelectedDirective(null);
  }

  async function handleDirectiveStatusChange(id, status) {
    try {
      const updated = await patchDirectiveStatus(id, status);
      setDirectives((prev) => prev.map((d) => (d._id === id ? updated : d)));
      if (selectedDirective?._id === id) setSelectedDirective(updated);
    } catch (e) {
      setError(getErrorMessage(e, "Failed to update status."));
    }
  }

  function handleEditDirective() {
    setError("Directive editing is restricted to the protected backend API flow.");
  }

  function handleDeleteDirective() {
    setError("Directive deletion is restricted to the protected backend API flow.");
  }

  // ── Entry handlers ──
  function handleSelectEntry(e) {
    setSelectedEntry(e);
    setEntryFormMode(null);
    setError(null);
  }

  function handleNewEntry() {
    setSelectedEntry(null);
    setEntryFormMode("create");
    setError(null);
  }

  function handleEditEntry() {
    setEntryFormMode("edit");
    setError(null);
  }

  function handleDeleteEntry() {
    if (!selectedEntry) return;
    setShowDeleteModal({
      id: selectedEntry._id,
      title: selectedEntry.title,
    });
  }

  async function handleSaveEntry(payload) {
    try {
      setLoading(true);
      setError(null);
      if (entryFormMode === "create") {
        const created = await createEntry(payload);
        setEntries((prev) => [created, ...prev]);
        setSelectedEntry(created);
      } else {
        const updated = await updateEntry(selectedEntry._id, payload);
        setEntries((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
        setSelectedEntry(updated);
      }
      setEntryFormMode(null);
    } catch (e) {
      setError(getErrorMessage(e, "Failed to save entry."));
    } finally {
      setLoading(false);
    }
  }

  function handleCancelEntryForm() {
    setEntryFormMode(null);
    setError(null);
  }

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState(null);
  function handleEntrySearch(value) {
    if (searchTimeout) clearTimeout(searchTimeout);
    const t = setTimeout(() => setEntrySearch(value), 300);
    setSearchTimeout(t);
  }

  // ── Delete confirm ──
  async function confirmDelete() {
    if (!showDeleteModal) return;
    const { id } = showDeleteModal;
    setShowDeleteModal(null);
    try {
      setLoading(true);
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e._id !== id));
      if (selectedEntry?._id === id) {
        setSelectedEntry(null);
        setEntryFormMode(null);
      }
    } catch (e) {
      setError(getErrorMessage(e, "Failed to delete entry."));
    } finally {
      setLoading(false);
    }
  }

  // ── Close detail panel ──
  function handleCloseDetail() {
    setSelectedDirective(null);
    setSelectedEntry(null);
    setEntryFormMode(null);
  }

  // Determine if detail panel is open
  const hasDetailOpen =
    activeTab === "directives"
      ? !!selectedDirective
      : !!(selectedEntry || entryFormMode);

  return (
    <div className={styles.app}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <span className={styles.appName}>&gt; oxide_tracker</span>
      </header>

      {/* ── Tab bar ── */}
      <nav className={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
            onClick={() => {
              setActiveTab(tab.key);
              setSelectedDirective(null);
              setSelectedEntry(null);
              setEntryFormMode(null);
              setError(null);
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Content area ── */}
      <div className={`${styles.content} ${hasDetailOpen ? styles.splitOpen : ""}`}>
        {/* List panel */}
        <div className={styles.listPanel}>
          {activeTab === "directives" ? (
            <DirectiveList
              directives={directives}
              selectedId={selectedDirective?._id}
              filters={directiveFilters}
              onFilterChange={handleDirectiveFilterChange}
              onSelect={handleSelectDirective}
            />
          ) : (
            <EntryList
              entries={entries}
              selectedId={selectedEntry?._id}
              activeTrack={entryTrackFilter}
              onTrackChange={setEntryTrackFilter}
              onSearch={handleEntrySearch}
              onSelect={handleSelectEntry}
              onNewEntry={handleNewEntry}
            />
          )}
        </div>

        {/* Detail panel */}
        {hasDetailOpen && (
          <div className={styles.detailPanel}>
            <button className={styles.closeDetail} onClick={handleCloseDetail}>
              &times;
            </button>

            {activeTab === "directives" && selectedDirective && (
              <DirectiveDetail
                directive={selectedDirective}
                onStatusChange={handleDirectiveStatusChange}
                onEdit={handleEditDirective}
                onDelete={handleDeleteDirective}
              />
            )}

            {activeTab === "entries" && entryFormMode ? (
              <EntryForm
                entry={entryFormMode === "edit" ? selectedEntry : null}
                onSave={handleSaveEntry}
                onCancel={handleCancelEntryForm}
                loading={loading}
                error={error}
              />
            ) : activeTab === "entries" && selectedEntry ? (
              <EntryDetail
                entry={selectedEntry}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            ) : null}
          </div>
        )}
      </div>

      {/* ── Loading indicator ── */}
      {loading && !entryFormMode && (directives.length === 0 || entries.length === 0) && (
        <div className={styles.loadingBar} />
      )}

      {/* ── Error toast ── */}
      {error && !entryFormMode && (
        <div className={styles.errorToast} onClick={() => setError(null)}>
          {error}
        </div>
      )}

      {/* ── Modals ── */}
      {showDeleteModal && (
        <ConfirmModal
          title="Delete entry"
          message={`"${showDeleteModal.title}" will be permanently removed. This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(null)}
        />
      )}
    </div>
  );
}
