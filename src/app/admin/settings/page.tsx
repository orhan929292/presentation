"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Settings, Palette, Image } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState({
    logo_url: "",
    primary_color: "",
    accent_color: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user as any)?.role !== "ADMIN") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchSettings();
    }
  }, [status, session, router]);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/settings");
      setSettings(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/settings", settings);
      alert("Ayarlar kaydedildi!");
    } catch (err) {
      alert("Hata: Ayarlar kaydedilemedi.");
    }
  };

  if (loading) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#1a472a]">Admin Paneli - Sistem Ayarları</h1>

        <form onSubmit={handleSave} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div className="flex items-center gap-4 border-b pb-4">
            <Image className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Logo URL</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-[#1a472a] focus:border-[#1a472a]"
                value={settings.logo_url}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
              />
            </div>
            {settings.logo_url && (
              <img src={settings.logo_url} alt="Current logo" className="h-12 w-auto object-contain" />
            )}
          </div>

          <div className="flex items-center gap-4 border-b pb-4">
            <Palette className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Birincil Renk (Sidebar vs)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="mt-1 h-10 w-20"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                />
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-[#1a472a] focus:border-[#1a472a]"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b pb-4">
            <Palette className="text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Vurgu Rengi</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="mt-1 h-10 w-20"
                  value={settings.accent_color}
                  onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                />
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-[#1a472a] focus:border-[#1a472a]"
                  value={settings.accent_color}
                  onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1a472a] text-white py-3 px-4 rounded-md hover:bg-[#2a573a] transition-colors"
          >
            Tüm Ayarları Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
