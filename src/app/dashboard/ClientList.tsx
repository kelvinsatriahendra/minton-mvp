'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useOptimistic, useTransition, useState } from 'react';
import { deleteDataAction } from './actions';

type Lapangan = { id: string; nama: string; lokasi: string; harga: string };

export default function ClientList({ initialData }: { initialData: Lapangan[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Task 4: Optimistic UI
  const [optimisticData, addOptimisticDelete] = useOptimistic(
    initialData,
    (state, idToRemove: string) => state.filter((item) => item.id !== idToRemove)
  );

  // Digunakan agar simulasi delay terlihat (untuk membedakan dengan optimistic)
  const [isPending, startTransition] = useTransition();

  // Task 3: URL as State
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    // Ganti URL tanpa reload
    replace(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    // 1. Secara instan hilangkan dari UI (Optimistic Update)
    addOptimisticDelete(id);

    // 2. Jalankan aksi di background
    startTransition(async () => {
      await deleteDataAction(id);
    });
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Cari lapangan badminton..."
          className="w-full p-4 rounded-xl bg-[#1D1D1D] border border-[#333] focus:border-[var(--primary-lime)] outline-none text-white transition-colors"
          defaultValue={searchParams.get('query')?.toString()}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        <p className="text-gray-400 text-sm mt-2">
          URL akan otomatis berubah saat Anda mengetik. Coba refresh halaman, hasil pencarian tidak akan hilang!
        </p>
      </div>

      {/* List Data */}
      <div className="space-y-4">
        {optimisticData.length === 0 ? (
          <div className="p-8 text-center bg-[#1D1D1D] rounded-xl border border-[#333] text-gray-400">
            Tidak ada lapangan yang cocok dengan pencarian.
          </div>
        ) : (
          optimisticData.map((item) => (
            <div key={item.id} className="bg-[#1D1D1D] border border-[#333] p-4 rounded-xl flex justify-between items-center transition-transform hover:-translate-y-1 hover:border-[var(--primary-lime)]">
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 bg-[#2c2c2c] rounded-lg flex items-center justify-center text-2xl">
                  🏸
                </div>
                <div>
                  <h3 className="font-bold text-lg">{item.nama}</h3>
                  <p className="text-gray-400 text-sm">{item.lokasi}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[var(--primary-lime)] font-bold">{item.harga}</p>
                  <p className="text-xs text-gray-500">/ jam</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500/10 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
