"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserPlus, Trash2, Edit } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "USER" });

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user as any)?.role !== "ADMIN") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/users", newUser);
      setIsAdding(false);
      setNewUser({ name: "", email: "", password: "", role: "USER" });
      fetchUsers();
    } catch (err) {
      alert("Hata: Kullanıcı eklenemedi.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert("Hata: Kullanıcı silinemedi.");
      }
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#1a472a]">Admin Paneli - Kullanıcı Yönetimi</h1>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="mb-6 flex items-center gap-2 bg-[#1a472a] text-white px-4 py-2 rounded hover:bg-[#2a573a]"
        >
          <UserPlus size={20} /> Yeni Kullanıcı Ekle
        </button>

        {isAdding && (
          <form onSubmit={handleAddUser} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              className="border p-2 rounded"
              placeholder="Ad Soyad"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="E-posta"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="Şifre"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            <select
              className="border p-2 rounded"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button type="submit" className="bg-green-600 text-white p-2 rounded md:col-span-4">Ekle</button>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Ad Soyad</th>
                <th className="p-4">E-posta</th>
                <th className="p-4">Rol</th>
                <th className="p-4">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
