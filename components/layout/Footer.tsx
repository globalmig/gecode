import Logo from "@/components/common/Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-footer">
      <div className="mx-auto flex max-w-360 flex-col gap-6 px-5 py-10 sm:gap-8 sm:py-12 lg:py-14">
        <Logo variant="light" />

        <p className="text-nav text-white">평일·주말 14:00 ~ 20:00 운영</p>

        <div className="border-t border-[rgba(204,204,204,0.5)]" />

        <div className="flex flex-col gap-1 text-base text-footer-muted">
          <p>대표자. 김민수 | 사업자번호. 528-75-00641 | 주소. 경남 김해시 가야로 157번길 22-8 1층</p>
          <p>Copyright GECODE 2026. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
