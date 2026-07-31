import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface TargetConfig {
  table: string;
  column: string;
}

interface CleanupConfig {
  bucket: string;
  targets: TargetConfig[];
}

interface ReportDetail {
  deleted: string[];
  errors: unknown;
}

const CLEANUP_CONFIG: CleanupConfig[] = [
  {
    bucket: "hero-images",
    targets: [{ table: "HeroConfig", column: "bgUrl" }],
  },
  { bucket: "stat-images", targets: [{ table: "Stat", column: "iconSrc" }] },
  {
    bucket: "profile-images",
    targets: [{ table: "ProfileConfig", column: "avatarUrl" }],
  },
  {
    bucket: "expertise-images",
    targets: [{ table: "Expertise", column: "icon" }],
  },
  {
    bucket: "services-images",
    targets: [{ table: "ServiceItem", column: "img" }],
  },
  {
    bucket: "media-core",
    targets: [
      { table: "NavbarConfig", column: "logo" },
      { table: "MediaConfig", column: "mapImg" },
      { table: "ConnectTrainingConfig", column: "logoIcon" },
    ],
  },
  {
    bucket: "media-flags",
    targets: [{ table: "MediaCountry", column: "flag" }],
  },
  {
    bucket: "media-highlights",
    targets: [{ table: "MediaHighlight", column: "img" }],
  },
  { bucket: "media-tv", targets: [{ table: "MediaTvStation", column: "src" }] },
  {
    bucket: "media-press",
    targets: [
      { table: "MediaPressItem", column: "logo" },
      { table: "MediaPressItem", column: "article" },
    ],
  },
  {
    bucket: "social-icons",
    targets: [{ table: "SocialLink", column: "iconImg" }],
  },
  {
    bucket: "training-icons",
    targets: [{ table: "TrainingProgram", column: "icon" }],
  },
  {
    bucket: "activity-images",
    targets: [{ table: "ActivityImage", column: "src" }],
  },
  { bucket: "client-logos", targets: [{ table: "ClientLogo", column: "src" }] },
  {
    bucket: "meta-data",
    targets: [
      { table: "Metadata", column: "ogImage" },
      { table: "Metadata", column: "favicon" },
    ],
  },
  { bucket: "article-images", targets: [{ table: "Article", column: "img" }] },
  {
    bucket: "article-pages",
    targets: [{ table: "ArticlePage", column: "src" }],
  },
  {
    bucket: "events-images",
    targets: [{ table: "EventItem", column: "coverImg" }],
  },
  {
    bucket: "events-content-images",
    targets: [{ table: "EventItem", column: "contentHtmlVi" }],
  },
  {
    bucket: "events-author-avatars",
    targets: [{ table: "EventItem", column: "authorAvatar" }],
  },
  {
    bucket: "recommendation-avatars",
    targets: [{ table: "RecommendationItem", column: "avatar" }],
  },
  {
    bucket: "certificate-images",
    targets: [{ table: "CertificateItem", column: "img" }],
  },
];

Deno.serve(async () => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const report: Record<string, ReportDetail> = {};

    for (const config of CLEANUP_CONFIG) {
      report[config.bucket] = { deleted: [], errors: null };

      const { data: files, error: listError } = await supabase.storage
        .from(config.bucket)
        .list("", { limit: 1000 });

      if (listError || !files || files.length === 0) continue;

      const unusedFiles: string[] = [];

      for (const file of files) {
        if (file.name === ".emptyFolderPlaceholder") continue;

        let isUsed = false;

        for (const target of config.targets) {
          const { count, error } = await supabase
            .from(target.table)
            .select(target.column, { head: true, count: "exact" })
            .ilike(target.column, `%${file.name}%`);

          if (!error && count && count > 0) {
            isUsed = true;
            break;
          }
        }

        if (!isUsed) {
          unusedFiles.push(file.name);
        }
      }

      if (unusedFiles.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from(config.bucket)
          .remove(unusedFiles);

        if (deleteError) {
          report[config.bucket].errors = deleteError;
        } else {
          report[config.bucket].deleted = unusedFiles;
        }
      }
    }

    return new Response(JSON.stringify({ success: true, report }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500 },
    );
  }
});
