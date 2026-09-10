import Link from "next/link";

import { Container } from "@/components/container";
import { ProductPreview } from "@/components/product-preview";
import { SiteHeader } from "@/components/site-header";

const steps = [
  {
    number: "01",
    title: "Masukkan pengeluaran",
    description: "Contohnya Rp26.000 untuk satu galon.",
  },
  {
    number: "02",
    title: "Tentukan frekuensinya",
    description: "Misalnya dibeli setiap 3 hari.",
  },
  {
    number: "03",
    title: "Lihat prediksi 30 hari",
    description: "Kami hitungkan estimasi bulanan dan total semuanya.",
  },
];

const benefits = [
  {
    label: "Fleksibel",
    title: "Berbagai frekuensi",
    description:
      "Masukkan pengeluaran per hari, minggu, atau bulan sesuai kebiasaanmu.",
  },
  {
    label: "Sederhana",
    title: "Semua jadi satu angka",
    description:
      "Setiap pola dinormalisasi menjadi estimasi yang sama selama 30 hari.",
  },
  {
    label: "Privat",
    title: "Data tetap di perangkatmu",
    description:
      "Tanpa akun dan tanpa backend. Data disimpan langsung di browser.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-24 lg:pt-24">
          <Container>
            <div className="grid items-center gap-14 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#dfe4de] bg-white px-3 py-1.5 text-sm font-medium text-[#58635c]">
                  <span className="size-2 rounded-full bg-[#287a5d]" />
                  Pengeluaran rutin, dipermudah.
                </div>

                <h1 className="max-w-[720px] text-[44px] font-bold leading-[1.03] tracking-[-0.05em] text-[#19211c] sm:text-[56px] lg:text-[64px]">
                  Pengeluaran kecil yang berulang, sebenarnya jadi berapa
                  sebulan?
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-[#667069] sm:text-lg sm:leading-8">
                  Masukkan nominal dan seberapa sering kamu mengeluarkannya.
                  Prediksi Bulanan mengubah semuanya menjadi estimasi
                  pengeluaran selama 30 hari.
                </p>

                <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/hitung"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#287a5d] px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(40,122,93,0.20)] transition hover:-translate-y-0.5 hover:bg-[#20684e] hover:shadow-[0_12px_30px_rgba(40,122,93,0.24)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#287a5d]"
                  >
                    Mulai Hitung
                    <span aria-hidden="true" className="ml-2">
                      →
                    </span>
                  </Link>

                  <p className="text-sm text-[#858c87]">
                    Gratis · Tanpa login · Tersimpan di browser
                  </p>
                </div>
              </div>

              <ProductPreview />
            </div>
          </Container>
        </section>

        <section className="border-y border-[#e7e6e0] bg-white py-20 sm:py-24">
          <Container>
            <div className="max-w-xl">
              <p className="text-sm font-semibold text-[#287a5d]">
                Sesederhana ini
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Tidak perlu mencatat setiap transaksi.
              </h2>

              <p className="mt-4 leading-7 text-[#6b746e]">
                Cukup beri tahu pola pengeluaranmu. Sisanya tinggal dihitung.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-[22px] border border-[#e6e5df] bg-[#faf9f6] p-6"
                >
                  <span className="font-mono text-xs font-semibold text-[#98a09b]">
                    {step.number}
                  </span>

                  <h3 className="mt-8 text-lg font-semibold tracking-[-0.025em]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#727a75]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-20 sm:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <div>
                <p className="text-sm font-semibold text-[#287a5d]">
                  Cuma yang kamu butuhkan
                </p>

                <h2 className="mt-3 max-w-md text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                  Bukan aplikasi budgeting. Memang sengaja.
                </h2>

                <p className="mt-4 max-w-md leading-7 text-[#6b746e]">
                  Tidak ada kategori rumit, sinkronisasi bank, atau laporan
                  panjang. Fokusnya cuma satu: memperkirakan pengeluaran rutin
                  selama 30 hari.
                </p>
              </div>

              <div className="divide-y divide-[#e3e3dd] border-y border-[#e3e3dd]">
                {benefits.map((benefit) => (
                  <article
                    key={benefit.title}
                    className="grid gap-3 py-6 sm:grid-cols-[120px_1fr] sm:gap-6"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#939a95]">
                      {benefit.label}
                    </p>

                    <div>
                      <h3 className="font-semibold tracking-[-0.02em]">
                        {benefit.title}
                      </h3>

                      <p className="mt-1.5 max-w-lg text-sm leading-6 text-[#727a75]">
                        {benefit.description}
                      </p>
                    </div>
                  </article>
                ))}

                <article className="grid gap-3 py-6 sm:grid-cols-[120px_1fr] sm:gap-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#939a95]">
                    Bagikan
                  </p>

                  <div>
                    <h3 className="font-semibold tracking-[-0.02em]">
                      Simpan hasil sebagai gambar
                    </h3>

                    <p className="mt-1.5 max-w-lg text-sm leading-6 text-[#727a75]">
                      Hasil prediksi nantinya bisa diekspor menjadi share card
                      untuk disimpan atau dibagikan.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </Container>
        </section>

        <section className="pb-20 sm:pb-24">
          <Container>
            <div className="relative overflow-hidden rounded-[30px] bg-[#19211c] px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14">
              <div className="absolute right-0 top-0 size-40 translate-x-1/3 -translate-y-1/3 rounded-full border-[28px] border-white/[0.04]" />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">
                    Prediksi Bulanan
                  </p>

                  <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                    Penasaran sebenarnya habis berapa sebulan?
                  </h2>
                </div>

                <Link
                  href="/hitung"
                  className="inline-flex min-h-12 w-fit shrink-0 items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold text-[#19211c] transition hover:-translate-y-0.5 hover:bg-[#f2f2ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Mulai Hitung
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t border-[#e4e3dd] py-8">
        <Container className="flex flex-col gap-2 text-sm text-[#8a918c] sm:flex-row sm:items-center sm:justify-between">
          <p>Prediksi Bulanan</p>
          <p>Hitung yang rutin. Tidak lebih rumit dari itu.</p>
        </Container>
      </footer>
    </>
  );
}