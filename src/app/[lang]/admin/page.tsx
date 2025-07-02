"use client";
import React, { useState, useEffect } from "react";
import styles from "./AdminPanel.module.css";
import Header from "../components/header/Header";
import { FiUser } from "react-icons/fi";

const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "C++",
  "C#",
  "Java",
  "PHP",
  "Swift",
  "Kotlin",
  "Dart",
  "Go",
  "Ruby",
  "Scala",
  "Rust",
];

const PANELS = [
  { key: "users", label: "Users" },
  { key: "questions", label: "Questions" },
  { key: "topics", label: "Topics" },
];

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminPanelPage() {


  const [panel, setPanel] = useState("users");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topicLang, setTopicLang] = useState("");
  const [questionLang, setQuestionLang] = useState("");

  // Fetch users
  useEffect(() => {
    if (panel !== "users") return;
    setLoading(true);
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users");
        setLoading(false);
      });
  }, [panel]);

  // Delete user
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setLoading(false);
  };

  // Edit user
  const handleEdit = (user: User) => setEditUser(user);
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editUser) return;
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const updated: any = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
    };
    const newPassword = formData.get("password") as string;
    if (newPassword) updated.password = newPassword;
    const res = await fetch(`/api/admin/users/${editUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    let updatedUser;
    try {
      updatedUser = await res.json();
    } catch {
      setError("Failed to update user (invalid response)");
      setLoading(false);
      return;
    }
    if (!res.ok) {
      setError(updatedUser.error || "Failed to update user");
      setLoading(false);
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setEditUser(null);
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          {PANELS.map((p) => (
            <button
              key={p.key}
              className={
                panel === p.key
                  ? `${styles.sidebarItem} ${styles.sidebarItemActive}`
                  : styles.sidebarItem
              }
              onClick={() => setPanel(p.key)}
            >
              {p.label}
            </button>
          ))}
        </aside>
        <main className={styles.panelContent}>
          {panel === "users" && (
            <div>
              <h2 className={styles.pageTitle}>All Users</h2>
              {loading && <div>Loading...</div>}
              {error && <div className="text-red-500 mb-2">{error}</div>}
              <div className={styles.card}>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 rounded"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div>
                      <span className="font-semibold text-gray-800">{user.name}</span>
                      <span className="ml-2 text-xs text-gray-500">({user.role})</span>
                    </div>
                    <div className="flex gap-2">
                      <button className={styles.button} style={{background:'#eee',color:'#444'}} onClick={e => {e.stopPropagation(); handleEdit(user);}}>Edit</button>
                      <button className={styles.button} style={{background:'#ffeaea',color:'#d32f2f'}} onClick={e => {e.stopPropagation(); handleDelete(user.id);}}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[320px] max-w-[90vw]">
                    <h3 className="text-xl font-bold mb-4">User Details</h3>
                    <div className="mb-2"><b>Name:</b> {selectedUser.name}</div>
                    <div className="mb-2"><b>Email:</b> {selectedUser.email}</div>
                    <div className="mb-2"><b>Role:</b> {selectedUser.role}</div>
                    <button className={styles.button} onClick={()=>setSelectedUser(null)} style={{marginTop:16}}>Close</button>
                  </div>
                </div>
              )}
              {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-0 overflow-hidden animate-fadeIn">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-6 pt-6 pb-2 border-b">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <FiUser className="text-purple-600 text-xl" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">Edit User</div>
                        <div className="text-gray-500 text-sm">Update user information</div>
                      </div>
                    </div>
                    {/* Main Content */}
                    <form id="edit-user-form" onSubmit={handleEditSubmit} className="px-6 py-4 flex flex-col gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                          name="name"
                          defaultValue={editUser.name}
                          className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                          name="email"
                          defaultValue={editUser.email}
                          className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Role</label>
                        <select
                          name="role"
                          defaultValue={editUser.role}
                          className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200"
                          required
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">New Password (optional)</label>
                        <input
                          name="password"
                          type="password"
                          className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200"
                          placeholder="Leave blank to keep current password"
                        />
                      </div>
                    </form>
                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 px-6 pb-6 pt-2 border-t bg-gray-50">
                      <button
                        type="button"
                        onClick={() => setEditUser(null)}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        form="edit-user-form"
                        className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {panel === "questions" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add Question</h2>
              {!questionLang ? (
                <div className={styles.card}>
                  <label className="block mb-2 font-medium">
                    Choose Language:
                  </label>
                  <select
                    className={styles.select}
                    value={questionLang}
                    onChange={(e) => setQuestionLang(e.target.value)}
                  >
                    <option value="">Select language</option>
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <form className={styles.card}>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Question title"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      className={styles.input}
                      placeholder="Question description"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Difficulty</label>
                    <select className={styles.select} required>
                      <option value="">Select difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Answer</label>
                    <textarea
                      className={styles.input}
                      placeholder="Correct answer"
                      required
                    />
                  </div>
                  {/* Add more fields as needed */}
                  <div className="flex gap-4 mt-2">
                    <button type="submit" className={styles.button}>
                      Add Question
                    </button>
                    <button
                      type="button"
                      className={styles.button}
                      style={{ background: "#eee", color: "#444" }}
                      onClick={() => setQuestionLang("")}
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          {panel === "topics" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Add Topic</h2>
              {!topicLang ? (
                <div className={styles.card}>
                  <label className="block mb-2 font-medium">
                    Choose Language:
                  </label>
                  <select
                    className={styles.select}
                    value={topicLang}
                    onChange={(e) => setTopicLang(e.target.value)}
                  >
                    <option value="">Select language</option>
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <form className={styles.card}>
                  <div className={styles.formGroup}>
                    <label>Topic Name</label>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="Topic name"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                      className={styles.input}
                      placeholder="Topic description"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Difficulty</label>
                    <select className={styles.select} required>
                      <option value="">Select difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Questions</label>
                    <textarea
                      className={styles.input}
                      placeholder="Questions related to the topic"
                      required
                    />
                  </div>
                  <div className="flex gap-4 mt-2">
                    <button type="submit" className={styles.button}>
                      Add Topic
                    </button>
                    <button
                      type="button"
                      className={styles.button}
                      style={{ background: "#eee", color: "#444" }}
                      onClick={() => setTopicLang("")}
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
