"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { trackEvent } from "@/lib/analytics";

type StartCalculatingLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onClick">;

export function StartCalculatingLink({ children, ...props }: StartCalculatingLinkProps) {
  return (
    <Link
      href="/hitung"
      onClick={() => trackEvent("start_calculate")}
      {...props}
    >
      {children}
    </Link>
  );
}
