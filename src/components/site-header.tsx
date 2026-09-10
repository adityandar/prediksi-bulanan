import Link from "next/link";

import { Container } from "@/components/container";

export function SiteHeader() {
    return (
        <header className="border-b border-[#e8e6e0] bg-[#faf9f6]">
            <Container className="flex h-16 items-center justify-between">
                <Link
                    href="/"
                    className="group flex items-center gap-2.5 font-semibold tracking-[-0.02em]"
                >
                    <span className="flex size-8 items-center justify-center rounded-xl bg-[#19211c] text-[11px] font-bold text-white transition-transform group-hover:-rotate-3">
                        30
                    </span>

                    <span>Prediksi Bulanan</span>
                </Link>

                <Link
                    href="/hitung"
                    className="rounded-full bg-[#19211c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#303a34] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19211c]"
                >
                    Mulai Hitung
                </Link>
            </Container>
        </header>
    );
}