import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminLayout } from "../_components/AdminLayout";
import { HeroForm } from "./_components/HeroForm";
import { StatsForm } from "./_components/StatsForm";
import { ProfileForm } from "./_components/ProfileForm";
import { ExpertiseForm } from "./_components/ExpertiseForm";
import { ServicesForm } from "./_components/ServicesForm";
import { ConnectionsAndMediaForm } from "./_components/ConnectionsAndMediaForm";
import { ConnectAndTrainingForm } from "./_components/ConnectAndTrainingForm";
import { ActivityHighlightsForm } from "./_components/ActivityHighlightsForm";
import { StrategicClientsForm } from "./_components/StrategicClientsForm";
import { getAdminHomeData } from "./queries";
import {
  logout,
  updateHeroAction,
  updateStatsAction,
  updateProfileAction,
  updateExpertiseAction,
  updateServicesAction,
  updateMediaAction,
  updateConnectTrainingAction,
  updateActivityAction,
  updateClientsAction,
  updateArticlesAction,
  updateRecommendationsAction,
} from "./actions";
import { ArticlesForm } from "./_components/ArticlesForm";
import { RecommendationsForm } from "./_components/RecommendationsForm";

export default async function HomeAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    heroData,
    statsData,
    profileData,
    sanitizedExpertiseData,
    sanitizedServicesData,
    sanitizedRecommendationsData,
    sanitizedArticlesData,
    sanitizedMediaData,
    sanitizedConnectTrainingData,
    sanitizedActivityData,
    sanitizedClientsData,
  } = await getAdminHomeData();

  return (
    <AdminLayout userEmail={user?.email} logoutAction={logout}>
      <div className="space-y-10">
        <HeroForm initialData={heroData} onSave={updateHeroAction} />
        <StatsForm initialData={statsData} onSave={updateStatsAction} />
        <ProfileForm initialData={profileData} onSave={updateProfileAction} />
        <ExpertiseForm
          initialData={sanitizedExpertiseData}
          onSave={updateExpertiseAction}
        />
        <ServicesForm
          initialData={sanitizedServicesData}
          onSave={updateServicesAction}
        />
        <RecommendationsForm
          initialData={sanitizedRecommendationsData}
          onSave={updateRecommendationsAction}
        />
        <ConnectionsAndMediaForm
          initialData={sanitizedMediaData}
          onSave={updateMediaAction}
        />
        <ArticlesForm
          initialData={sanitizedArticlesData}
          onSave={updateArticlesAction}
        />
        <ConnectAndTrainingForm
          initialData={sanitizedConnectTrainingData}
          onSave={updateConnectTrainingAction}
        />
        <ActivityHighlightsForm
          initialData={sanitizedActivityData}
          onSave={updateActivityAction}
        />
        <StrategicClientsForm
          initialData={sanitizedClientsData}
          onSave={updateClientsAction}
        />
      </div>
    </AdminLayout>
  );
}
