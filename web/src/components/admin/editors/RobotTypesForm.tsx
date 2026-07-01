"use client";

import { useState } from "react";
import { AdminField, AdminSection } from "@/components/admin/forms/AdminField";
import { StringListEditor } from "@/components/admin/forms/LinkListEditor";
import { SaveBar, useAdminSave } from "@/components/admin/forms/SaveBar";

export function RobotTypesForm({
  initial,
  blockKey,
  label,
  group,
}: {
  initial: string[];
  blockKey: string;
  label: string;
  group: string;
}) {
  const [options, setOptions] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: options, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <div className="space-y-6 pb-24">
      <AdminSection title="Book-a-meeting form" description="Options in the “What are you building?” dropdown.">
        <StringListEditor
          label="Robot / platform types"
          items={options}
          onChange={setOptions}
          placeholder="AMR"
        />
      </AdminSection>
      <SaveBar onSave={save} status={status} error={error} />
    </div>
  );
}
