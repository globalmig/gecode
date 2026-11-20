import Image from "next/image";

const LOGO_SRC = {
  dark: "/images/header-logo.png",
  light: "/images/header-logo-white.png",
} as const;

export type LogoVariant = keyof typeof LOGO_SRC;

export default function Logo({ variant, priority }: { variant: LogoVariant; priority?: boolean }) {
  return (
    <span className="relative block h-6 w-27.5 sm:h-7 sm:w-35 lg:h-7.25 lg:w-45.5">
      <Image
        src={LOGO_SRC[variant]}
        alt="GECODE"
        fill
        priority={priority}
        className="object-contain object-left"
        sizes="182px"
      />
    </span>
  );
}
