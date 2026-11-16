import Hero from "@/components/home/Hero";
import BrandIntro from "@/components/home/BrandIntro";
import BreederPreview from "@/components/home/BreederPreview";
import CareSheetPreview from "@/components/home/CareSheetPreview";
import Cta from "@/components/home/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <BreederPreview />
      <CareSheetPreview />
      <Cta />
    </>
  );
}
