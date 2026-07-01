import { SiteSettingsEditor } from "./SiteSettingsEditor";
import { getSiteSettings, type EditableSiteSettings } from "@/lib/cms";

export default async function AdminSitePage() {
  const settings = await getSiteSettings();
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-h3 font-bold uppercase text-text-strong">Site & navigation</h2>
        <p className="mt-2 text-sm text-text-muted">
          Edit contact info, homepage messaging, menus, footer links, and button labels — no code required.
        </p>
      </div>
      <SiteSettingsEditor initial={structuredClone(settings) as unknown as EditableSiteSettings} />
    </div>
  );
}
