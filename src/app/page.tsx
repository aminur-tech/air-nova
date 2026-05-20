import Flight_search_form from "@/components/Home/Flight_search_form";
import Hero_section from "@/components/Home/Hero_section";
import Popular_destinations from "@/components/Home/Popular_destinations";
import Special_offers from "@/components/Home/Special_offers";
import Testimonials from "@/components/Home/Testimonials";
import Why_choose_us from "@/components/Home/Why_choose_us";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="py-16">
        <Hero_section/>
        <Flight_search_form/>
        <Popular_destinations/>
        <Special_offers/>
        <Why_choose_us/>
        <Testimonials/>
      </main>
    </div>
  );
}
