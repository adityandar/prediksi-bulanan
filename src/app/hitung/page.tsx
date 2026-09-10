"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Container } from "@/components/container";
import { calculateMonthlyAmount, calculateTotalMonthlyAmount, Expense, IntervalUnit, parseExpensesFromStorage } from "@/lib/calculations";

const STORAGE_KEY = "prediksi-bulanan:v1";
type ExpenseDraft = { name: string; emoji: string; amount: string; interval: string; intervalUnit: IntervalUnit };
const emptyDraft: ExpenseDraft = { name: "", emoji: "", amount: "", interval: "1", intervalUnit: "day" };
const unitLabels: Record<IntervalUnit, string> = { day: "hari", week: "minggu", month: "bulan" };
const emojiOptions = [
  { emoji: "💧", label: "Galon" }, { emoji: "⚡", label: "Listrik" },
  { emoji: "🌐", label: "Internet" }, { emoji: "⛽", label: "Bensin" },
  { emoji: "🛒", label: "Belanja" }, { emoji: "🏠", label: "Rumah" },
  { emoji: "📱", label: "Pulsa" },
];
const moreEmojiOptions = [
  { emoji: "🚗", label: "Transportasi" }, { emoji: "🍽️", label: "Makan" },
  { emoji: "🧺", label: "Laundry" }, { emoji: "💊", label: "Kesehatan" },
  { emoji: "🎓", label: "Pendidikan" }, { emoji: "🐾", label: "Hewan" },
  { emoji: "🎬", label: "Hiburan" }, { emoji: "☕", label: "Kopi" },
  { emoji: "🎁", label: "Hadiah" }, { emoji: "🧴", label: "Perawatan" },
  { emoji: "🧹", label: "Kebersihan" }, { emoji: "📦", label: "Langganan" },
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(value));
}

function formatFrequency(expense: Pick<Expense, "amount" | "interval" | "intervalUnit">) {
  return `${formatRupiah(expense.amount)} setiap ${expense.interval} ${unitLabels[expense.intervalUnit]}`;
}

function makeId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function drawShareCard(expenses: Expense[], total: number) {
  const scale = 2, width = 1080, rowHeight = 176, height = Math.max(1350, 620 + expenses.length * rowHeight + 220);
  const canvas = document.createElement("canvas");
  canvas.width = width * scale; canvas.height = height * scale;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.scale(scale, scale);
  context.fillStyle = "#faf9f6"; context.fillRect(0, 0, width, height);
  context.fillStyle = "#e8f7f2"; context.beginPath(); context.arc(width + 80, -20, 250, 0, Math.PI * 2); context.fill();
  context.fillStyle = "#10213c"; context.roundRect(56, 54, 968, 428, 42); context.fill();
  context.fillStyle = "#84ddc2"; context.font = "600 28px Arial, sans-serif"; context.fillText("Prediksi Bulanan", 112, 128);
  context.fillStyle = "#ffffff"; context.font = "700 76px Arial, sans-serif"; context.fillText(formatRupiah(total), 112, 260);
  context.fillStyle = "rgba(255,255,255,0.68)"; context.font = "400 30px Arial, sans-serif"; context.fillText("estimasi pengeluaran / 30 hari", 112, 320);
  context.fillStyle = "#00a67d"; context.roundRect(112, 364, 286, 62, 31); context.fill();
  context.fillStyle = "#ffffff"; context.font = "600 24px Arial, sans-serif"; context.fillText(`${expenses.length} pengeluaran rutin`, 142, 404);
  let y = 562;
  expenses.forEach((expense) => {
    const estimate = calculateMonthlyAmount(expense);
    context.fillStyle = "#ffffff"; context.roundRect(56, y, 968, 140, 30); context.fill();
    context.fillStyle = "#e4e9e5"; context.fillRect(56, y + 139, 968, 1);
    context.fillStyle = "#e8f7f2"; context.beginPath(); context.arc(112, y + 70, 34, 0, Math.PI * 2); context.fill();
    context.fillStyle = "#10213c"; context.font = "32px Arial, sans-serif"; context.fillText(expense.emoji?.trim() || "•", 98, y + 82);
    context.font = "700 31px Arial, sans-serif"; context.fillText(expense.name, 174, y + 58);
    context.fillStyle = "#667069"; context.font = "400 24px Arial, sans-serif"; context.fillText(formatFrequency(expense), 174, y + 96);
    context.fillStyle = "#287a5d"; context.font = "600 25px Arial, sans-serif";
    const estimateText = `≈ ${formatRupiah(estimate)} / bulan`;
    context.fillText(estimateText, 1024 - context.measureText(estimateText).width, y + 76); y += rowHeight;
  });
  const totalY = y + 30;
  context.fillStyle = "#10213c"; context.roundRect(56, totalY, 968, 156, 34); context.fill();
  context.fillStyle = "rgba(255,255,255,0.66)"; context.font = "600 25px Arial, sans-serif"; context.fillText("Total", 104, totalY + 58);
  context.fillStyle = "#ffffff"; context.font = "700 43px Arial, sans-serif"; context.fillText(`${formatRupiah(total)} / 30 hari`, 104, totalY + 112);
  context.fillStyle = "#6d7a72"; context.font = "600 24px Arial, sans-serif"; context.fillText("Prediksi Bulanan", 56, height - 62);
  return canvas;
}

