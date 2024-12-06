// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-mahasiswa',
//   standalone: true,
//   imports: [],
//   templateUrl: './mahasiswa.component.html',
//   styleUrl: './mahasiswa.component.css'
// })
// export class MahasiswaComponent {

// }
import { CommonModule } from '@angular/common'; // Mengimpor modul Angular yang menyediakan direktif umum seperti ngIf, ngFor, dll.
import { Component, OnInit, inject } from '@angular/core'; // Mengimpor decorator Component, interface OnInit untuk inisialisasi, dan inject untuk injeksi dependency.
import { HttpClient } from '@angular/common/http'; // Mengimpor HttpClient untuk melakukan HTTP request ke server.
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; // Mengimpor modul dan class untuk membuat formulir reaktif.
import * as bootstrap from 'bootstrap'; // Mengimpor Bootstrap untuk manipulasi modal dan elemen lainnya.

@Component({
  selector: 'app-mahasiswa', // Selector untuk komponen ini digunakan dalam template HTML.
  standalone: true, // Menjadikan komponen ini sebagai standalone, tanpa bagian dari modul Angular lainnya.
  imports: [CommonModule, ReactiveFormsModule], // Mengimpor modul Angular yang dibutuhkan untuk komponen ini.
  templateUrl: './mahasiswa.component.html', // Lokasi file template HTML untuk komponen ini.
  styleUrls: ['./mahasiswa.component.css'] // Lokasi file CSS untuk komponen ini.
})
export class MahasiswaComponent implements OnInit { // Mendeklarasikan class komponen dengan implementasi OnInit untuk inisialisasi.
  mahasiswa: any[] = []; // Menyimpan data mahasiswa.
  prodi: any[] = []; // Menyimpan data program studi untuk dropdown.
  apiMahasiswaUrl = 'https://crud-express-seven.vercel.app/api/mahasiswa'; // URL API untuk mengambil dan menambahkan data mahasiswa.
  apiProdiUrl = 'https://crud-express-seven.vercel.app/api/prodi'; // URL API untuk mengambil data prodi.
  isLoading = true; // Indikator loading data dari API.
  mahasiswaForm: FormGroup; // Form group untuk formulir reaktif mahasiswa.
  isSubmitting = false; // Indikator proses pengiriman data.

  private http = inject(HttpClient); // Menggunakan Angular inject API untuk menyuntikkan HttpClient.
  private fb = inject(FormBuilder); // Menyuntikkan FormBuilder untuk membangun form reaktif.

  constructor() { // Konstruktor untuk inisialisasi komponen.
    this.mahasiswaForm = this.fb.group({ // Membuat grup form dengan FormBuilder.
      nama: [''], // Field nama mahasiswa.
      npm: [''], // Field NPM mahasiswa.
      jenis_kelamin: [''], // Field jenis kelamin mahasiswa.
      asal_sekolah: [''], // Field asal sekolah mahasiswa.
      prodi_id: [null], // Field prodi_id untuk relasi dengan program studi.
    });
  }

  ngOnInit(): void { // Lifecycle method Angular, dipanggil saat komponen diinisialisasi.
    this.getMahasiswa(); // Memanggil fungsi untuk mengambil data mahasiswa.
    this.getProdi(); // Memanggil fungsi untuk mengambil data prodi.
  }

  // Mengambil data mahasiswa
  getMahasiswa(): void {
    this.http.get<any[]>(this.apiMahasiswaUrl).subscribe({ // Melakukan HTTP GET ke API mahasiswa.
      next: (data) => { // Callback jika request berhasil.
        this.mahasiswa = data; // Menyimpan data mahasiswa ke variabel.
        this.isLoading = false; // Menonaktifkan indikator loading.
      },
      error: (err) => { // Callback jika request gagal.
        console.error('Error fetching mahasiswa data:', err); // Log error ke konsol.
        this.isLoading = false; // Menonaktifkan indikator loading.
      },
    });
  }

  // Mengambil data prodi untuk dropdown
  getProdi(): void {
    this.http.get<any[]>(this.apiProdiUrl).subscribe({ // Melakukan HTTP GET ke API prodi.
      next: (data) => { // Callback jika request berhasil.
        this.prodi = data; // Menyimpan data prodi ke variabel.
      },
      error: (err) => { // Callback jika request gagal.
        console.error('Error fetching prodi data:', err); // Log error ke konsol.
      },
    });
  }

  // Method untuk menambahkan mahasiswa
  addMahasiswa(): void {
    if (this.mahasiswaForm.valid) { // Memastikan form valid sebelum mengirim data.
      this.isSubmitting = true; // Mengaktifkan indikator pengiriman data.
      this.http.post(this.apiMahasiswaUrl, this.mahasiswaForm.value).subscribe({ // Melakukan HTTP POST ke API mahasiswa.
        next: (response) => { // Callback jika request berhasil.
          console.log('Mahasiswa berhasil ditambahkan:', response); // Log respons ke konsol.
          this.getMahasiswa(); // Refresh data mahasiswa setelah penambahan.
          this.mahasiswaForm.reset(); // Reset form setelah data dikirim.
          this.isSubmitting = false; // Menonaktifkan indikator pengiriman.

          // Tutup modal setelah data berhasil ditambahkan
          const modalElement = document.getElementById('tambahMahasiswaModal') as HTMLElement; // Ambil elemen modal berdasarkan ID.
          if (modalElement) { // Periksa jika elemen modal ada.
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement); // Ambil atau buat instance modal.
            modalInstance.hide(); // Sembunyikan modal.

            // Pastikan untuk menghapus atribut dan gaya pada body setelah modal ditutup
            modalElement.addEventListener('hidden.bs.modal', () => { // Tambahkan event listener untuk modal yang ditutup.
              const backdrop = document.querySelector('.modal-backdrop'); // Cari elemen backdrop modal.
              if (backdrop) { 
                backdrop.remove(); // Hapus backdrop jika ada.
              }

              // Pulihkan scroll pada body
              document.body.classList.remove('modal-open'); // Hapus class 'modal-open' dari body.
              document.body.style.overflow = ''; // Pulihkan properti overflow pada body.
              document.body.style.paddingRight = ''; // Pulihkan padding body.
            }, { once: true }); // Event listener hanya dijalankan sekali.
          }
        },
        error: (err) => { // Callback jika request gagal.
          console.error('Error menambahkan mahasiswa:', err); // Log error ke konsol.
          this.isSubmitting = false; // Menonaktifkan indikator pengiriman.
        },
      });
    }
  }
}
