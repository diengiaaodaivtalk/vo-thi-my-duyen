import { Hero } from "@/app/(public)/(home)/_components/Hero";
import { Stats } from "@/app/(public)/(home)/_components/Stats";
import { ProfileHighlights } from "@/app/(public)/(home)/_components/ProfileHighlights";
import { AreasOfExpertise } from "@/app/(public)/(home)/_components/AreasOfExpertise";
import { Services } from "@/app/(public)/(home)/_components/Services";
import { ConnectionsAndMedia } from "@/app/(public)/(home)/_components/ConnectionsAndMedia";
import { PublishedArticles } from "@/app/(public)/(home)/_components/PublishedArticles";
import { Recommendations } from "@/app/(public)/(home)/_components/Recommendations";
import { ConnectAndTraining } from "@/app/(public)/(home)/_components/ConnectAndTraining";
import { ActivityHighlights } from "@/app/(public)/(home)/_components/ActivityHighlights";
import { StrategicClients } from "@/app/(public)/(home)/_components/StrategicClients";
import { Events } from "@/app/(public)/(home)/_components/Events";

export default function Home() {
  return (
    <div>
      <Hero />
      <Stats />
      <div id="about">
        <ProfileHighlights />
      </div>
      <AreasOfExpertise />
      <div id="services">
        <Services />
      </div>
      <div id="training">
        <ConnectionsAndMedia />
      </div>
      <PublishedArticles />
      <Recommendations />
      <div id="contact">
        <ConnectAndTraining />
      </div>
      <div id="news">
        <ActivityHighlights />
      </div>
      <div id="clients">
        <StrategicClients />
      </div>
      <Events />
    </div>
  );
}