export default function HitungPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]), [hasLoaded, setHasLoaded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false), [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ExpenseDraft>(emptyDraft), [error, setError] = useState(""), [isExporting, setIsExporting] = useState(false), [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false), [isMoreEmojiPickerOpen, setIsMoreEmojiPickerOpen] = useState(false);
  const nameInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setExpenses(parseExpensesFromStorage(window.localStorage.getItem(STORAGE_KEY)));
      setHasLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => { if (hasLoaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)); }, [expenses, hasLoaded]);
  useEffect(() => { if (isFormOpen) requestAnimationFrame(() => nameInput.current?.focus()); }, [isFormOpen]);
  const total = calculateTotalMonthlyAmount(expenses);
  function openNewForm() { setEditingId(null); setDraft(emptyDraft); setIsEmojiPickerOpen(false); setIsMoreEmojiPickerOpen(false); setError(""); setIsFormOpen(true); }
  function openEditForm(expense: Expense) { setEditingId(expense.id); setDraft({ name: expense.name, emoji: expense.emoji ?? "", amount: String(expense.amount), interval: String(expense.interval), intervalUnit: expense.intervalUnit }); setIsEmojiPickerOpen(false); setIsMoreEmojiPickerOpen(false); setError(""); setIsFormOpen(true); }
  function closeForm() { setIsFormOpen(false); setEditingId(null); setDraft(emptyDraft); setIsEmojiPickerOpen(false); setIsMoreEmojiPickerOpen(false); setError(""); }
  function saveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const amount = Number(draft.amount), interval = Number(draft.interval);
    if (!draft.name.trim()) return setError("Nama pengeluaran perlu diisi.");
    if (!Number.isFinite(amount) || amount <= 0) return setError("Masukkan nominal yang valid.");
    if (!Number.isFinite(interval) || interval <= 0) return setError("Frekuensi perlu lebih dari nol.");
    const next: Expense = { id: editingId ?? makeId(), name: draft.name.trim(), emoji: draft.emoji.trim(), amount: Math.round(amount), interval: Math.round(interval), intervalUnit: draft.intervalUnit };
    setExpenses((current) => editingId ? current.map((expense) => expense.id === editingId ? next : expense) : [...current, next]); closeForm();
  }
  function exportImage() { if (!expenses.length) return; setIsExporting(true); requestAnimationFrame(() => { const canvas = drawShareCard(expenses, total); if (canvas) { const link = document.createElement("a"); link.download = "prediksi-bulanan.png"; link.href = canvas.toDataURL("image/png"); link.click(); } setIsExporting(false); }); }
  const field = "min-h-12 rounded-xl border border-[#dfe4de] bg-[#faf9f6] px-3 text-[16px] text-[#10213c] outline-none transition placeholder:text-[#a0a7a2] focus:border-[#00a67d] focus:ring-3 focus:ring-[#00a67d]/10";
  return <main className="min-h-screen bg-[#faf9f6] pb-16"><header className="border-b border-[#e8e6e0] bg-[#faf9f6]"><Container className="flex h-16 items-center justify-between"><Link href="/" className="text-base font-semibold tracking-[-0.025em] text-[#10213c]">Prediksi Bulanan</Link><Link href="/" className="text-sm font-medium text-[#667069] transition hover:text-[#287a5d]">← Beranda</Link></Container></header><Container className="max-w-3xl py-8 sm:py-12"><div className="mx-auto max-w-2xl">
    <section className="relative overflow-hidden rounded-[30px] bg-[#10213c] px-6 py-8 text-white shadow-[0_18px_44px_rgba(16,33,60,0.16)] sm:px-9 sm:py-10"><div className="absolute right-0 top-0 size-36 translate-x-1/3 -translate-y-1/3 rounded-full border-[24px] border-white/[0.05]"/><div className="relative"><p className="text-sm font-medium text-white/65">Prediksi pengeluaranmu</p><p className="mt-3 text-[42px] font-bold leading-none tracking-[-0.055em] sm:text-[56px]">{formatRupiah(total)}</p><p className="mt-3 text-sm text-white/65">dalam 30 hari{expenses.length ? ` · ${expenses.length} pengeluaran rutin` : ""}</p></div></section>
    <section className="mt-5 rounded-[24px] border border-[#e6e5df] bg-white p-4 sm:p-5">{!isFormOpen ? <button onClick={openNewForm} className="flex min-h-12 w-full items-center justify-center rounded-[16px] bg-[#e8f7f2] px-5 text-[15px] font-semibold text-[#287a5d] transition hover:bg-[#d9f2e9]">+ Tambah pengeluaran</button> : <form onSubmit={saveExpense} className="space-y-4"><div className="flex items-center justify-between"><h1 className="text-lg font-semibold tracking-[-0.025em]">{editingId ? "Ubah pengeluaran" : "Tambah pengeluaran"}</h1><button type="button" onClick={closeForm} className="min-h-10 px-2 text-sm font-medium text-[#667069] hover:text-[#10213c]">Batal</button></div><div className="grid gap-4 sm:grid-cols-[1fr_104px]"><label className="grid gap-1.5 text-sm font-medium text-[#49544d]">Nama pengeluaran<input ref={nameInput} value={draft.name} onChange={(event) => setDraft({...draft,name:event.target.value})} placeholder="Galon" className={field}/></label><div className="grid gap-1.5 text-sm font-medium text-[#49544d]"><span>Emoji <span className="font-normal text-[#89918c]">opsional</span></span><button type="button" onClick={() => setIsEmojiPickerOpen((open) => !open)} aria-expanded={isEmojiPickerOpen} aria-controls="emoji-picker" className={`${field} flex items-center justify-center text-[18px] hover:border-[#00a67d]`}>{draft.emoji || "Pilih"}</button></div></div><label className="grid gap-1.5 text-sm font-medium text-[#49544d]">Nominal<div className="flex min-h-12 items-center rounded-xl border border-[#dfe4de] bg-[#faf9f6] px-3 transition focus-within:border-[#00a67d] focus-within:ring-3 focus-within:ring-[#00a67d]/10"><span className="mr-1.5 text-[#667069]">Rp</span><input inputMode="numeric" value={draft.amount ? Number(draft.amount).toLocaleString("id-ID") : ""} onChange={(event) => setDraft({...draft,amount:event.target.value.replace(/\D/g,"")})} placeholder="26.000" className="min-w-0 flex-1 bg-transparent text-[16px] text-[#10213c] outline-none placeholder:text-[#a0a7a2]"/></div></label><label className="grid gap-1.5 text-sm font-medium text-[#49544d]">Frekuensi<div className="flex min-h-12 items-center rounded-xl border border-[#dfe4de] bg-[#faf9f6] px-3 transition focus-within:border-[#00a67d] focus-within:ring-3 focus-within:ring-[#00a67d]/10"><span className="mr-2 text-[#667069]">setiap</span><input inputMode="numeric" value={draft.interval} onChange={(event) => setDraft({...draft,interval:event.target.value.replace(/\D/g,"")})} className="w-12 bg-transparent text-center text-[16px] text-[#10213c] outline-none"/><select value={draft.intervalUnit} onChange={(event) => setDraft({...draft,intervalUnit:event.target.value as IntervalUnit})} className="ml-2 flex-1 bg-transparent text-[16px] text-[#10213c] outline-none"><option value="day">hari</option><option value="week">minggu</option><option value="month">bulan</option></select></div></label>{error && <p className="text-sm font-medium text-[#b54747]">{error}</p>}<button type="submit" className="min-h-12 w-full rounded-full bg-[#00a67d] px-5 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(40,122,93,0.18)] transition hover:bg-[#008b69]">{editingId ? "Simpan perubahan" : "Tambahkan"}</button></form>}</section>
    {!expenses.length ? <section className="mt-8 rounded-[24px] border border-dashed border-[#d8ded9] bg-[#f5f7f4] px-6 py-9 text-center sm:px-10"><p className="text-lg font-semibold tracking-[-0.025em]">Belum ada pengeluaran rutin</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6b746e]">Tambahkan pengeluaran seperti galon, token listrik, bensin, internet, atau kebutuhan rutin lainnya.</p><p className="mt-5 rounded-xl bg-white px-4 py-3 text-sm text-[#4c5750]">💧 Galon · Rp26.000 setiap 3 hari → <span className="font-semibold text-[#287a5d]">±Rp260.000/bulan</span></p><button onClick={openNewForm} className="mt-6 min-h-11 text-sm font-semibold text-[#287a5d] hover:text-[#20684e]">+ Tambah pengeluaran pertama</button></section> : <section className="mt-7"><div className="mb-3 flex items-center justify-between px-1"><h2 className="font-semibold tracking-[-0.02em]">Pengeluaran rutin</h2><button onClick={() => window.confirm("Hapus semua pengeluaran rutin dari browser ini?") && setExpenses([])} className="min-h-10 text-sm font-medium text-[#8a918c] hover:text-[#b54747]">Hapus semua data</button></div><div className="space-y-3">{expenses.map((expense) => { const monthly = calculateMonthlyAmount(expense); return <article key={expense.id} className="rounded-[20px] border border-[#e6e5df] bg-white p-4 sm:p-5"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e8f7f2] text-xl">{expense.emoji?.trim() || "•"}</span><div className="min-w-0 flex-1"><h3 className="font-semibold tracking-[-0.02em]">{expense.name}</h3><p className="mt-1 text-sm text-[#69736d]">{formatFrequency(expense)}</p><p className="mt-3 text-sm font-semibold text-[#287a5d]">≈ {formatRupiah(monthly)} / bulan</p></div><div className="flex shrink-0 gap-1"><button onClick={() => openEditForm(expense)} className="min-h-10 px-2 text-sm font-medium text-[#667069] hover:text-[#287a5d]">Edit</button><button onClick={() => setExpenses((current) => current.filter((item) => item.id !== expense.id))} className="min-h-10 px-2 text-sm font-medium text-[#8a918c] hover:text-[#b54747]">Hapus</button></div></div></article>; })}</div><button onClick={exportImage} disabled={isExporting} className="mt-5 min-h-12 w-full rounded-full border border-[#c9d3cd] bg-white px-5 text-[15px] font-semibold text-[#10213c] transition hover:border-[#aabbb1] hover:bg-[#f5f7f4] disabled:cursor-wait disabled:opacity-60">{isExporting ? "Menyiapkan gambar…" : "Export sebagai gambar"}</button></section>}
    {isFormOpen && isEmojiPickerOpen && <div id="emoji-picker" className="fixed inset-x-3 bottom-3 z-20 mx-auto max-w-xl rounded-[20px] border border-[#d6e4dd] bg-white/95 p-3 shadow-[0_16px_38px_rgba(16,33,60,0.18)] backdrop-blur"><div className="flex items-center justify-between px-1"><p className="text-xs font-semibold text-[#49544d]">Pilih ikon</p><button type="button" onClick={() => { setIsEmojiPickerOpen(false); setIsMoreEmojiPickerOpen(false); }} className="text-xs font-medium text-[#287a5d]">Tutup</button></div><div className="mt-2 grid grid-cols-7 gap-1.5">{emojiOptions.map((option) => <button key={option.emoji} type="button" title={option.label} aria-label={option.label} onClick={() => { setIsEmojiPickerOpen(false); setIsMoreEmojiPickerOpen(false); setDraft({...draft,emoji:option.emoji}); }} className={`flex min-h-11 items-center justify-center rounded-xl text-xl transition ${draft.emoji === option.emoji ? "bg-[#e8f7f2] ring-2 ring-[#00a67d]" : "bg-[#f5f7f4] hover:bg-[#e8f7f2]"}`}>{option.emoji}</button>)}</div>{isMoreEmojiPickerOpen && <div className="mt-2 grid grid-cols-6 gap-1.5 border-t border-[#e4e9e5] pt-2">{moreEmojiOptions.map((option) => <button key={option.emoji} type="button" title={option.label} aria-label={option.label} onClick={() => { setIsEmojiPickerOpen(false); setIsMoreEmojiPickerOpen(false); setDraft({...draft,emoji:option.emoji}); }} className={`flex min-h-11 items-center justify-center rounded-xl text-xl transition ${draft.emoji === option.emoji ? "bg-[#e8f7f2] ring-2 ring-[#00a67d]" : "bg-[#f5f7f4] hover:bg-[#e8f7f2]"}`}>{option.emoji}</button>)}</div>}<button type="button" onClick={() => setIsMoreEmojiPickerOpen((open) => !open)} className="mt-3 w-full text-xs font-medium text-[#287a5d]">{isMoreEmojiPickerOpen ? "Sembunyikan lainnya" : "Lihat lainnya"}</button></div>}
    <p className="mt-7 text-center text-xs text-[#919892]">Data hanya tersimpan di browser ini.</p>
  </div></Container></main>;
}
