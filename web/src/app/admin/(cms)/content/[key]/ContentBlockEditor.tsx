"use client";

import {
  BuildToSpecForm,
  CertifyForm,
  CtaBandForm,
  GlossaryForm,
  HeroForm,
  MetadataForm,
  ShowsForm,
  TextSectionForm,
  TopBarForm,
  TrustBandForm,
} from "@/components/admin/editors/ContentBlockForms";
import { RobotTypesForm } from "@/components/admin/editors/RobotTypesForm";
import {
  AboutPageForm,
  BookMeetingPageForm,
  CompareSickPageForm,
  CustomSolutionsPageForm,
  FullStackPageForm,
} from "@/components/admin/editors/SecondaryPageForms";
import { AdminSection } from "@/components/admin/forms/AdminField";
import { JsonEditor } from "@/components/admin/JsonEditor";

const props = (blockKey: string, label: string, group: string) => ({ blockKey, label, group });

export function ContentBlockEditor({
  blockKey,
  label,
  group,
  initial,
}: {
  blockKey: string;
  label: string;
  group: string;
  initial: unknown;
}) {
  const p = props(blockKey, label, group);

  switch (blockKey) {
    case "site.settings":
      return (
        <AdminSection title="Use Site & nav instead" description="Company settings and navigation are edited on the dedicated Site & nav page for a simpler experience.">
          <a href="/admin/site" className="text-sm font-semibold text-brand-blue hover:underline">
            Go to Site & nav →
          </a>
        </AdminSection>
      );
    case "layout.topbar":
      return <TopBarForm initial={initial as Parameters<typeof TopBarForm>[0]["initial"]} {...p} />;
    case "layout.metadata":
      return <MetadataForm initial={initial as Parameters<typeof MetadataForm>[0]["initial"]} {...p} />;
    case "homepage.hero":
      return <HeroForm initial={initial as Parameters<typeof HeroForm>[0]["initial"]} {...p} />;
    case "homepage.certify":
      return <CertifyForm initial={initial as Parameters<typeof CertifyForm>[0]["initial"]} {...p} />;
    case "homepage.category_browse":
      return <TextSectionForm initial={initial as Parameters<typeof TextSectionForm>[0]["initial"]} title="Category browse section" {...p} />;
    case "homepage.trust_band":
      return <TrustBandForm initial={initial as Parameters<typeof TrustBandForm>[0]["initial"]} {...p} />;
    case "homepage.build_to_spec":
      return <BuildToSpecForm initial={initial as Parameters<typeof BuildToSpecForm>[0]["initial"]} {...p} />;
    case "homepage.range_ledger":
    case "homepage.assembly":
      return (
        <TextSectionForm
          initial={initial as { eyebrow: string; title: string; body: string }}
          title={label}
          {...p}
        />
      );
    case "homepage.cta_band":
      return <CtaBandForm initial={initial as Parameters<typeof CtaBandForm>[0]["initial"]} {...p} />;
    case "page.shows":
      return <ShowsForm initial={initial as Parameters<typeof ShowsForm>[0]["initial"]} {...p} />;
    case "page.glossary":
      return <GlossaryForm initial={initial as Parameters<typeof GlossaryForm>[0]["initial"]} {...p} />;
    case "forms.robot_types":
      return <RobotTypesForm initial={initial as string[]} {...p} />;
    case "page.about":
      return <AboutPageForm initial={initial as Parameters<typeof AboutPageForm>[0]["initial"]} {...p} />;
    case "page.compare.sick":
      return <CompareSickPageForm initial={initial as Parameters<typeof CompareSickPageForm>[0]["initial"]} {...p} />;
    case "page.custom_solutions":
      return <CustomSolutionsPageForm initial={initial as Parameters<typeof CustomSolutionsPageForm>[0]["initial"]} {...p} />;
    case "page.book_meeting":
      return <BookMeetingPageForm initial={initial as Parameters<typeof BookMeetingPageForm>[0]["initial"]} {...p} />;
    case "page.full_stack":
      return <FullStackPageForm initial={initial as Parameters<typeof FullStackPageForm>[0]["initial"]} {...p} />;
    default:
      return <UnsupportedBlock blockKey={blockKey} label={label} group={group} initial={initial} />;
  }
}

function UnsupportedBlock({
  blockKey,
  label,
  group,
  initial,
}: {
  blockKey: string;
  label: string;
  group: string;
  initial: unknown;
}) {
  const data = initial as Record<string, unknown> | null;
  const hasTextSection =
    data &&
    typeof data === "object" &&
    typeof data.title === "string" &&
    typeof data.body === "string" &&
    typeof data.eyebrow === "string";

  if (hasTextSection) {
    return (
      <TextSectionForm
        initial={data as { eyebrow: string; title: string; body: string }}
        blockKey={blockKey}
        label={label}
        group={group}
        title={label}
      />
    );
  }

  return (
    <div className="space-y-4">
      <AdminSection
        title="Developer-assisted section"
        description="This section has custom layout (charts, animations, or product pickers). You can still edit the stored copy below, or ask Stackked for a friendlier editor."
      >
        <p className="text-sm text-text-muted">
          Section: <span className="font-medium text-text">{label}</span>
        </p>
      </AdminSection>
      <JsonEditor
        initial={JSON.stringify(initial ?? {}, null, 2)}
        onSave={async (parsed) => {
          const res = await fetch(`/api/admin/content-blocks/${encodeURIComponent(blockKey)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: parsed, label, group }),
          });
          if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
        }}
      />
    </div>
  );
}
