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

@Component({
  selector: 'app-mahasiswa', // Selector untuk komponen ini digunakan dalam template HTML.
  standalone: true, // Menjadikan komponen ini sebagai standalone, tanpa bagian dari modul Angular lainnya.
  imports: [CommonModule, ReactiveFormsModule], // Mengimpor modul Angular yang dibutuhkan untuk komponen ini.
  templateUrl: './mahasiswa.component.html', // Lokasi file template HTML untuk komponen ini.
  styleUrls: ['./mahasiswa.component.css'] // Lokasi file CSS untuk komponen ini.
})
export class MahasiswaComponent implements OnInit {
  mahasiswa: any[] = []; // Menyimpan data mahasiswa.
  prodi: any[] = []; // Menyimpan data program studi untuk dropdown.
  apiMahasiswaUrl = 'https://crud-express-seven.vercel.app/api/mahasiswa'; // URL API untuk mengambil dan menambahkan data mahasiswa.
  apiProdiUrl = 'https://crud-express-seven.vercel.app/api/prodi'; // URL API untuk mengambil data program studi.
  isLoading = true; // Indikator loading data dari API.
  mahasiswaForm: FormGroup; // Form group untuk formulir reaktif mahasiswa.
  isSubmitting = false; // Indikator proses pengiriman data.

  private http = inject(HttpClient); // Menggunakan Angular inject API untuk menyuntikkan HttpClient.
  private fb = inject(FormBuilder); // Menyuntikkan FormBuilder untuk membangun form reaktif.

  constructor() {
    // Membuat grup form dengan FormBuilder.
    this.mahasiswaForm = this.fb.group({
      nama: [''], // Field nama mahasiswa.
      npm: [''], // Field npm mahasiswa.
      jenis_kelamin: [''], // Field jenis kelamin.
      asal_sekolah: [''], // Field asal sekolah.
      prodi_id: [null] // Field prodi_id untuk relasi dengan program studi.
    });
  }

  ngOnInit(): void {
    this.getMahasiswa(); // Memanggil fungsi untuk mengambil data mahasiswa.
    this.getProdi(); // Memanggil fungsi untuk mengambil data program studi.
  }

  // Mengambil data mahasiswa
  getMahasiswa(): void {
    this.http.get<any[]>(this.apiMahasiswaUrl).subscribe({
      next: (data) => {
        this.mahasiswa = data; // Menyimpan data mahasiswa ke variabel.
        this.isLoading = false; // Menonaktifkan indikator loading.
      },
      error: (err) => {
        console.error('Error fetching mahasiswa data:', err); // Log error ke konsol.
        this.isLoading = false; // Menonaktifkan indikator loading.
      },
    });
  }

  // Mengambil data program studi untuk dropdown
  getProdi(): void {
    this.http.get<any[]>(this.apiProdiUrl).subscribe({
      next: (data) => {
        this.prodi = data; // Menyimpan data program studi ke variabel.
      },
      error: (err) => {
        console.error('Error fetching prodi data:', err); // Log error ke konsol.
      },
    });
  }

  // Menambahkan data mahasiswa
  addMahasiswa(): void {
    if (this.mahasiswaForm.valid) {
      this.isSubmitting = true;
      this.http.post(this.apiMahasiswaUrl, this.mahasiswaForm.value).subscribe({
        next: (response) => {
          console.log('Mahasiswa berhasil ditambahkan:', response);
          this.getMahasiswa(); // Refresh data mahasiswa setelah penambahan.
          this.mahasiswaForm.reset(); // Reset form setelah data dikirim.
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error menambahkan mahasiswa:', err);
          this.isSubmitting = false;
        },
      });
    }
  }
}

