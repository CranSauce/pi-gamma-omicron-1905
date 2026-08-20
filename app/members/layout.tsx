import type { ReactNode } from "react";
import { MemberPortalIntro } from "./MemberPortalIntro";

export default function MembersLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MemberPortalIntro />
      {children}
    </>
  );
}
