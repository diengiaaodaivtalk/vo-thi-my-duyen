import { getHeroData } from "./hero.queries";
import { getStatsData } from "./stats.queries";
import { getProfileData } from "./profile.queries";
import { getExpertiseData } from "./expertise.queries";
import { getServicesData } from "./services.queries";
import { getMediaData } from "./media.queries";
import { getConnectTrainingData } from "./connect-training.queries";
import { getActivityData } from "./activity.queries";
import { getClientsData } from "./clients.queries";
import { getRecommendationsData } from "./recommendations.queries";
import { getArticlesData } from "./articles.queries";

export async function getAdminHomeData() {
  const [
    heroData,
    statsData,
    profileData,
    sanitizedExpertiseData,
    sanitizedServicesData,
    sanitizedMediaData,
    sanitizedConnectTrainingData,
    sanitizedActivityData,
    sanitizedClientsData,
    sanitizedRecommendationsData,
    sanitizedArticlesData,
  ] = await Promise.all([
    getHeroData(),
    getStatsData(),
    getProfileData(),
    getExpertiseData(),
    getServicesData(),
    getMediaData(),
    getConnectTrainingData(),
    getActivityData(),
    getClientsData(),
    getRecommendationsData(),
    getArticlesData(),
  ]);

  return {
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
  };
}

export * from "./hero.queries";
export * from "./stats.queries";
export * from "./profile.queries";
export * from "./expertise.queries";
export * from "./services.queries";
export * from "./media.queries";
export * from "./connect-training.queries";
export * from "./activity.queries";
export * from "./clients.queries";
export * from "./recommendations.queries";
export * from "./articles.queries";
