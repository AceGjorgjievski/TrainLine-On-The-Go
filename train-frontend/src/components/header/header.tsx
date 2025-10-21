"use client";

import { useResponsive } from "@/hooks";
import HeaderDesktopView from "./header-desktop-view";
import HeaderMobileView from "./header-mobile-view";

export default function Header() {

    const isSmUp = useResponsive("up", "sm");

  return (
    <>
      {(isSmUp) ? (
        <HeaderDesktopView/>
      ) : (
        <HeaderMobileView/>
      )}
      {/* {(xs) && (
                <div>XS</div>
            )}
            {(sm) && (
                <div>SM</div>
            )}
            {(md) && (
                <div>MD</div>
            )}{(lg) && (
                <div>LG</div>
            )} */}
    </>
  );
}
