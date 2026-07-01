"use client";

import { AdminSplitLayout } from "@/components/admin/AdminSplitLayout";
import { SaveBar } from "@/components/admin/forms/SaveBar";

export function VisualFormShell({
  editor,
  preview,
  previewTitle,
  save,
  status,
  error,
}: {
  editor: React.ReactNode;
  preview: React.ReactNode;
  previewTitle?: string;
  save: () => void;
  status: "idle" | "saving" | "saved";
  error: string | null;
}) {
  return (
    <div className="space-y-6 pb-24">
      <AdminSplitLayout editor={editor} preview={preview} previewTitle={previewTitle} />
      <SaveBar onSave={save} status={status} error={error} />
    </div>
  );
}
