"use client";

import { useState } from "react";
import { AdminField, AdminInput, AdminSection, AdminTextarea } from "@/components/admin/forms/AdminField";
import { PageLinkPicker } from "@/components/admin/forms/PageLinkPicker";
import { StringListEditor } from "@/components/admin/forms/LinkListEditor";
import { useAdminSave } from "@/components/admin/forms/SaveBar";
import { VisualFormShell } from "@/components/admin/VisualFormShell";
import { PageBlockPreview } from "@/components/admin/previews/BlockPreviews";
import { RichTextField } from "@/components/admin/forms/RichTextField";
import type {
  AboutPageData,
  BookMeetingPageData,
  CompareSickPageData,
  CtaBandData,
  CustomSolutionsPageData,
  FullStackPageData,
  PageCta,
  PageMeta,
} from "@/lib/cms/page-defaults";

type FormProps<T> = { initial: T; blockKey: string; label: string; group: string };

function PageFormShell({
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

function MetaFields({ meta, onChange }: { meta: PageMeta; onChange: (meta: PageMeta) => void }) {
  return (
    <>
      <AdminField label="Page title (browser tab & SEO)">
        <AdminInput value={meta.title} onChange={(e) => onChange({ ...meta, title: e.target.value })} />
      </AdminField>
      <AdminField label="Meta description">
        <AdminTextarea rows={3} value={meta.description} onChange={(e) => onChange({ ...meta, description: e.target.value })} />
      </AdminField>
    </>
  );
}

function CtaFields({ title, cta, onChange }: { title: string; cta: PageCta; onChange: (cta: PageCta) => void }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-3 text-sm font-semibold text-text">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <AdminField label="Button text">
          <AdminInput value={cta.label} onChange={(e) => onChange({ ...cta, label: e.target.value })} />
        </AdminField>
        <AdminField label="Button link">
          <PageLinkPicker value={cta.href} onChange={(href) => onChange({ ...cta, href })} />
        </AdminField>
      </div>
    </div>
  );
}

function CtaPairFields({
  title,
  primary,
  secondary,
  onPrimary,
  onSecondary,
}: {
  title: string;
  primary: PageCta;
  secondary?: PageCta;
  onPrimary: (cta: PageCta) => void;
  onSecondary?: (cta: PageCta) => void;
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

function CtaBandFields({ cta, onChange }: { cta: CtaBandData; onChange: (cta: CtaBandData) => void }) {
  return (
    <>
      <AdminField label="Headline">
        <AdminInput value={cta.title} onChange={(e) => onChange({ ...cta, title: e.target.value })} />
      </AdminField>
      <AdminField label="Body copy">
        <RichTextField rows={3} value={cta.body} onChange={(body) => onChange({ ...cta, body })} />
      </AdminField>
      <CtaPairFields
        title="Buttons"
        primary={cta.primary}
        secondary={cta.secondary}
        onPrimary={(primary) => onChange({ ...cta, primary })}
        onSecondary={cta.secondary ? (secondary) => onChange({ ...cta, secondary }) : undefined}
      />
    </>
  );
}

function useContentBlockSave<T>(blockKey: string, label: string, group: string, data: T) {
  return useAdminSave(async () => {
    const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, label, group }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
  });
}

export function AboutPageForm({ initial, blockKey, label, group }: FormProps<AboutPageData>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useContentBlockSave(blockKey, label, group, data);

  return (
    <PageFormShell blockKey={blockKey} data={data} save={save} status={status} error={error}>
      <AdminSection title="Search & social" description="How this page appears in Google and when shared.">
        <MetaFields meta={data.meta} onChange={(meta) => setData({ ...data, meta })} />
      </AdminSection>

      <AdminSection title="Hero">
        <AdminField label="Eyebrow">
          <AdminInput value={data.hero.eyebrow} onChange={(e) => setData({ ...data, hero: { ...data.hero, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} />
        </AdminField>
        <AdminField label="Lead paragraph">
          <RichTextField rows={4} value={data.hero.lead} onChange={(lead) => setData({ ...data, hero: { ...data.hero, lead } })} />
        </AdminField>
        <CtaFields
          title="Primary button"
          cta={data.hero.primaryCta}
          onChange={(primaryCta) => setData({ ...data, hero: { ...data.hero, primaryCta } })}
        />
      </AdminSection>

      <AdminSection title="Intro">
        <AdminField label="Eyebrow">
          <AdminInput value={data.intro.eyebrow} onChange={(e) => setData({ ...data, intro: { ...data.intro, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.intro.title} onChange={(e) => setData({ ...data, intro: { ...data.intro, title: e.target.value } })} />
        </AdminField>
        <AdminField label="First paragraph">
          <RichTextField rows={3} value={data.intro.body1} onChange={(body1) => setData({ ...data, intro: { ...data.intro, body1 } })} />
        </AdminField>
        <AdminField label="Second paragraph">
          <RichTextField rows={3} value={data.intro.body2} onChange={(body2) => setData({ ...data, intro: { ...data.intro, body2 } })} />
        </AdminField>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Stat value">
            <AdminInput value={data.intro.statValue} onChange={(e) => setData({ ...data, intro: { ...data.intro, statValue: e.target.value } })} />
          </AdminField>
          <AdminField label="Stat caption">
            <AdminInput value={data.intro.statCaption} onChange={(e) => setData({ ...data, intro: { ...data.intro, statCaption: e.target.value } })} />
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection title="Manufacturing">
        <AdminField label="Eyebrow">
          <AdminInput value={data.manufacturing.eyebrow} onChange={(e) => setData({ ...data, manufacturing: { ...data.manufacturing, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.manufacturing.title} onChange={(e) => setData({ ...data, manufacturing: { ...data.manufacturing, title: e.target.value } })} />
        </AdminField>
        <AdminField label="Lead">
          <RichTextField rows={3} value={data.manufacturing.lead} onChange={(lead) => setData({ ...data, manufacturing: { ...data.manufacturing, lead } })} />
        </AdminField>
        <AdminField label="Scale eyebrow">
          <AdminInput value={data.manufacturing.scaleEyebrow} onChange={(e) => setData({ ...data, manufacturing: { ...data.manufacturing, scaleEyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Scale title">
          <AdminInput value={data.manufacturing.scaleTitle} onChange={(e) => setData({ ...data, manufacturing: { ...data.manufacturing, scaleTitle: e.target.value } })} />
        </AdminField>
        <AdminField label="Scale body">
          <RichTextField rows={3} value={data.manufacturing.scaleBody} onChange={(scaleBody) => setData({ ...data, manufacturing: { ...data.manufacturing, scaleBody } })} />
        </AdminField>
        <AdminField label="Closing paragraph">
          <RichTextField rows={3} value={data.manufacturing.closing} onChange={(closing) => setData({ ...data, manufacturing: { ...data.manufacturing, closing } })} />
        </AdminField>
      </AdminSection>

      <AdminSection title="Stat cards">
        {data.statCards.map((card, i) => (
          <div key={i} className="mb-4 rounded-lg border border-border p-4">
            <p className="mb-2 text-sm font-semibold">Card {i + 1}</p>
            <AdminField label="Icon key" hint="e.g. factory, shield, compass, handshake">
              <AdminInput
                value={card.icon}
                onChange={(e) =>
                  setData({
                    ...data,
                    statCards: data.statCards.map((c, j) => (j === i ? { ...c, icon: e.target.value } : c)),
                  })
                }
              />
            </AdminField>
            <AdminField label="Title">
              <AdminInput
                value={card.title}
                onChange={(e) =>
                  setData({
                    ...data,
                    statCards: data.statCards.map((c, j) => (j === i ? { ...c, title: e.target.value } : c)),
                  })
                }
              />
            </AdminField>
            <AdminField label="Body">
              <RichTextField
                rows={2}
                value={card.body}
                onChange={(body) =>
                  setData({
                    ...data,
                    statCards: data.statCards.map((c, j) => (j === i ? { ...c, body } : c)),
                  })
                }
              />
            </AdminField>
          </div>
        ))}
      </AdminSection>

      <AdminSection title="How we work">
        <AdminField label="Eyebrow">
          <AdminInput value={data.howWeWork.eyebrow} onChange={(e) => setData({ ...data, howWeWork: { ...data.howWeWork, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.howWeWork.title} onChange={(e) => setData({ ...data, howWeWork: { ...data.howWeWork, title: e.target.value } })} />
        </AdminField>
        {data.howWeWork.cards.map((card, i) => (
          <div key={i} className="mb-4 rounded-lg border border-border p-4">
            <p className="mb-2 text-sm font-semibold">Card {i + 1}</p>
            <AdminField label="Title">
              <AdminInput
                value={card.title}
                onChange={(e) =>
                  setData({
                    ...data,
                    howWeWork: {
                      ...data.howWeWork,
                      cards: data.howWeWork.cards.map((c, j) => (j === i ? { ...c, title: e.target.value } : c)),
                    },
                  })
                }
              />
            </AdminField>
            <AdminField label="Body">
              <RichTextField
                rows={2}
                value={card.body}
                onChange={(body) =>
                  setData({
                    ...data,
                    howWeWork: {
                      ...data.howWeWork,
                      cards: data.howWeWork.cards.map((c, j) => (j === i ? { ...c, body } : c)),
                    },
                  })
                }
              />
            </AdminField>
          </div>
        ))}
        <AdminField label="Footer">
          <RichTextField rows={3} value={data.howWeWork.footer} onChange={(footer) => setData({ ...data, howWeWork: { ...data.howWeWork, footer } })} />
        </AdminField>
      </AdminSection>

      <AdminSection title="Bottom call-to-action">
        <CtaBandFields cta={data.cta} onChange={(cta) => setData({ ...data, cta })} />
      </AdminSection>
    </PageFormShell>
  );
}

export function CompareSickPageForm({ initial, blockKey, label, group }: FormProps<CompareSickPageData>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useContentBlockSave(blockKey, label, group, data);

  function updateRow(i: number, patch: Partial<CompareSickPageData["table"]["rows"][number]>) {
    setData({
      ...data,
      table: {
        ...data.table,
        rows: data.table.rows.map((row, j) => (j === i ? { ...row, ...patch } : row)),
      },
    });
  }

  return (
    <PageFormShell blockKey={blockKey} data={data} save={save} status={status} error={error}>
      <AdminSection title="Search & social">
        <MetaFields meta={data.meta} onChange={(meta) => setData({ ...data, meta })} />
      </AdminSection>

      <AdminSection title="Hero">
        <AdminField label="Eyebrow">
          <AdminInput value={data.hero.eyebrow} onChange={(e) => setData({ ...data, hero: { ...data.hero, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} />
        </AdminField>
        <AdminField label="Lead">
          <RichTextField rows={4} value={data.hero.lead} onChange={(lead) => setData({ ...data, hero: { ...data.hero, lead } })} />
        </AdminField>
        <CtaPairFields
          title="Hero buttons"
          primary={data.hero.primaryCta}
          secondary={data.hero.secondaryCta}
          onPrimary={(primaryCta) => setData({ ...data, hero: { ...data.hero, primaryCta } })}
          onSecondary={(secondaryCta) => setData({ ...data, hero: { ...data.hero, secondaryCta } })}
        />
      </AdminSection>

      <AdminSection title="Pillars">
        {data.pillars.map((pillar, i) => (
          <div key={i} className="mb-4 rounded-lg border border-border p-4">
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
              <RichTextField
                rows={2}
                value={pillar.body}
                onChange={(body) =>
                  setData({
                    ...data,
                    pillars: data.pillars.map((p, j) => (j === i ? { ...p, body } : p)),
                  })
                }
              />
            </AdminField>
          </div>
        ))}
      </AdminSection>

      <AdminSection title="Comparison table">
        <AdminField label="Eyebrow">
          <AdminInput value={data.table.eyebrow} onChange={(e) => setData({ ...data, table: { ...data.table, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.table.title} onChange={(e) => setData({ ...data, table: { ...data.table, title: e.target.value } })} />
        </AdminField>
        {data.table.rows.map((row, i) => (
          <div key={i} className="mb-4 grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
            <p className="col-span-full text-sm font-semibold">Row {i + 1}</p>
            <AdminField label="Spec label">
              <AdminInput value={row.spec} onChange={(e) => updateRow(i, { spec: e.target.value })} />
            </AdminField>
            <AdminField label="MorpheusTEK">
              <AdminInput value={row.mt} onChange={(e) => updateRow(i, { mt: e.target.value })} />
            </AdminField>
            <AdminField label="nanoScan3">
              <AdminInput value={row.nano} onChange={(e) => updateRow(i, { nano: e.target.value })} />
            </AdminField>
            <AdminField label="microScan3">
              <AdminInput value={row.micro} onChange={(e) => updateRow(i, { micro: e.target.value })} />
            </AdminField>
          </div>
        ))}
        <AdminField label="Footnote">
          <RichTextField rows={3} value={data.table.footnote} onChange={(footnote) => setData({ ...data, table: { ...data.table, footnote } })} />
        </AdminField>
      </AdminSection>

      <AdminSection title="Fleet economics">
        <AdminField label="Eyebrow">
          <AdminInput value={data.fleet.eyebrow} onChange={(e) => setData({ ...data, fleet: { ...data.fleet, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.fleet.title} onChange={(e) => setData({ ...data, fleet: { ...data.fleet, title: e.target.value } })} />
        </AdminField>
        <AdminField label="Body">
          <RichTextField rows={3} value={data.fleet.body} onChange={(body) => setData({ ...data, fleet: { ...data.fleet, body } })} />
        </AdminField>
        <AdminField label="Resource title">
          <AdminInput value={data.fleet.resourceTitle} onChange={(e) => setData({ ...data, fleet: { ...data.fleet, resourceTitle: e.target.value } })} />
        </AdminField>
        <AdminField label="Resource blurb">
          <RichTextField rows={2} value={data.fleet.resourceBlurb} onChange={(resourceBlurb) => setData({ ...data, fleet: { ...data.fleet, resourceBlurb } })} />
        </AdminField>
        <AdminField label="Resource link">
          <PageLinkPicker value={data.fleet.resourceHref} onChange={(resourceHref) => setData({ ...data, fleet: { ...data.fleet, resourceHref } })} />
        </AdminField>
      </AdminSection>

      <AdminSection title="Bottom call-to-action">
        <CtaBandFields cta={data.cta} onChange={(cta) => setData({ ...data, cta })} />
      </AdminSection>
    </PageFormShell>
  );
}

export function CustomSolutionsPageForm({ initial, blockKey, label, group }: FormProps<CustomSolutionsPageData>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useContentBlockSave(blockKey, label, group, data);

  return (
    <PageFormShell blockKey={blockKey} data={data} save={save} status={status} error={error}>
      <AdminSection title="Search & social">
        <MetaFields meta={data.meta} onChange={(meta) => setData({ ...data, meta })} />
      </AdminSection>

      <AdminSection title="Hero">
        <AdminField label="Eyebrow">
          <AdminInput value={data.hero.eyebrow} onChange={(e) => setData({ ...data, hero: { ...data.hero, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} />
        </AdminField>
        <AdminField label="Lead">
          <RichTextField rows={4} value={data.hero.lead} onChange={(lead) => setData({ ...data, hero: { ...data.hero, lead } })} />
        </AdminField>
        <CtaFields
          title="Primary button"
          cta={data.hero.primaryCta}
          onChange={(primaryCta) => setData({ ...data, hero: { ...data.hero, primaryCta } })}
        />
      </AdminSection>

      <AdminSection title="Services">
        {data.services.map((service, i) => (
          <div key={i} className="mb-4 rounded-lg border border-border p-4">
            <p className="mb-2 text-sm font-semibold">Service {i + 1}</p>
            <AdminField label="Icon key" hint="e.g. wrench, gauge, cable, cpu, blocks">
              <AdminInput
                value={service.icon}
                onChange={(e) =>
                  setData({
                    ...data,
                    services: data.services.map((s, j) => (j === i ? { ...s, icon: e.target.value } : s)),
                  })
                }
              />
            </AdminField>
            <AdminField label="Title">
              <AdminInput
                value={service.title}
                onChange={(e) =>
                  setData({
                    ...data,
                    services: data.services.map((s, j) => (j === i ? { ...s, title: e.target.value } : s)),
                  })
                }
              />
            </AdminField>
            <AdminField label="Body">
              <RichTextField
                rows={2}
                value={service.body}
                onChange={(body) =>
                  setData({
                    ...data,
                    services: data.services.map((s, j) => (j === i ? { ...s, body } : s)),
                  })
                }
              />
            </AdminField>
          </div>
        ))}
      </AdminSection>

      <AdminSection title="Manufacturing">
        <AdminField label="Eyebrow">
          <AdminInput value={data.manufacturing.eyebrow} onChange={(e) => setData({ ...data, manufacturing: { ...data.manufacturing, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.manufacturing.title} onChange={(e) => setData({ ...data, manufacturing: { ...data.manufacturing, title: e.target.value } })} />
        </AdminField>
        <AdminField label="Body">
          <RichTextField rows={4} value={data.manufacturing.body} onChange={(body) => setData({ ...data, manufacturing: { ...data.manufacturing, body } })} />
        </AdminField>
        <CtaFields
          title="Section button"
          cta={data.manufacturing.cta}
          onChange={(cta) => setData({ ...data, manufacturing: { ...data.manufacturing, cta } })}
        />
        <StringListEditor
          label="Bullet points"
          items={data.manufacturing.bullets}
          onChange={(bullets) => setData({ ...data, manufacturing: { ...data.manufacturing, bullets } })}
        />
      </AdminSection>

      <AdminSection title="Bottom call-to-action">
        <CtaBandFields cta={data.cta} onChange={(cta) => setData({ ...data, cta })} />
      </AdminSection>
    </PageFormShell>
  );
}

const BOOK_MEETING_INTENT_KEYS = ["trial", "engineer", "quote", "meeting"] as const;
const BOOK_MEETING_INTENT_LABELS: Record<(typeof BOOK_MEETING_INTENT_KEYS)[number], string> = {
  trial: "90-day trial",
  engineer: "Talk to an engineer",
  quote: "Get a quote",
  meeting: "Default (book a meeting)",
};

export function BookMeetingPageForm({ initial, blockKey, label, group }: FormProps<BookMeetingPageData>) {
  const [data, setData] = useState(initial);
  const { save, status, error } = useContentBlockSave(blockKey, label, group, data);

  return (
    <PageFormShell blockKey={blockKey} data={data} save={save} status={status} error={error}>
      <AdminSection title="Search & social">
        <MetaFields meta={data.meta} onChange={(meta) => setData({ ...data, meta })} />
      </AdminSection>

      <AdminSection title="Intent variants" description="Copy shown when visitors arrive via ?intent=trial, ?intent=engineer, etc.">
        {BOOK_MEETING_INTENT_KEYS.map((key) => {
          const intent = data.intents[key];
          if (!intent) return null;
          return (
            <div key={key} className="mb-4 rounded-lg border border-border p-4">
              <p className="mb-3 text-sm font-semibold text-text">{BOOK_MEETING_INTENT_LABELS[key]}</p>
              <AdminField label="Eyebrow">
                <AdminInput
                  value={intent.eyebrow}
                  onChange={(e) =>
                    setData({
                      ...data,
                      intents: { ...data.intents, [key]: { ...intent, eyebrow: e.target.value } },
                    })
                  }
                />
              </AdminField>
              <AdminField label="Title">
                <AdminInput
                  value={intent.title}
                  onChange={(e) =>
                    setData({
                      ...data,
                      intents: { ...data.intents, [key]: { ...intent, title: e.target.value } },
                    })
                  }
                />
              </AdminField>
              <AdminField label="Lead">
                <RichTextField
                  rows={3}
                  value={intent.lead}
                  onChange={(lead) =>
                    setData({
                      ...data,
                      intents: { ...data.intents, [key]: { ...intent, lead } },
                    })
                  }
                />
              </AdminField>
              <AdminField label="Submit button text">
                <AdminInput
                  value={intent.submit}
                  onChange={(e) =>
                    setData({
                      ...data,
                      intents: { ...data.intents, [key]: { ...intent, submit: e.target.value } },
                    })
                  }
                />
              </AdminField>
            </div>
          );
        })}
      </AdminSection>

      <AdminSection title="Process steps">
        {data.steps.map((step, i) => (
          <div key={i} className="mb-4 rounded-lg border border-border p-4">
            <p className="mb-2 text-sm font-semibold">Step {i + 1}</p>
            <AdminField label="Title">
              <AdminInput
                value={step.title}
                onChange={(e) =>
                  setData({
                    ...data,
                    steps: data.steps.map((s, j) => (j === i ? { ...s, title: e.target.value } : s)),
                  })
                }
              />
            </AdminField>
            <AdminField label="Body">
              <RichTextField
                rows={2}
                value={step.body}
                onChange={(body) =>
                  setData({
                    ...data,
                    steps: data.steps.map((s, j) => (j === i ? { ...s, body } : s)),
                  })
                }
              />
            </AdminField>
          </div>
        ))}
      </AdminSection>

      <AdminSection title="Trust bullets">
        <StringListEditor
          label="Sidebar trust points"
          items={data.trustBullets}
          onChange={(trustBullets) => setData({ ...data, trustBullets })}
        />
      </AdminSection>
    </PageFormShell>
  );
}

export function FullStackPageForm({ initial, blockKey, label, group }: FormProps<FullStackPageData>) {
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
    <PageFormShell blockKey={blockKey} data={data} save={save} status={status} error={error}>
      <AdminSection title="SEO & hero">
        <MetaFields meta={data.meta} onChange={(meta) => setData({ ...data, meta })} />
        <AdminField label="Eyebrow">
          <AdminInput value={data.hero.eyebrow} onChange={(e) => setData({ ...data, hero: { ...data.hero, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} />
        </AdminField>
        <AdminField label="Lead">
          <RichTextField rows={3} value={data.hero.lead} onChange={(lead) => setData({ ...data, hero: { ...data.hero, lead } })} />
        </AdminField>
        <CtaPairFields
          title="Hero buttons"
          primary={data.hero.primaryCta}
          secondary={data.hero.secondaryCta}
          onPrimary={(primaryCta) => setData({ ...data, hero: { ...data.hero, primaryCta } })}
          onSecondary={(secondaryCta) => setData({ ...data, hero: { ...data.hero, secondaryCta } })}
        />
      </AdminSection>

      <AdminSection title="Four stack layers">
        {data.layers.map((layer, i) => (
          <div key={i} className="mb-4 rounded-lg border border-border p-4">
            <p className="mb-2 text-sm font-semibold">Layer {i + 1}</p>
            <AdminField label="Title">
              <AdminInput
                value={layer.title}
                onChange={(e) =>
                  setData({ ...data, layers: data.layers.map((l, j) => (j === i ? { ...l, title: e.target.value } : l)) })
                }
              />
            </AdminField>
            <AdminField label="Body">
              <RichTextField
                rows={2}
                value={layer.body}
                onChange={(body) =>
                  setData({ ...data, layers: data.layers.map((l, j) => (j === i ? { ...l, body } : l)) })
                }
              />
            </AdminField>
            <AdminField label="Link">
              <PageLinkPicker
                value={layer.href}
                onChange={(href) =>
                  setData({ ...data, layers: data.layers.map((l, j) => (j === i ? { ...l, href } : l)) })
                }
              />
            </AdminField>
          </div>
        ))}
      </AdminSection>

      <AdminSection title="Perception stack chain">
        <AdminField label="Eyebrow">
          <AdminInput value={data.stack.eyebrow} onChange={(e) => setData({ ...data, stack: { ...data.stack, eyebrow: e.target.value } })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={data.stack.title} onChange={(e) => setData({ ...data, stack: { ...data.stack, title: e.target.value } })} />
        </AdminField>
        {data.stack.rows.map((row, i) => (
          <div key={i} className="mb-3 rounded-lg border border-border p-3">
            <AdminField label="Layer name">
              <AdminInput
                value={row.layer}
                onChange={(e) =>
                  setData({
                    ...data,
                    stack: { ...data.stack, rows: data.stack.rows.map((r, j) => (j === i ? { ...r, layer: e.target.value } : r)) },
                  })
                }
              />
            </AdminField>
            <AdminField label="What it does">
              <AdminInput
                value={row.does}
                onChange={(e) =>
                  setData({
                    ...data,
                    stack: { ...data.stack, rows: data.stack.rows.map((r, j) => (j === i ? { ...r, does: e.target.value } : r)) },
                  })
                }
              />
            </AdminField>
            <AdminField label="Note">
              <AdminInput
                value={row.note}
                onChange={(e) =>
                  setData({
                    ...data,
                    stack: { ...data.stack, rows: data.stack.rows.map((r, j) => (j === i ? { ...r, note: e.target.value } : r)) },
                  })
                }
              />
            </AdminField>
          </div>
        ))}
        <AdminField label="Footer quote">
          <RichTextField rows={2} value={data.stack.footer} onChange={(footer) => setData({ ...data, stack: { ...data.stack, footer } })} />
        </AdminField>
      </AdminSection>

      <AdminSection title="Value props">
        {data.valueProps.map((prop, i) => (
          <div key={i} className="mb-3 rounded-lg border border-border p-3">
            <AdminField label="Title">
              <AdminInput
                value={prop.title}
                onChange={(e) =>
                  setData({ ...data, valueProps: data.valueProps.map((p, j) => (j === i ? { ...p, title: e.target.value } : p)) })
                }
              />
            </AdminField>
            <AdminField label="Body">
              <RichTextField
                rows={2}
                value={prop.body}
                onChange={(body) =>
                  setData({ ...data, valueProps: data.valueProps.map((p, j) => (j === i ? { ...p, body } : p)) })
                }
              />
            </AdminField>
          </div>
        ))}
      </AdminSection>

      <AdminSection title="Bottom CTA">
        <CtaBandFields cta={data.cta} onChange={(cta) => setData({ ...data, cta })} />
      </AdminSection>
    </PageFormShell>
  );
}
