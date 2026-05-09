import ClientList from './ClientList';
import LogoutButton from './LogoutButton';

const DUMMY_DATA = [
  { id: '1', nama: 'GOR Jaya Badminton', lokasi: 'Jakarta Selatan', harga: 'Rp 60.000' },
  { id: '2', nama: 'Smash Arena', lokasi: 'Bandung', harga: 'Rp 50.000' },
  { id: '3', nama: 'Champion Court', lokasi: 'Surabaya', harga: 'Rp 75.000' },
  { id: '4', nama: 'Minton Sport Center', lokasi: 'Jakarta Pusat', harga: 'Rp 100.000' },
  { id: '5', nama: 'Raket Emas Hall', lokasi: 'Tangerang', harga: 'Rp 55.000' },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams)?.query || '';

  // Simulasi network delay untuk memunculkan loading.tsx (Task 4)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Memfilter data berdasarkan query dari URL (Task 3)
  const filteredData = DUMMY_DATA.filter((item) =>
    item.nama.toLowerCase().includes(query.toLowerCase()) ||
    item.lokasi.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#333]">
          <div>
            <h1 className="text-3xl font-bold font-['Plus_Jakarta_Sans']">Dashboard <span className="text-[#bdd124]">Minton</span></h1>
            <p className="text-gray-400 mt-1">Kelola data lapangan dan jadwal Anda.</p>
          </div>
          <LogoutButton />
        </div>

        <ClientList initialData={filteredData} />
      </div>
    </div>
  );
}
