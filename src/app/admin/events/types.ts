export interface EventItemParam {
  id?: string;
  slug: string;
  categoryVi: string | null;
  categoryEn: string | null;
  titleVi: string;
  titleEn: string | null;
  excerptVi: string | null;
  excerptEn: string | null;
  coverImg: string | null;
  eventDate: string | null;
  eventTime: string | null;
  authorName: string | null;
  authorRole: string | null;
  authorAvatar: string | null;
  authorBio: string | null;
  readTime: string | null;
  contentHtmlVi: string | null;
  contentHtmlEn: string | null;
  published: boolean | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  order?: number | null;
}

export interface EventsConfigData {
  id?: string;
  titleVi: string;
  titleEn: string;
  items: EventItemParam[];
}
