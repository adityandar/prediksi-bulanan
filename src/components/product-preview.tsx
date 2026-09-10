type PreviewItemProps = {
    emoji: string;
    name: string;
    source: string;
    monthly: string;
};

function PreviewItem({
    emoji,
    name,
    source,
    monthly,
}: PreviewItemProps) {
    return (
        <div className="flex items-center gap-3 border-t border-[#ecebe6] py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f4ef] text-lg">
                {emoji}
            </div>

            <div className="min-w-0 flex-1">
                <p className="font-medium text-[#202823]">{name}</p>
                <p className="mt-0.5 text-sm text-[#7a827d]">{source}</p>
            </div>

            <div className="text-right">
                <p className="text-xs text-[#929893]">≈</p>
                <p className="font-semibold tracking-[-0.02em] text-[#202823]">
                    {monthly}
                </p>
            </div>
        </div>
    );
}

export function ProductPreview() {
    return (
        <div className="relative mx-auto w-full max-w-[480px] lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-3 -z-10 rotate-2 rounded-[32px] bg-[#e8f3ed]" />

            <div className="overflow-hidden rounded-[28px] border border-[#dedfd9] bg-white shadow-[0_24px_70px_rgba(35,49,41,0.10)]">
                <div className="border-b border-[#ecebe6] px-5 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Prediksi Bulanan</p>

                        <span className="rounded-full bg-[#e8f3ed] px-2.5 py-1 text-xs font-semibold text-[#287a5d]">
                            30 hari
                        </span>
                    </div>
                </div>

                <div className="px-5 pt-6 sm:px-6">
                    <p className="text-sm text-[#747d77]">Perkiraan pengeluaran</p>

                    <div className="mt-1 flex items-end gap-2">
                        <p className="text-[34px] font-bold tracking-[-0.045em] text-[#19211c] sm:text-[40px]">
                            Rp1.735.000
                        </p>
                    </div>

                    <p className="mt-1 text-sm text-[#929893]">per 30 hari</p>

                    <div className="mt-6">
                        <PreviewItem
                            emoji="⚡"
                            name="Listrik"
                            source="Rp300.000 / 8 hari"
                            monthly="Rp1.125.000"
                        />

                        <PreviewItem
                            emoji="💧"
                            name="Galon"
                            source="Rp26.000 / 3 hari"
                            monthly="Rp260.000"
                        />

                        <PreviewItem
                            emoji="🌐"
                            name="Internet"
                            source="Rp350.000 / bulan"
                            monthly="Rp350.000"
                        />
                    </div>
                </div>

                <div className="bg-[#fafaf7] px-5 py-4 sm:px-6">
                    <p className="text-xs leading-5 text-[#858c87]">
                        Semua frekuensi diubah menjadi estimasi yang sama: 30 hari.
                    </p>
                </div>
            </div>
        </div>
    );
}