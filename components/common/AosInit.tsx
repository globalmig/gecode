"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AosInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }, []);

  // 라우트 전환 시 새로 렌더링된 요소를 AOS가 다시 스캔하도록 갱신합니다.
  useEffect(() => {
    AOS.refreshHard();
  }, [pathname]);

  return null;
}
