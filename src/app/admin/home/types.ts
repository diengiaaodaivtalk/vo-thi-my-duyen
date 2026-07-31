export interface ButtonParam {
  id?: string;
  textVi?: string | null;
  textEn?: string | null;
  href?: string | null;
  primary?: boolean | null;
  order?: number | null;
}

export interface StatItemParam {
  id?: string;
  value: string | null;
  titleVi: string | null;
  titleEn: string | null;
  iconSrc: string | null;
  imageFile?: File | null;
}

export interface ProfileItemParam {
  id?: string;
  vi: string | null;
  en: string | null;
}

export interface ExpertiseItemParam {
  id?: string;
  vi: string | null;
  en: string | null;
  icon: string | null;
  imageFile?: File | null;
}

export interface ServiceItemParam {
  id?: string;
  vi: string | null;
  en: string | null;
  img: string | null;
  imageFile?: File | null;
}

export interface RecommendationItemParam {
  id?: string;
  name: string | null;
  roleLine1: string | null;
  roleLine2: string | null;
  timeAgo: string | null;
  quote: string | null;
  avatar: string | null;
  imageFile?: File | null;
}

export interface CountryParam {
  id?: string;
  vi: string;
  en: string;
  flag: string;
  imageFile?: File | null;
}

export interface HighlightParam {
  id?: string;
  titleVi: string;
  titleEn: string;
  img: string;
  href: string;
  imageFile?: File | null;
}

export interface TvParam {
  id?: string;
  src: string;
  imageFile?: File | null;
}

export interface PressParam {
  id?: string;
  logo: string;
  article: string;
  logoFile?: File | null;
  articleFile?: File | null;
}

export interface ArticleCategoryParam {
  id?: string;
  vi: string;
  en?: string | null;
}

export interface ArticlePageParam {
  id?: string;
  src: string;
  imageFile?: File | null;
}

interface ArticlePageItem {
  id?: string;
  src: string;
  imageFile?: File | null;
}

export interface ArticleItemParam {
  id?: string;
  row: number;
  title: string;
  description: string;
  categoryIds: string[];
  date: string;
  publisher: string;
  link: string;
  img: string;
  imageFile?: File | null;
  pages: ArticlePageItem[];
}

export interface ProgramParam {
  id?: string;
  vi: string;
  en: string;
  icon: string;
  imageFile?: File | null;
}

export interface SocialParam {
  id?: string;
  titleVi: string;
  titleEn: string;
  linkText: string;
  url: string;
  bgColor: string;
  iconImg: string;
  imageFile?: File | null;
}

export interface ActivityItemParam {
  id?: string;
  src: string;
  imageFile?: File | null;
}

export interface LogoItemParam {
  id?: string;
  src: string;
  imageFile?: File | null;
}

export interface TabItemParam {
  id?: string;
  tabKey: string;
  vi: string;
  en: string;
  logos: LogoItemParam[];
}

export interface CertificateItemParam {
  id?: string;
  img: string;
  imageFile?: File | null;
}
