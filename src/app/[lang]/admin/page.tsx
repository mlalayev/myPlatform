"use client";
import React, { useState, useEffect } from "react";
import styles from "./AdminPanel.module.css";
import {
  FiUser,
  FiHome,
  FiUsers,
  FiBookOpen,
  FiLayers,
  FiEdit,
  FiMessageCircle,
  FiAward,
  FiSettings,
  FiTrash2,
  FiSearch,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

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
  { key: "users", label: "Users", icon: <FiUsers /> },
];

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  username?: string;
};

export default function AdminPanelPage() {
  const router = useRouter();
  const currentLang =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1] || "en"
      : "en";

  const [panel, setPanel] = useState("users");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topicLang, setTopicLang] = useState("");
  const [questionLang, setQuestionLang] = useState("");
  // Users panel UI state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [showCreate, setShowCreate] = useState(false);

  // Fetch users
  useEffect(() => {
    if (panel !== "users") return;
    setLoading(true);
    const params = new URLSearchParams({
      q: search,
      page: String(page),
      pageSize: String(pageSize),
      sortBy,
      sortDir,
    });
    fetch(`/api/admin/users?${params.toString()}`)
      .then(async (res) => {
        const json = await res.json();
        // Backward compatibility: API may return array for old path
        if (Array.isArray(json)) {
          setUsers(json);
          setTotal(json.length);
          return;
        }
        setUsers(json.data || []);
        setTotal(json.total || 0);
      })
      .catch(() => {
        setError("Failed to load users");
      })
      .finally(() => setLoading(false));
  }, [panel, search, sortBy, sortDir, page, pageSize]);

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
    const updated: { name: string; email: string; role: string; password?: string } = {
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
    let updatedUser: User;
    try {
      updatedUser = await res.json();
    } catch {
      setError("Failed to update user (invalid response)");
      setLoading(false);
      return;
    }
    if (!res.ok) {
      setError((updatedUser as any)?.error || "Failed to update user");
      setLoading(false);
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setEditUser(null);
    setLoading(false);
  };

  // Create user
  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: (formData.get("name") as string) || undefined,
      username: (formData.get("username") as string) || undefined,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: (formData.get("role") as string) || "USER",
    };
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json?.error || "Failed to create user");
      setLoading(false);
      return;
    }
    // Prepend and close
    setUsers((prev) => [json, ...prev]);
    setShowCreate(false);
    setLoading(false);
    // Reset to first page to ensure visibility
    setPage(1);
  };

  return (
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
              <span className={styles.sidebarItemIcon}>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
          <button
            className={styles.goBackButton}
            onClick={() => router.push(`/${currentLang}`)}
          >
            ← Go Back
          </button>
        </aside>
        <main className={styles.panelContent}>
          {/* Users is the only panel now */}
          {panel === "users" && (
            <div>
              {/* Hero header like profile */}
              <div className={styles.hero}>
                <div className={styles.heroLeft}>
                  <h2 className={styles.heroTitle}>Admin · Users</h2>
                  <p className={styles.heroSubtitle}>Manage members, roles and access in one place</p>
                </div>
                <div className={styles.heroActions}>
                  <div className={styles.searchWrap}>
                    <FiSearch className={styles.searchIcon} />
                    <input className={styles.searchInput} value={search} placeholder="Search users..." onChange={(e)=>{ setPage(1); setSearch(e.target.value); }} />
                  </div>
                  <button className={`${styles.button} ${styles.pill}`} onClick={() => setShowCreate(true)} style={{ background: '#fff', color: '#6c3fc5', border: 'none' }}><FiPlus /> New</button>
                </div>
              </div>

              {error && <div className="text-red-500 mb-2" style={{ marginTop: 8 }}>{error}</div>}

              {/* Users list cards */}
              <div className={styles.list}>
                {(loading ? Array.from({ length: 8 }) : users).map((u: any, i: number) => (
                  <div key={u?.id || i} className={styles.userCard}>
                    <div className={styles.avatarBubble}>{(u?.name || u?.email || 'U').toString().trim().charAt(0).toUpperCase()}</div>
                    <div>
                      <div className={styles.userMeta}>
                        <div className={styles.userName}>{loading ? '••••••••' : (u?.name || '—')}</div>
                        <div className={styles.userEmail}>{loading ? '••••@•••' : u?.email}</div>
                        {!loading && (
                          <div className={styles.chips}>
                            <span className={styles.chip}>ID: {u.id}</span>
                            <span className={styles.chip}>Username: {u.username || '—'}</span>
                            <span className={styles.roleBadge}>{u.role}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <button className={styles.iconBtn} title="Edit" onClick={() => handleEdit(u)}><FiEdit /></button>
                      <button className={styles.iconBtn} title="Delete" onClick={() => handleDelete(u.id)} style={{ color: '#d32f2f' }}><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
                {!loading && users.length === 0 && (
                  <div className={styles.card} style={{ alignItems: 'center', textAlign: 'center' }}>
                    No users found
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className={styles.paginationBar}>
                <div>Showing {(users.length && (page - 1) * pageSize + 1) || 0}-{(page - 1) * pageSize + users.length} of {total}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button disabled={page===1} className={styles.button} style={{ background: '#fff', color: '#374151', border: '1px solid #e5e7eb', opacity: page===1?0.6:1 }} onClick={()=> setPage(p=> Math.max(1, p-1))}><FiChevronLeft /> Prev</button>
                  <div>Page {page}</div>
                  <button disabled={(page*pageSize)>=total} className={styles.button} style={{ background: '#fff', color: '#374151', border: '1px solid #e5e7eb', opacity: (page*pageSize)>=total?0.6:1 }} onClick={()=> setPage(p=> p+1)}>Next <FiChevronRight /></button>
                </div>
              </div>
              {selectedUser && (
                <div className={styles.detailOverlay} onClick={() => setSelectedUser(null)}>
                  <div className={styles.detailModal} onClick={(e)=> e.stopPropagation()}>
                    <div className={styles.detailHeader}>
                      <div className={styles.detailHeaderInner}>
                        <div className={styles.detailAvatar}>
                          {(selectedUser.name || selectedUser.email || 'U').toString().trim().charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.detailTitleWrap}>
                          <h3 className={styles.detailName}>{selectedUser.name || '—'}</h3>
                          <p className={styles.detailSub}>{selectedUser.email}</p>
                        </div>
                      </div>
                      <div className={styles.detailRole}>{selectedUser.role}</div>
                    </div>
                    <div className={styles.detailBody}>
                      <div className={styles.detailChips}>
                        <span className={styles.detailChip}>ID: {selectedUser.id}</span>
                        <span className={styles.detailChip}>Username: {selectedUser.username || '—'}</span>
                      </div>
                      <div className={styles.detailRows}>
                        <div className={styles.detailRow}>
                          <div className={styles.detailRowLabel}>Name</div>
                          <div className={styles.detailRowValue}>{selectedUser.name || '—'}</div>
                        </div>
                        <div className={styles.detailRow}>
                          <div className={styles.detailRowLabel}>Email</div>
                          <div className={styles.detailRowValue}>{selectedUser.email}</div>
                        </div>
                        <div className={styles.detailRow}>
                          <div className={styles.detailRowLabel}>Role</div>
                          <div className={styles.detailRowValue}>{selectedUser.role}</div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.detailActions}>
                      <button className={styles.btnGhost} onClick={() => setSelectedUser(null)}>Close</button>
                      <button className={styles.btnDanger} onClick={() => { handleDelete(selectedUser.id); setSelectedUser(null); }}>Delete User</button>
                    </div>
                  </div>
                </div>
              )}
              {editUser && (
                <div className={styles.detailOverlay}>
                  <div className={styles.detailModal}>
                    <div className={styles.detailHeader}>
                      <div className={styles.detailHeaderInner}>
                        <div className={styles.detailAvatar}>{(editUser.name || editUser.email || 'U').toString().trim().charAt(0).toUpperCase()}</div>
                        <div className={styles.detailTitleWrap}>
                          <h3 className={styles.detailName}>Edit User</h3>
                          <p className={styles.detailSub}>Update user information</p>
                        </div>
                      </div>
                      <div className={styles.detailRole}>{editUser.role}</div>
                    </div>
                    <form id="edit-user-form" onSubmit={handleEditSubmit}>
                      <div className={styles.editBody}>
                        <div className={styles.formGrid}>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Name</label>
                            <input name="name" defaultValue={editUser.name} className={styles.formInput} required />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Email</label>
                            <input name="email" defaultValue={editUser.email} className={styles.formInput} required />
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>Role</label>
                            <select name="role" defaultValue={editUser.role} className={styles.formSelect} required>
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </div>
                          <div className={styles.formField}>
                            <label className={styles.formLabel}>New Password (optional)</label>
                            <input name="password" type="password" className={styles.formInput} placeholder="Leave blank to keep current password" />
                            <span className={styles.formHint}>Strong passwords are at least 8 characters and include a number</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.detailActions}>
                        <button type="button" className={styles.btnGhost} onClick={() => setEditUser(null)}>Cancel</button>
                        <button type="submit" form="edit-user-form" className={styles.button}>Save</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Create User Modal */}
              {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-0 overflow-hidden animate-fadeIn">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-6 pt-6 pb-2 border-b">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <FiUser className="text-purple-600 text-xl" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900">Create User</div>
                        <div className="text-gray-500 text-sm">Add a new user</div>
                      </div>
                    </div>
                    <form id="create-user-form" onSubmit={handleCreateSubmit} className="px-6 py-4 flex flex-col gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input name="name" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Username</label>
                        <input name="username" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input name="email" type="email" required className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input name="password" type="password" required className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Role</label>
                        <select name="role" defaultValue="USER" className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200">
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                    </form>
                    <div className="flex items-center justify-end gap-2 px-6 pb-6 pt-2 border-t bg-gray-50">
                      <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition">Cancel</button>
                      <button type="submit" form="create-user-form" className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition">Create</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Other panels removed as requested */}
        </main>
      </div>
  );
}
