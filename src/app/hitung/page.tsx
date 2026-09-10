import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/container";
import { SiteHeader } from "@/components/site-header";

export default function HitungPage() {
    return (
        <>
            <SiteHeader />

            <main className="py-16 sm:py-24">
                <Container>
                    <div className="mx-auto max-w-xl text-center">
                        <Image
                            src="/brand/logo-icon.png"
                            alt=""
                            width={56}
                            height={56}
                            className="mx-auto size-14 object-contain"
                        />

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