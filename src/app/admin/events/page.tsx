import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "../_components/AdminLayout";
import { getEventsConfig, getSiteCtaConfig } from "./queries";
import { logout } from "../home/actions";
import { updateEventsSectionTitleAction } from "./actions";
import { EventListTable } from "./_components/EventListTable";
import { SiteCtaForm } from "./_components/SiteCtaForm";

export default async function EventsAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const config = await getEventsConfig();
  const ctaConfig = await getSiteCtaConfig();

  return (
    <AdminLayout userEmail={user?.email} logoutAction={logout}>
      <div className="space-y-6 max-w-5xl">
        <form
          action={updateEventsSectionTitleAction}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Tiêu đề mục (Tiếng Việt)
            </label>
            <input
              type="text"
              name="titleVi"
              defaultValue={config.titleVi}
              className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Tiêu đề mục (Tiếng Anh)
            </label>
            <input
              type="text"
              name="titleEn"
              defaultValue={config.titleEn}
              className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
            />
          </div>
          <button
            type="submit"
            className="md:col-span-2 justify-self-end px-4 py-2 bg-[#0a1b35] text-white rounded-lg text-sm font-semibold hover:bg-[#0a1b35]/90 cursor-pointer"
          >
            Lưu tiêu đề
          </button>
        </form>

        <EventListTable items={config.items} />

        <SiteCtaForm initialData={ctaConfig} />
      </div>
    </AdminLayout>
  );
}
