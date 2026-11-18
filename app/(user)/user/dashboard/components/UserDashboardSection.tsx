import AgendaSection from "./AgendaSection";
import CommunitySection from "./CommunitySection";
import DashboardFooterSection from "./DashboardFooterSection";
import DashboardHeaderSection from "./DashboardHeaderSection";
import ExploreShortcutsSection from "./ExploreShortcutsSection";
import StoryCarouselSection from "./StoryCarouselSection";

export default function UserDashboardSection() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f4ed] text-[#302d27]">
      <div className="mx-auto w-full max-w-[1240px] px-4 md:px-8">
        <DashboardHeaderSection />
        <StoryCarouselSection />
        <div className="mt-9 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <ExploreShortcutsSection />
          <AgendaSection />
        </div>
        <CommunitySection />
        <DashboardFooterSection />
      </div>
    </main>
  );
}
