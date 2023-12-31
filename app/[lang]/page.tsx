import HeroNetflix from "@/app/[lang]/_components/HeroNetflix/HeroNetflix";
import BaseCard from "@/app/_components/BaseCard/BaseCard";
import EnjoyTv from "@/app/[lang]/_components/EnjoyTv/EnjoyTv";
import DownloadImg from "@/app/[lang]/_components/DownloadImg/DownloadImg";
import EverywhereImg from "@/app/[lang]/_components/EverywhereImg/EverywhereImg";
import KidsImg from "@/app/[lang]/_components/KidsImg/KidsImg";
import AskedQuestions from "@/app/[lang]/_components/AskedQuestions/AskedQuestions";
import { Section } from "@/types";

function Components() {
  const sections: Section[] = [
    {
      header: "Enjoy on your TV",
      desc: "Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.",
      comp: EnjoyTv(),
    },
    {
      header: "Download your shows to watch offline",
      desc: "Save your favorites easily and always have something to watch.",
      comp: DownloadImg(),
      reverse: true,
    },
    {
      header: "Watch everywhere",
      desc: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
      comp: EverywhereImg(),
    },
    {
      header: "Create profiles for kids",
      desc: "Send kids on adventures with their favorite characters in a space made just for them—free with your membership.",
      comp: KidsImg(),
      reverse: true,
    },
  ];
  return (
    <>
      {sections.map((section, index) => (
        <section key={index}>
          <BaseCard
            desc={section.desc}
            header={section.header}
            comp={section.comp}
          ></BaseCard>
        </section>
      ))}
    </>
  );
}

export default function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  return (
    <div>
      <section className="hero-image">
        <HeroNetflix />
      </section>
      <Components></Components>
      <AskedQuestions></AskedQuestions>
    </div>
  );
}
