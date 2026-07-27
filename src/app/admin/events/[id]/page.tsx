import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import { AdminLayout } from "../../_components/AdminLayout";
import { getEventById } from "../queries";
import { logout } from "../../home/actions";
import { EventForm } from "./_components/EventForm";

export default async function EventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <AdminLayout userEmail={user?.email} logoutAction={logout}>
      <EventForm
        initialData={{
          id: event.id,
          slug: event.slug,
          categoryVi: event.categoryVi,
          categoryEn: event.categoryEn,
          titleVi: event.titleVi,
          titleEn: event.titleEn,
          excerptVi: event.excerptVi,
          excerptEn: event.excerptEn,
          coverImg: event.coverImg,
          eventDate: event.eventDate,
          eventTime: event.eventTime,
          authorName: event.authorName,
          authorRole: event.authorRole,
          authorAvatar: event.authorAvatar,
          authorBio: event.authorBio,
          readTime: event.readTime,
          contentHtmlVi: event.contentHtmlVi,
          contentHtmlEn: event.contentHtmlEn,
          published: event.published,
          metaTitle: event.metaTitle,
          metaDescription: event.metaDescription,
          ctaLabel: event.ctaLabel,
          ctaHref: event.ctaHref,
        }}
      />
    </AdminLayout>
  );
}
