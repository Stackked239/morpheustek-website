"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { AdminField, AdminInput, AdminSection, AdminSelect, AdminTextarea } from "@/components/admin/forms/AdminField";
import { RichTextField } from "@/components/admin/forms/RichTextField";
import { KeyValueListEditor, StringListEditor } from "@/components/admin/forms/LinkListEditor";
import { PageLinkPicker } from "@/components/admin/forms/PageLinkPicker";
import { BlogFeaturedImageField } from "@/components/admin/editors/BlogFeaturedImageField";
import {
  BLOG_SECTION_LABELS,
  createSection,
  type BlogArticleForm,
  type BlogSection,
  type BlogSectionType,
} from "@/lib/cms/blog-template";

function CtaPair({
  primary,
  secondary,
  onPrimary,
  onSecondary,
}: {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  onPrimary: (v: { label: string; href: string }) => void;
  onSecondary: (v: { label: string; href: string }) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-border p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">Primary button (yellow)</p>
        <div className="space-y-3">
          <AdminField label="Button text">
            <AdminInput value={primary.label} onChange={(e) => onPrimary({ ...primary, label: e.target.value })} />
          </AdminField>
          <AdminField label="Link">
            <PageLinkPicker value={primary.href} onChange={(href) => onPrimary({ ...primary, href })} />
          </AdminField>
        </div>
      </div>
      <div className="rounded-lg border border-border p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">Secondary link</p>
        <div className="space-y-3">
          <AdminField label="Link text">
            <AdminInput value={secondary.label} onChange={(e) => onSecondary({ ...secondary, label: e.target.value })} />
          </AdminField>
          <AdminField label="Link">
            <PageLinkPicker value={secondary.href} onChange={(href) => onSecondary({ ...secondary, href })} />
          </AdminField>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  section,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  section: BlogSection;
  index: number;
  total: number;
  onChange: (section: BlogSection) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const label = BLOG_SECTION_LABELS[section.type];

  return (
    <div className="rounded-lg border border-border bg-bg-muted/40">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-blue">{label}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            className="rounded p-1.5 text-text-muted hover:bg-bg disabled:opacity-30"
            aria-label="Move up"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            className="rounded p-1.5 text-text-muted hover:bg-bg disabled:opacity-30"
            aria-label="Move down"
          >
            <ChevronDown className="size-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1.5 text-danger hover:bg-bg"
            aria-label="Remove section"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {section.type === "paragraph" ? (
          <AdminField label="Paragraph text">
            <RichTextField rows={4} value={section.text} onChange={(text) => onChange({ ...section, text })} />
          </AdminField>
        ) : null}

        {section.type === "heading2" || section.type === "heading3" ? (
          <AdminField label={section.type === "heading2" ? "Section title" : "Subsection title"}>
            <AdminInput value={section.text} onChange={(e) => onChange({ ...section, text: e.target.value })} />
          </AdminField>
        ) : null}

        {section.type === "quote" ? (
          <>
            <AdminField label="Quote text">
              <AdminTextarea rows={3} value={section.text} onChange={(e) => onChange({ ...section, text: e.target.value })} />
            </AdminField>
            <AdminField label="Attribution" hint="Who said it, or a short context line.">
              <AdminInput value={section.attribution} onChange={(e) => onChange({ ...section, attribution: e.target.value })} placeholder="— Safety engineer's checklist" />
            </AdminField>
          </>
        ) : null}

        {section.type === "divider" ? (
          <p className="text-sm text-text-muted">A horizontal line separating major parts of the article.</p>
        ) : null}

        {section.type === "bullets" ? (
          <StringListEditor
            label="Bullet points"
            items={section.items}
            onChange={(items) => onChange({ ...section, items: items.length ? items : [""] })}
            placeholder="One benefit or fact per line"
          />
        ) : null}

        {section.type === "specs" ? (
          <KeyValueListEditor
            label="Spec rows"
            items={section.rows}
            onChange={(rows) => onChange({ ...section, rows: rows.length ? rows : [{ label: "", value: "" }] })}
          />
        ) : null}

        {section.type === "callout" ? (
          <>
            <AdminField label="Highlight title" hint="Short label shown in blue above the box.">
              <AdminInput value={section.title} onChange={(e) => onChange({ ...section, title: e.target.value })} />
            </AdminField>
            <AdminField label="Highlight body">
              <AdminTextarea rows={3} value={section.body} onChange={(e) => onChange({ ...section, body: e.target.value })} />
            </AdminField>
          </>
        ) : null}

        {section.type === "steps" ? (
          <div className="space-y-4">
            {section.items.map((step, i) => (
              <div key={i} className="rounded-lg border border-border bg-bg p-4">
                <p className="mb-3 text-xs font-semibold text-text-muted">Step {i + 1}</p>
                <div className="grid gap-3 sm:grid-cols-[4rem_1fr]">
                  <AdminField label="Number">
                    <AdminInput
                      value={step.num}
                      onChange={(e) =>
                        onChange({
                          ...section,
                          items: section.items.map((s, j) => (j === i ? { ...s, num: e.target.value } : s)),
                        })
                      }
                      placeholder="01"
                    />
                  </AdminField>
                  <AdminField label="Step title">
                    <AdminInput
                      value={step.title}
                      onChange={(e) =>
                        onChange({
                          ...section,
                          items: section.items.map((s, j) => (j === i ? { ...s, title: e.target.value } : s)),
                        })
                      }
                    />
                  </AdminField>
                </div>
                <AdminField label="Step description" className="mt-3">
                  <AdminTextarea
                    rows={2}
                    value={step.body}
                    onChange={(e) =>
                      onChange({
                        ...section,
                        items: section.items.map((s, j) => (j === i ? { ...s, body: e.target.value } : s)),
                      })
                    }
                  />
                </AdminField>
                {section.items.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => onChange({ ...section, items: section.items.filter((_, j) => j !== i) })}
                    className="mt-2 text-xs font-medium text-danger hover:underline"
                  >
                    Remove step
                  </button>
                ) : null}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...section,
                  items: [...section.items, { num: String(section.items.length + 1).padStart(2, "0"), title: "", body: "" }],
                })
              }
              className="text-sm font-medium text-brand-blue hover:underline"
            >
              + Add step
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function BlogArticleFormEditor({
  form,
  onChange,
  slug,
}: {
  form: BlogArticleForm;
  onChange: React.Dispatch<React.SetStateAction<BlogArticleForm>>;
  slug: string;
}) {
  function patch<K extends keyof BlogArticleForm>(key: K, value: BlogArticleForm[K]) {
    onChange({ ...form, [key]: value });
  }

  function updateSection(i: number, section: BlogSection) {
    patch("sections", form.sections.map((s, idx) => (idx === i ? section : s)));
  }

  function removeSection(i: number) {
    const next = form.sections.filter((_, idx) => idx !== i);
    patch("sections", next.length ? next : [createSection("paragraph")]);
  }

  function moveSection(i: number, dir: -1 | 1) {
    const next = [...form.sections];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    patch("sections", next);
  }

  function addSection(type: BlogSectionType) {
    patch("sections", [...form.sections, createSection(type)]);
  }

  return (
    <div className="space-y-6">
      <AdminSection
        title="Article labels"
        description="Small tags shown under the title on the published article — category, read time, and series name."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <AdminField label="Category">
            <AdminInput
              value={form.meta.category}
              onChange={(e) => patch("meta", { ...form.meta, category: e.target.value })}
              placeholder="Safety LiDAR"
            />
          </AdminField>
          <AdminField label="Read time">
            <AdminInput
              value={form.meta.readTime}
              onChange={(e) => patch("meta", { ...form.meta, readTime: e.target.value })}
              placeholder="12 min"
            />
          </AdminField>
          <AdminField label="Series name">
            <AdminInput
              value={form.meta.series}
              onChange={(e) => patch("meta", { ...form.meta, series: e.target.value })}
              placeholder="Eyes at the Edge · Vol. 01"
            />
          </AdminField>
        </div>
      </AdminSection>

      <AdminSection
        title="Featured image"
        description="Shown large in the article header, as the thumbnail on the blog index, and as the social-share image. Optional — posts without one render text-only."
      >
        <BlogFeaturedImageField
          slug={slug}
          image={form.meta.image}
          imageAlt={form.meta.imageAlt}
          onChange={(imagePatch) => onChange((prev) => ({ ...prev, meta: { ...prev.meta, ...imagePatch } }))}
        />
      </AdminSection>

      <AdminSection
        title="Opening hook"
        description="The large intro paragraph under the headline — sets the tone before the main article body."
      >
        <AdminField label="Opening paragraph">
          <RichTextField rows={4} value={form.lede} onChange={(lede) => patch("lede", lede)} />
        </AdminField>
      </AdminSection>

      <AdminSection
        title="Article body"
        description="Build the article section by section. Add blocks in the order they should appear."
      >
        <div className="space-y-4">
          {form.sections.map((section, i) => (
            <SectionCard
              key={section.id}
              section={section}
              index={i}
              total={form.sections.length}
              onChange={(s) => updateSection(i, s)}
              onRemove={() => removeSection(i)}
              onMove={(dir) => moveSection(i, dir)}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <AdminSelect
            defaultValue=""
            onChange={(e) => {
              const type = e.target.value as BlogSectionType;
              if (type) addSection(type);
              e.target.value = "";
            }}
            className="max-w-xs"
          >
            <option value="">+ Add content block…</option>
            {(Object.entries(BLOG_SECTION_LABELS) as [BlogSectionType, string][]).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </AdminSelect>
        </div>
      </AdminSection>

      <AdminSection title="Key takeaways" description="Summary bullets at the end of the article.">
        <StringListEditor
          label="Takeaway points"
          items={form.takeaways}
          onChange={(items) => patch("takeaways", items.length ? items : [""])}
          placeholder="One key lesson per line"
        />
      </AdminSection>

      <AdminSection title="Closing buttons" description="Call-to-action buttons at the bottom of the article.">
        <CtaPair
          primary={form.cta.primary}
          secondary={form.cta.secondary}
          onPrimary={(primary) => patch("cta", { ...form.cta, primary })}
          onSecondary={(secondary) => patch("cta", { ...form.cta, secondary })}
        />
      </AdminSection>
    </div>
  );
}
