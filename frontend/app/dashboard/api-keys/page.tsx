"use client";

import { useEffect, useState } from "react";
import { createApiKey, getApiKeys, revokeApiKey } from "@/lib/api";
import { ApiKeyItem } from "@/lib/types";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [name, setName] = useState("Production key");
  const [newKey, setNewKey] = useState("");
  const [message, setMessage] = useState("");

  async function loadKeys() {
    try {
      setKeys(await getApiKeys());
    } catch {
      setMessage("Failed to load API keys.");
    }
  }

  useEffect(() => {
    loadKeys();
  }, []);

  async function onCreate() {
    try {
      const created = await createApiKey(name);
      setNewKey(created.key);
      setMessage("New API key created. Copy it now.");
      await loadKeys();
    } catch {
      setMessage("Failed to create API key.");
    }
  }

  async function onRevoke(id: number) {
    await revokeApiKey(id);
    await loadKeys();
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold text-white">API Keys</h1>
      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <p className="mb-2 text-sm text-slate-300">Create API key</p>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-md border border-white/10 bg-[#121922] px-3 py-2 text-white"
          />
          <button onClick={onCreate} className="rounded-md bg-[#f4de63] px-4 py-2 font-semibold text-[#1e2229]">
            Create
          </button>
        </div>
        {newKey && <p className="mt-2 break-all rounded bg-[#121922] p-2 text-xs text-[#f4de63]">{newKey}</p>}
        {message && <p className="mt-2 text-xs text-slate-300">{message}</p>}
      </div>

      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <p className="mb-2 text-sm font-semibold text-white">Existing keys</p>
        <div className="space-y-2">
          {keys.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-md bg-[#121922] p-3 text-sm">
              <span className="text-slate-200">
                {item.name} - {item.key_prefix}... - {item.scope}
              </span>
              <button className="text-red-400 hover:text-red-300" onClick={() => onRevoke(item.id)}>
                Revoke
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
