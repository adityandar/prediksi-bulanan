import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/container";

export function SiteHeader() {
    return (
        <header className="border-b border-[#e8e6e0] bg-[#faf9f6]">
            <Container className="flex h-16 items-center justify-between">
                <Link
                    href="/"
                    className="group flex items-center gap-2.5 font-semibold tracking-[-0.02em]"
                >
                    <Image
                        src="/brand/logo-wordmark.png"
                        alt="Prediksi Bulanan"
                        width={220}
                        height={48}
                        priority
                        className="h-8 w-auto sm:h-9"
                    />
                </Link>

                <Link
                    href="/hitung"
                    className="rounded-full bg-[#10213c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#303a34] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19211c]"
                >
                    Mulai Hitung
                </Link>
            </Container>
        </header>
    );
}