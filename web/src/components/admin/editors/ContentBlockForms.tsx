"use client";

import { useState } from "react";
import { AdminField, AdminInput, AdminSection, AdminTextarea } from "@/components/admin/forms/AdminField";
import { PageLinkPicker } from "@/components/admin/forms/PageLinkPicker";
import { StringListEditor } from "@/components/admin/forms/LinkListEditor";
import { SaveBar, useAdminSave } from "@/components/admin/forms/SaveBar";
import { VisualFormShell } from "@/components/admin/VisualFormShell";
import { PageBlockPreview } from "@/components/admin/previews/BlockPreviews";
import { RichTextField } from "@/components/admin/forms/RichTextField";

type Cta = { label: string; href: string };

function CtaPairEditor({
  title,
  primary,
  secondary,
  onPrimary,
  onSecondary,
}: {
  title: string;
  primary: Cta;
  secondary?: Cta;
  onPrimary: (cta: Cta) => void;
  onSecondary?: (cta: Cta) => void;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-3 text-sm font-semibold text-text">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminField label="Primary button text">
          <AdminInput value={primary.label} onChange={(e) => onPrimary({ ...primary, label: e.target.value })} />
        </AdminField>
        <AdminField label="Primary button link">
          <PageLinkPicker value={primary.href} onChange={(href) => onPrimary({ ...primary, href })} />
        </AdminField>
        {secondary && onSecondary ? (
          <>
            <AdminField label="Secondary button text">
              <AdminInput value={secondary.label} onChange={(e) => onSecondary({ ...secondary, label: e.target.value })} />
            </AdminField>
            <AdminField label="Secondary button link">
              <PageLinkPicker value={secondary.href} onChange={(href) => onSecondary({ ...secondary, href })} />
            </AdminField>
          </>
        ) : null}
      </div>
    </div>
  );
}

function BlockFormShell({
  children,
  blockKey,
  data,
  save,
  status,
  error,
}: {
  children: React.ReactNode;
  blockKey: string;
  data: unknown;
  save: () => void;
  status: "idle" | "saving" | "saved";
  error: string | null;
}) {
  return (
    <VisualFormShell
      editor={children}
      preview={<PageBlockPreview blockKey={blockKey} data={data} />}
      save={save}
      status={status}
      error={error}
    />
  );
}

function ContentFormShell({
  children,
  save,
  status,
  error,
}: {
  children: React.ReactNode;
  save: () => void;
  status: "idle" | "saving" | "saved";
  error: string | null;
}) {
  return (
    <div className="space-y-6 pb-24">
      {children}
      <SaveBar onSave={save} status={status} error={error} />
    </div>
  );
}

export function TopBarForm({ initial, blockKey, label, group }: FormProps<{ message: string; href: string; boothCta: string }>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <ContentFormShell save={save} status={status} error={error}>
      <AdminSection title="Yellow announcement bar" description="The strip above the main navigation on every page.">
        <AdminField label="Announcement text">
          <AdminInput value={data.message} onChange={(e) => setData({ ...data, message: e.target.value })} />
        </AdminField>
        <AdminField label="Link when clicked">
          <PageLinkPicker value={data.href} onChange={(href) => setData({ ...data, href })} />
        </AdminField>
        <AdminField label="Right-side link text">
          <AdminInput value={data.boothCta} onChange={(e) => setData({ ...data, boothCta: e.target.value })} />
        </AdminField>
      </AdminSection>
    </ContentFormShell>
  );
}

export function MetadataForm({
  initial,
  blockKey,
  label,
  group,
}: FormProps<{ titleDefault: string; titleTemplate: string; description: string; keywords: string[] }>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <ContentFormShell save={save} status={status} error={error}>
      <AdminSection title="Search & social previews" description="How the site appears in Google and when shared on social media.">
        <AdminField label="Default homepage title">
          <AdminInput value={data.titleDefault} onChange={(e) => setData({ ...data, titleDefault: e.target.value })} />
        </AdminField>
        <AdminField label="Page title format" hint="Use %s where the page name goes, e.g. “%s · MorpheusTEK”.">
          <AdminInput value={data.titleTemplate} onChange={(e) => setData({ ...data, titleTemplate: e.target.value })} />
        </AdminField>
        <AdminField label="Default site description">
          <AdminTextarea rows={3} value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
        </AdminField>
        <StringListEditor
          label="SEO keywords"
          items={data.keywords}
          onChange={(keywords) => setData({ ...data, keywords })}
          placeholder="robotics LiDAR"
        />
      </AdminSection>
    </ContentFormShell>
  );
}

