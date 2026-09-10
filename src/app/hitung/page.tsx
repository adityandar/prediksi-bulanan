import Link from "next/link";

import { Container } from "@/components/container";
import { SiteHeader } from "@/components/site-header";

export default function HitungPage() {
    return (
        <>
            <SiteHeader />

            <main className="py-16 sm:py-24">
                <Container>
                    <div className="mx-auto max-w-xl text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#e8f3ed] text-sm font-bold text-[#287a5d]">
                            30
                        </div>

                        <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                            Kalkulator akan ada di sini.
                        </h1>

                        <p className="mt-4 leading-7 text-[#6b746e]">
                            Fondasi halaman sudah disiapkan. Kalkulator Prediksi Bulanan akan
                            dibuat pada tahap berikutnya.
                        </p>

                        <Link
                            href="/"
                            className="mt-8 inline-flex items-center text-sm font-semibold text-[#287a5d] hover:text-[#20684e]"
                        >
                            ← Kembali ke halaman utama
                        </Link>
                    </div>
                </Container>
            </main>
        </>
    );
}