
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan Privasi untuk penggunaan data di situs MyRepublic Malang. Kami menghargai dan melindungi privasi Anda.',
  robots: {
    index: true,
    follow: true,
  }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 sm:py-16 px-4">
      <div className="prose prose-lg max-w-none text-foreground">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          Kebijakan Privasi
        </h1>
        <p className="text-muted-foreground">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2>Pendahuluan</h2>
        <p>
          Selamat datang di situs MyRepublic Malang yang dikelola oleh Sales/Mitra Resmi. Kami menghargai privasi pengunjung kami dan berkomitmen untuk melindungi informasi pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data yang Anda berikan saat menggunakan situs ini.
        </p>

        <h2>Informasi yang Kami Kumpulkan</h2>
        <p>
          Kami mengumpulkan informasi yang Anda berikan secara sukarela saat mengisi formulir pendaftaran atau kontak, yang dapat mencakup:
        </p>
        <ul>
          <li>Nama Lengkap</li>
          <li>Nomor Telepon (WhatsApp)</li>
          <li>Alamat Email</li>
          <li>Alamat Pemasangan</li>
          <li>Koordinat Lokasi (GPS)</li>
          <li>Paket yang Dipilih</li>
        </ul>

        <h2>Bagaimana Kami Menggunakan Informasi Anda</h2>
        <p>
          Informasi yang kami kumpulkan digunakan secara eksklusif untuk tujuan berikut:
        </p>
        <ul>
          <li><strong>Proses Pendaftaran:</strong> Untuk memproses permintaan pemasangan baru layanan MyRepublic Anda. Data seperti nama, alamat, dan nomor telepon sangat penting untuk verifikasi jangkauan, penjadwalan instalasi, dan komunikasi selama proses berlangsung.</li>
          <li><strong>Komunikasi:</strong> Untuk menghubungi Anda terkait pendaftaran Anda, memberikan pembaruan status, dan menjawab pertanyaan yang mungkin Anda miliki.</li>
          <li><strong>Notifikasi Internal:</strong> Untuk memberi tahu tim sales dan teknisi terkait adanya pendaftaran baru yang perlu ditindaklanjuti.</li>
        </ul>
        <p>
          <strong>Penting:</strong> Kami tidak akan pernah menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga untuk tujuan pemasaran tanpa persetujuan eksplisit dari Anda. Data nomor HP dan email Anda aman dan hanya digunakan untuk proses pendaftaran.
        </p>

        <h2>Keamanan Data</h2>
        <p>
          Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Komunikasi data formulir dilindungi untuk memastikan kerahasiaannya.
        </p>

        <h2>Tautan Pihak Ketiga</h2>
        <p>
          Situs kami mungkin berisi tautan ke situs pihak ketiga (misalnya, WhatsApp). Kebijakan Privasi ini tidak berlaku untuk situs-situs tersebut, dan kami tidak bertanggung jawab atas praktik privasi mereka. Kami menyarankan Anda untuk membaca kebijakan privasi dari setiap situs web yang Anda kunjungi.
        </p>

        <h2>Perubahan pada Kebijakan Ini</h2>
        <p>
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Setiap perubahan akan diposting di halaman ini. Dengan terus menggunakan situs ini setelah perubahan tersebut, Anda menyetujui kebijakan yang telah direvisi.
        </p>

        <h2>Hubungi Kami</h2>
        <p>
          Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui halaman <a href="/hubungi-kami">Hubungi Kami</a>.
        </p>
      </div>
    </div>
  );
}
