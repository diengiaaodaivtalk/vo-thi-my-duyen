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
  updateCertificatesAction,
} from "./actions";
import { ArticlesForm } from "./_components/ArticlesForm";
import { RecommendationsForm } from "./_components/RecommendationsForm";
import { CertificatesForm } from "./_components/CertificatesForm";

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
    sanitizedCertificatesData,
  } = await getAdminHomeData();

  return (
    <AdminLayout userEmail={user?.email} logoutAction={logout}>
      <div className="space-y-10">
        <section id="hero-section">
          <HeroForm initialData={heroData} onSave={updateHeroAction} />
        </section>
        <section id="stats-section">
          <StatsForm initialData={statsData} onSave={updateStatsAction} />
        </section>
        <section id="profile-section">
          <ProfileForm initialData={profileData} onSave={updateProfileAction} />
        </section>
        <section id="expertise-section">
          <ExpertiseForm
            initialData={sanitizedExpertiseData}
            onSave={updateExpertiseAction}
          />
        </section>
        <section id="services-section">
          <ServicesForm
            initialData={sanitizedServicesData}
            onSave={updateServicesAction}
          />
        </section>
        <section id="recommendations-section">
          <RecommendationsForm
            initialData={sanitizedRecommendationsData}
            onSave={updateRecommendationsAction}
          />
        </section>
        <section id="media-section">
          <ConnectionsAndMediaForm
            initialData={sanitizedMediaData}
            onSave={updateMediaAction}
          />
        </section>
        <section id="articles-section">
          <ArticlesForm
            initialData={sanitizedArticlesData}
            onSave={updateArticlesAction}
          />
        </section>
        <section id="connect-training-section">
          <ConnectAndTrainingForm
            initialData={sanitizedConnectTrainingData}
            onSave={updateConnectTrainingAction}
          />
        </section>
        <section id="activity-section">
          <ActivityHighlightsForm
            initialData={sanitizedActivityData}
            onSave={updateActivityAction}
          />
        </section>
        <section id="certificates-section">
          <CertificatesForm
            initialData={sanitizedCertificatesData}
            onSave={updateCertificatesAction}
          />
        </section>
        <section id="clients-section">
          <StrategicClientsForm
            initialData={sanitizedClientsData}
            onSave={updateClientsAction}
          />
        </section>
      </div>
    </AdminLayout>
  );
}
