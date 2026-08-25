import React, { useEffect, useRef, useState } from "react";
import styles from "./AIAssistant.module.css";
import Swal from "sweetalert2";
import {
  uploadDocument,
  listDocuments,
  deleteDocument,
  askQuestion,
  getChatHistory,
  syncMedicalHistory,
} from "../../api/ragApi";

const CATEGORIES = [
  { value: "prescription", label: "Prescription" },
  { value: "lab_result", label: "Lab Result" },
  { value: "scan", label: "Scan" },
  { value: "other", label: "Other" },
];

const STATUS_LABEL = {
  processing: "Processing…",
  ready: "Ready",
  failed: "Failed",
};

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState("documents");

  return (
    <div className={styles.page}>
      <h1>AI Medical Assistant</h1>
      <p className={styles.intro}>
        Upload your prescriptions, lab results, or scans, then ask questions about them. Answers
        are based only on the documents you upload here.
      </p>

      <div className={styles.tabs}>
        <button
          className={activeTab === "documents" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("documents")}
        >
          My Documents
        </button>
        <button
          className={activeTab === "chat" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("chat")}
        >
          Ask a Question
        </button>
      </div>

      {activeTab === "documents" ? <DocumentsTab /> : <ChatTab />}
    </div>
  );
};

function DocumentsTab() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [category, setCategory] = useState("prescription");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const pollRef = useRef(null);

  async function refresh() {
    try {
      const { data } = await listDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Couldn't load documents",
        text: err.response?.data?.error || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    pollRef.current = setInterval(() => {
      setDocuments((current) => {
        if (current.some((d) => d.status === "processing")) refresh();
        return current;
      });
    }, 4000);
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSync() {
    setSyncing(true);
    try {
      const { data } = await syncMedicalHistory();
      await refresh();
      Swal.fire({
        icon: "success",
        title: "Sync complete",
        text: `Synced: ${data.syncedCount} | Already up to date: ${data.skippedCount} | Failed: ${data.failedCount}`,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Sync failed",
        text: err.response?.data?.error || "Could not sync your medical history",
      });
    } finally {
      setSyncing(false);
    }
  }

  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadDocument(file, category);
      }
      await refresh();
      Swal.fire({
        icon: "success",
        title: "Upload complete",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: err.response?.data?.error || "Something went wrong",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id, name) {
    const confirm = await Swal.fire({
      icon: "warning",
      title: `Delete "${name}"?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteDocument(id);
      setDocuments((current) => current.filter((d) => d._id !== id));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: err.response?.data?.error || "Something went wrong",
      });
    }
  }

  return (
    <div className={styles.panel}>
      <button
        className={styles.syncBtn}
        onClick={handleSync}
        disabled={syncing}
        style={{ marginBottom: 16 }}
      >
        {syncing ? "Syncing…" : "🔄 Sync My Medical History"}
      </button>

      <select
        className={styles.select}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={uploading}
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <label
        className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
          hidden
        />
        {uploading ? "Uploading…" : "Drop files here or click to browse"}
      </label>

      <ul className={styles.docList}>
        {loading && <li className={styles.empty}>Loading your documents…</li>}
        {!loading && documents.length === 0 && (
          <li className={styles.empty}>No documents uploaded yet.</li>
        )}
        {documents.map((doc) => (
          <li key={doc._id} className={styles.docRow}>
            <div className={styles.docInfo}>
              <span className={styles.docName}>{doc.originalFilename}</span>
              <span className={styles.docMeta}>
                {CATEGORIES.find((c) => c.value === doc.category)?.label || doc.category}
              </span>
            </div>
            <span className={`${styles.status} ${styles["status_" + doc.status]}`}>
              {STATUS_LABEL[doc.status] || doc.status}
            </span>
            <button
              className={styles.deleteBtn}
              onClick={() => handleDelete(doc._id, doc.originalFilename)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatTab() {
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // نجيب هيستوري الشات المحفوظ في الباك اند أول ما التاب يتفتح
  useEffect(() => {
    getChatHistory()
      .then(({ data }) => setMessages(data.messages || []))
      .catch(() => {
        // لو فشل تحميل الهيستوري، نسيب الشات يبدأ فاضي من غير ما نوقف الصفحة
      })
      .finally(() => setLoadingHistory(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || sending) return;

    setMessages((prev) => [...prev, { role: "patient", text: question }]);
    setInput("");
    setSending(true);

    try {
      const { data } = await askQuestion(question);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer, sources: data.sources },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: err.response?.data?.error || "Something went wrong.",
          isError: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.chatMessages}>
        {loadingHistory && <div className={styles.empty}>Loading your conversation…</div>}
        {!loadingHistory && messages.length === 0 && (
          <div className={styles.empty}>
            Ask a question about your prescriptions, lab results, or scans.
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.bubble} ${
              msg.role === "patient" ? styles.bubblePatient : styles.bubbleAssistant
            }`}
          >
            <p className={msg.isError ? styles.bubbleError : ""}>{msg.text}</p>
            {msg.sources?.length > 0 && (
              <details className={styles.sources}>
                <summary>Sources ({msg.sources.length})</summary>
                <ul>
                  {msg.sources.map((s, j) => (
                    <li key={j}>
                      {s.filename} — {Math.round(s.similarity * 100)}% match
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
        {sending && <div className={`${styles.bubble} ${styles.bubbleAssistant}`}>…</div>}
        <div ref={bottomRef} />
      </div>

      <form className={styles.chatInputRow} onSubmit={handleSend}>
        <input
          className={styles.chatInput}
          type="text"
          placeholder="Ask about your medications, results…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <button type="submit" disabled={sending || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default AIAssistant;
