"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";

import { trackPageView } from "@/lib/analytics";

type AnalyticsProps = {
  measurementId?: string;
};

export function Analytics({ measurementId }: AnalyticsProps) {
  if (process.env.NODE_ENV !== "production" || !measurementId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', '${measurementId}');`}
      </Script>
    </>
  );
}

export function PageViewTracker() {
  const pathname = usePathname();
  const hasTrackedInitialPath = useRef(false);

  useEffect(() => {
    if (!hasTrackedInitialPath.current) {
      hasTrackedInitialPath.current = true;
      return;
    }

    trackPageView(pathname);
  }, [pathname]);

  return null;
}