export function CtaBandForm({
  initial,
  blockKey,
  label,
  group,
}: FormProps<{ eyebrow?: string; title: string; body: string; primary: Cta; secondary?: Cta }>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <BlockFormShell blockKey={blockKey} data={data} save={save} status={status} error={error}>
      <AdminSection title="Call-to-action band">
        {data.eyebrow !== undefined ? (
          <AdminField label="Eyebrow (small label above title)">
            <AdminInput value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} />
          </AdminField>
        ) : null}
        <AdminField label="Headline">
          <AdminInput value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </AdminField>
        <AdminField label="Body copy">
          <RichTextField rows={3} value={data.body} onChange={(body) => setData({ ...data, body })} />
        </AdminField>
        <CtaPairEditor
          title="Buttons"
          primary={data.primary}
          secondary={data.secondary}
          onPrimary={(primary) => setData({ ...data, primary })}
          onSecondary={data.secondary ? (secondary) => setData({ ...data, secondary }) : undefined}
        />
      </AdminSection>
    </BlockFormShell>
  );
}

export function TextSectionForm({
  initial,
  blockKey,
  label,
  group,
  title,
}: FormProps<{ eyebrow: string; title: string; body: string; configuredM?: number }> & { title: string }) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <BlockFormShell blockKey={blockKey} data={data} save={save} status={status} error={error}>
      <AdminSection title={title}>
        <AdminField label="Eyebrow">
          <AdminInput value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} />
        </AdminField>
        <AdminField label="Headline">
          <AdminInput value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </AdminField>
        <AdminField label="Body">
          <RichTextField rows={4} value={data.body} onChange={(body) => setData({ ...data, body })} />
        </AdminField>
        {"configuredM" in data && data.configuredM !== undefined ? (
          <AdminField label="Configured radius (meters)">
            <AdminInput
              type="number"
              step="0.1"
              value={data.configuredM}
              onChange={(e) => setData({ ...data, configuredM: Number(e.target.value) })}
            />
          </AdminField>
        ) : null}
      </AdminSection>
    </BlockFormShell>
  );
}

export function HeroForm({
  initial,
  blockKey,
  label,
  group,
}: FormProps<{
  headlineLine1: string;
  headlineAccent: string;
  headlineLine2: string;
  chips: string[];
  primaryCta: Cta;
  secondaryCta: Cta;
  scanLabel: string;
}>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <BlockFormShell blockKey={blockKey} data={data} save={save} status={status} error={error}>
      <AdminSection title="Homepage hero">
        <div className="grid gap-4 sm:grid-cols-3">
          <AdminField label="Headline line 1">
            <AdminInput value={data.headlineLine1} onChange={(e) => setData({ ...data, headlineLine1: e.target.value })} />
          </AdminField>
          <AdminField label="Accent word (yellow)">
            <AdminInput value={data.headlineAccent} onChange={(e) => setData({ ...data, headlineAccent: e.target.value })} />
          </AdminField>
          <AdminField label="Headline line 2">
            <AdminInput value={data.headlineLine2} onChange={(e) => setData({ ...data, headlineLine2: e.target.value })} />
          </AdminField>
        </div>
        <StringListEditor label="Badge chips (under headline)" items={data.chips} onChange={(chips) => setData({ ...data, chips })} />
        <AdminField label="3D scan label">
          <AdminInput value={data.scanLabel} onChange={(e) => setData({ ...data, scanLabel: e.target.value })} />
        </AdminField>
        <CtaPairEditor
          title="Hero buttons"
          primary={data.primaryCta}
          secondary={data.secondaryCta}
          onPrimary={(primaryCta) => setData({ ...data, primaryCta })}
          onSecondary={(secondaryCta) => setData({ ...data, secondaryCta })}
        />
      </AdminSection>
    </BlockFormShell>
  );
}

