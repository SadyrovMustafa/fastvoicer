"use client";

import { useEffect, useState } from "react";
import { getWorkspace, inviteMember } from "@/lib/api";
import { WorkspaceData } from "@/lib/types";

export default function TeamPage() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member" | "billing_admin">("member");
  const [message, setMessage] = useState("");

  async function loadWorkspace() {
    try {
      setWorkspace(await getWorkspace());
    } catch {
      setMessage("Failed to load team.");
    }
  }

  useEffect(() => {
    loadWorkspace();
  }, []);

  async function onInvite() {
    try {
      const response = await inviteMember(email, role);
      setMessage(response.message);
      setEmail("");
      await loadWorkspace();
    } catch {
      setMessage("Invite failed.");
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold text-white">Team Workspace</h1>
      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <p className="text-sm text-slate-300">Workspace</p>
        <p className="text-xl font-semibold text-white">{workspace?.name ?? "..."}</p>
        <p className="text-sm text-slate-300">Seats: {workspace?.seat_count ?? "-"}</p>
      </div>
      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <p className="mb-2 text-sm text-slate-300">Invite member</p>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-white/10 bg-[#121922] px-3 py-2 text-white"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as "admin" | "member" | "billing_admin")}
            className="rounded-md border border-white/10 bg-[#121922] px-3 py-2 text-white"
          >
            <option value="member">member</option>
            <option value="admin">admin</option>
            <option value="billing_admin">billing_admin</option>
          </select>
          <button onClick={onInvite} className="rounded-md bg-[#f4de63] px-4 py-2 font-semibold text-[#1e2229]">
            Send invite
          </button>
        </div>
        {message && <p className="mt-2 text-xs text-slate-300">{message}</p>}
      </div>
      <div className="rounded-lg border border-white/10 bg-[#1b2430] p-4">
        <p className="mb-2 text-sm font-semibold text-white">Members</p>
        <div className="space-y-2">
          {workspace?.members?.map((member) => (
            <div key={member.user_id} className="rounded-md bg-[#121922] p-3 text-sm text-slate-200">
              {member.full_name} ({member.email}) - {member.role}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
