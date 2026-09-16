// ============================================================
// SEMUA KONTEN UNDANGAN TERPUSAT DI FILE INI.
// Ganti nilai di bawah dengan data asli. Jangan hardcode teks
// di dalam komponen agar mudah dirawat.
// Tanda TODO menandai bagian yang wajib diganti.
// ============================================================

export const wedding = {
  bridesGroom: {
    quote:
      'Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.',
    quoteSource: 'QS. Ar-Rum (30): 21',
    tagline: 'Two souls, one heart. The beginning of forever.',
    groom: {
      name: 'Ibnu Anggun Priyono',
      parents: 'Putra pertama dari Bpk. Bayu Purnawan & Ibu Sri Sutari',
      address: '(Alamat lengkap domisili)',
      image: '/assets/gallery/gallery-12.jpeg',
      frame: '/assets/brides-groom/frame_rectangle_2-1-32.png',
    },
    bride: {
      name: 'Dea Maharani',
      parents: 'Putri kedua dari Bpk. Suryadi & Ibu Tri Diantini',
      address: '(Alamat lengkap domisili)',
      image: '/assets/gallery/gallery-01.jpeg',
      frame: '/assets/brides-groom/frame_rectangle_2-1-38.png',
    },
    logo: '/assets/brides-groom/logo_2.png',
    illustration: '/assets/brides-groom/person_2.png',
    decorations: [
      '/assets/brides-groom/icon15-1-13.png',
      '/assets/brides-groom/icon8-1-12.png',
      '/assets/brides-groom/icon16-1-14.png',
      '/assets/brides-groom/icon13-3-15.png',
      '/assets/brides-groom/icon3-1-16.png',
      '/assets/brides-groom/icon5-1-17.png',
      '/assets/brides-groom/icon3-3-18.png',
      '/assets/brides-groom/icon3-4-19.png',
      '/assets/brides-groom/icon11-1-20.png',
      '/assets/brides-groom/icon14-1-21.png',
      '/assets/brides-groom/icon17-1-22.png',
      '/assets/brides-groom/icon9-1-23.png',
    ],
  },

  saveTheDate: {
    title: 'Save The Date',
    dateLabel: '7 November 2026',
    countdownLabel: 'Hingga hari bahagia kami — 7 November 2026 Pukul 10:00 WIB',
    targetDate: '2026-11-07T10:00:00+07:00',
    month: 'November 2026',
    highlightDay: 7,
    accentDays: [1, 8, 15, 22, 29],
    decorations: [
      'icon13-1-51.png',
      'icon13-3-52.png',
      'icon3-1-53.png',
      'icon16-1-54.png',
      'icon3-3-55.png',
      'icon5-1-56.png',
      'icon8-1-57.png',
    ],
  },

  // TODO: ganti daftar foto galeri (lokal di src/assets atau URL)
  gallery: [
    '/assets/gallery/gallery-01.jpeg',
    '/assets/gallery/gallery-02.jpeg',
    '/assets/gallery/gallery-03.jpeg',
    '/assets/gallery/gallery-04.jpeg',
    '/assets/gallery/gallery-05.jpeg',
    '/assets/gallery/gallery-06.jpeg',
    '/assets/gallery/gallery-07.jpeg',
    '/assets/gallery/gallery-08.jpeg',
    '/assets/gallery/gallery-09.jpeg',
    '/assets/gallery/gallery-10.jpeg',
    '/assets/gallery/gallery-11.jpeg',
    '/assets/gallery/gallery-12.jpeg',
    '/assets/gallery/gallery-13.jpeg',
    '/assets/gallery/gallery-14.jpeg',
    '/assets/gallery/gallery-15.jpeg',
  ],
  galleryPage: {
    title: 'The Gallery',
    message:
      'Together with our family, we invite you to join us in our wedding. Your presence is the greatest gift.',
    decorations: {
      left: '/assets/the-gallery/icon14-1-17.png',
      right: '/assets/the-gallery/icon17-2-42.png',
      frame: '/assets/the-gallery/rectangle-537-6.svg',
    },
  },

  giftPage: {
    title: 'Tanda Kasih',
    description:
      'Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih untuk kami, dapat melalui',
    closingName: 'Ibnu & Dea',
    closingMessage:
      "Two souls, one heart. The beginning of forever. Your presence is the greatest gift of all. We can't wait to celebrate with you!",
    decoration: '/assets/tanda-kasih/rectangle-537-4.svg',
    icon: '/assets/tanda-kasih/icon8-1-6.png',
    accounts: [
      {
        bank: 'Bank BCA',
        number: '1234567890',
        holder: 'Dea Maharani',
        logo: '/assets/tanda-kasih/bca-2.png',
      },
      {
        bank: 'Bank Mandiri',
        number: '1380004567890',
        holder: 'Dea Maharani',
        logo: '/assets/tanda-kasih/mandiri-1.png',
      },
    ],
  },
  // Teks cover halaman pertama
  cover: {
    title: 'This Kids are Getting Married',
    subtitle: "You're Invited",
    // TODO: nama tamu bisa dibuat dinamis dari query ?to=Nama
  },

  // TODO: backsound — letakkan file di public/music/backsound.mp3
  music: '/music/backsound.mp3',

}

export default wedding