export function ShowsForm({ initial, blockKey, label, group }: FormProps<ShowsData>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  function updateShow(i: number, patch: Partial<ShowItem>) {
    setData({
      ...data,
      // Only one show can be "Next up" — marking one clears the flag on the rest.
      shows: data.shows.map((s, idx) => (idx === i ? { ...s, ...patch } : patch.next ? { ...s, next: false } : s)),
    });
  }

  return (
    <ContentFormShell save={save} status={status} error={error}>
      <AdminSection title="Shows page hero">
        <AdminField label="Eyebrow">
          <AdminInput value={data.hero.eyebrow} onChange={(e) => setData({ ...data, hero: { ...data.hero, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} />
        </AdminField>
        <AdminField label="Intro">
          <AdminTextarea rows={3} value={data.hero.lead} onChange={(e) => setData({ ...data, hero: { ...data.hero, lead: e.target.value } })} />
        </AdminField>
      </AdminSection>

      <AdminSection
        title="Trade shows"
        description="List each show MorpheusTEK will attend. Marking a show as “Next up” also rewrites the yellow announcement bar at the top of every page when you save."
      >
        {data.shows.map((show, i) => (
          <div key={i} className="mb-4 rounded-lg border border-border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminField label="Show name">
                <AdminInput value={show.name} onChange={(e) => updateShow(i, { name: e.target.value })} />
              </AdminField>
              <AdminField label="City">
                <AdminInput value={show.city} onChange={(e) => updateShow(i, { city: e.target.value })} />
              </AdminField>
              <AdminField label="When">
                <AdminInput value={show.when} onChange={(e) => updateShow(i, { when: e.target.value })} />
              </AdminField>
              <label className="flex items-center gap-2 self-end text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(show.next)}
                  onChange={(e) => updateShow(i, { next: e.target.checked })}
                />
                Mark as “Next up”
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setData({ ...data, shows: [...data.shows, { name: "", city: "", when: "" }] })}
          className="text-sm font-medium text-brand-blue hover:underline"
        >
          + Add another show
        </button>
      </AdminSection>

      <AdminSection title="Bottom call-to-action">
        <AdminField label="Eyebrow">
          <AdminInput value={data.cta.eyebrow} onChange={(e) => setData({ ...data, cta: { ...data.cta, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.cta.title} onChange={(e) => setData({ ...data, cta: { ...data.cta, title: e.target.value } })} />
        </AdminField>
        <AdminField label="Body">
          <AdminTextarea rows={2} value={data.cta.body} onChange={(e) => setData({ ...data, cta: { ...data.cta, body: e.target.value } })} />
        </AdminField>
        <CtaPairEditor
          title="Buttons"
          primary={data.cta.primary}
          secondary={data.cta.secondary}
          onPrimary={(primary) => setData({ ...data, cta: { ...data.cta, primary } })}
          onSecondary={(secondary) => setData({ ...data, cta: { ...data.cta, secondary } })}
        />
      </AdminSection>
    </ContentFormShell>
  );
}

export function GlossaryForm({ initial, blockKey, label, group }: FormProps<GlossaryData>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <ContentFormShell save={save} status={status} error={error}>
      <AdminSection title="Glossary page">
        <AdminField label="Page title">
          <AdminInput value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </AdminField>
        <AdminField label="Intro paragraph">
          <AdminTextarea rows={3} value={data.lead} onChange={(e) => setData({ ...data, lead: e.target.value })} />
        </AdminField>
      </AdminSection>
      <AdminSection title="Terms">
        {data.terms.map((t, i) => (
          <div key={i} className="mb-4 grid gap-3 border-b border-border pb-4 sm:grid-cols-[12rem_1fr]">
            <AdminField label="Term">
              <AdminInput value={t.term} onChange={(e) => setData({ ...data, terms: data.terms.map((x, j) => (j === i ? { ...x, term: e.target.value } : x)) })} />
            </AdminField>
            <AdminField label="Definition">
              <AdminTextarea rows={2} value={t.def} onChange={(e) => setData({ ...data, terms: data.terms.map((x, j) => (j === i ? { ...x, def: e.target.value } : x)) })} />
            </AdminField>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setData({ ...data, terms: [...data.terms, { term: "", def: "" }] })}
          className="text-sm font-medium text-brand-blue hover:underline"
        >
          + Add term
        </button>
      </AdminSection>
    </ContentFormShell>
  );
}

type FormProps<T> = { initial: T; blockKey: string; label: string; group: string };
type ShowItem = { name: string; city: string; when: string; next?: boolean };
type ShowsData = {
  hero: { eyebrow: string; title: string; lead: string };
  shows: ShowItem[];
  cta: { eyebrow: string; title: string; body: string; primary: Cta; secondary: Cta };
};
type GlossaryData = { title: string; lead: string; terms: { term: string; def: string }[] };

export function CertifyForm({
  initial,
  blockKey,
  label,
  group,
}: FormProps<{
  eyebrow: string;
  title: string;
  titleAccent: string;
  bodyLead: string;
  bodyFollow: string;
  configuredM: number;
}>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <ContentFormShell save={save} status={status} error={error}>
      <AdminSection title="Certify plot section">
        <AdminField label="Eyebrow">
          <AdminInput value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} />
        </AdminField>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Title">
            <AdminInput value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          </AdminField>
          <AdminField label="Title accent (blue)">
            <AdminInput value={data.titleAccent} onChange={(e) => setData({ ...data, titleAccent: e.target.value })} />
          </AdminField>
        </div>
        <AdminField label="First paragraph (after product name)">
          <AdminTextarea rows={3} value={data.bodyLead} onChange={(e) => setData({ ...data, bodyLead: e.target.value })} />
        </AdminField>
        <AdminField label="Second paragraph" hint="Use {configuredM} and {protectiveMax} as placeholders.">
          <AdminTextarea rows={3} value={data.bodyFollow} onChange={(e) => setData({ ...data, bodyFollow: e.target.value })} />
        </AdminField>
        <AdminField label="Configured radius (meters)">
          <AdminInput type="number" step="0.1" value={data.configuredM} onChange={(e) => setData({ ...data, configuredM: Number(e.target.value) })} />
        </AdminField>
      </AdminSection>
    </ContentFormShell>
  );
}

export function TrustBandForm({
  initial,
  blockKey,
  label,
  group,
}: FormProps<{
  eyebrow: string;
  title: string;
  titleAccent: string;
  body: string;
  compareLink: Cta;
  supplyEyebrow: string;
  supplyBody: string;
}>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <ContentFormShell save={save} status={status} error={error}>
      <AdminSection title="Trust band">
        <AdminField label="Eyebrow">
          <AdminInput value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </AdminField>
        <AdminField label="Title accent (blue)">
          <AdminInput value={data.titleAccent} onChange={(e) => setData({ ...data, titleAccent: e.target.value })} />
        </AdminField>
        <AdminField label="Body">
          <AdminTextarea rows={4} value={data.body} onChange={(e) => setData({ ...data, body: e.target.value })} />
        </AdminField>
        <CtaPairEditor title="Comparison link" primary={data.compareLink} onPrimary={(compareLink) => setData({ ...data, compareLink })} />
        <AdminField label="Supply row label">
          <AdminInput value={data.supplyEyebrow} onChange={(e) => setData({ ...data, supplyEyebrow: e.target.value })} />
        </AdminField>
        <AdminField label="Supply row body">
          <AdminTextarea rows={2} value={data.supplyBody} onChange={(e) => setData({ ...data, supplyBody: e.target.value })} />
        </AdminField>
      </AdminSection>
    </ContentFormShell>
  );
}

export function BuildToSpecForm({
  initial,
  blockKey,
  label,
  group,
}: FormProps<{
  eyebrow: string;
  title: string;
  body: string;
  pillars: { title: string; body: string }[];
  link: Cta;
}>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });

  return (
    <ContentFormShell save={save} status={status} error={error}>
      <AdminSection title="Build to spec section">
        <AdminField label="Eyebrow">
          <AdminInput value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </AdminField>
        <AdminField label="Body">
          <AdminTextarea rows={4} value={data.body} onChange={(e) => setData({ ...data, body: e.target.value })} />
        </AdminField>
        {data.pillars.map((pillar, i) => (
          <div key={i} className="rounded-lg border border-border p-4">
            <p className="mb-2 text-sm font-semibold">Pillar {i + 1}</p>
            <AdminField label="Title">
              <AdminInput
                value={pillar.title}
                onChange={(e) =>
                  setData({
                    ...data,
                    pillars: data.pillars.map((p, j) => (j === i ? { ...p, title: e.target.value } : p)),
                  })
                }
              />
            </AdminField>
            <AdminField label="Body">
              <AdminTextarea
                rows={2}
                value={pillar.body}
                onChange={(e) =>
                  setData({
                    ...data,
                    pillars: data.pillars.map((p, j) => (j === i ? { ...p, body: e.target.value } : p)),
                  })
                }
              />
            </AdminField>
          </div>
        ))}
        <CtaPairEditor title="Link to custom solutions" primary={data.link} onPrimary={(link) => setData({ ...data, link })} />
      </AdminSection>
    </ContentFormShell>
  );
}
