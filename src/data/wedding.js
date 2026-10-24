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
      parents: 'Putra pertama dari Bpk. Bayu\nPurnama & Ibu Sri Sutari',
      image: '/assets/the-gallery/cowok_kiri_fix.png',
      frame: '/assets/brides-groom/frame_rectangle_2-1-32.png',
    },
    bride: {
      name: 'Dea Maharani',
      parents: 'Putri kedua dari Bpk. Suryadi\n& Ibu Tri Diantinii (Yanti)',
      image: '/assets/the-gallery/cewek_kanan_fix.png',
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
    '/assets/gallery/main_2_gallery.png',
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

  // TODO: ganti link Google Maps & urutan foto detail acara
  detailAcara: {
    title: 'Detail Acara',
    image: '/assets/detail-acara/main_detail_acara.png',
    leftPhotos: ['/assets/detail-acara/gallery_1.png', '/assets/detail-acara/gallery_2.png'],
    rightPhotos: ['/assets/detail-acara/gallery_3.png', '/assets/detail-acara/gallery_4.png'],
    decorations: [
      { src: '/assets/detail-acara/star_assets.png', x: 14, y: 8, size: 105, rotate: -10 },
      { src: '/assets/detail-acara/love_assets.png', x: 86, y: 10, size: 95, rotate: 14 },
      { src: '/assets/detail-acara/star_assets.png', x: 87, y: 22, size: 90, rotate: 8 },
      { src: '/assets/detail-acara/love_asset.png', x: 8.5, y: 35, size: 95, rotate: -10 },
      { src: '/assets/detail-acara/love_assets.png', x: 91, y: 41, size: 95, rotate: 16 },
      { src: '/assets/detail-acara/camera_assets.png', x: 8, y: 53, size: 125, rotate: -15 },
      { src: '/assets/detail-acara/letter_asset.png', x: 92, y: 69, size: 125, rotate: 12 },
      { src: '/assets/detail-acara/merpati_asset.png', x: 8.5, y: 77, size: 125, rotate: 12 },
    ],
    denahLabel: 'Denah Lokasi',
    denahImage: '/assets/detail-acara/denah_lokasi.png',
    events: [
      {
        icon: '/assets/detail-acara/merpati.png',
        name: 'Akad Nikah',
        time: '10:00 – 12:00 WIB',
        date: 'Sabtu, 7 November 2026',
        address:
          'SMK Perguruan Cikini Jakarta\nJl. Alur Laut Blok NN No.1 5, RT.5/RW.10, Rawabadak Utara, Kec. Koja, Jakarta Utara, Daerah Khusus Ibukota Jakarta 14230',
      },
      {
        icon: '/assets/detail-acara/cincin.png',
        name: 'Resepsi',
        time: '14:00 – 17:00 WIB',
        date: 'Sabtu, 7 November 2026',
        address:
          'SMK Perguruan Cikini Jakarta\nJl. Alur Laut Blok NN No.1 5, RT.5/RW.10, Rawabadak Utara, Kec. Koja, Jakarta Utara, Daerah Khusus Ibukota Jakarta 14230',
      },
    ],
    mapsLabel: 'Click Here for Google Maps',
    mapsUrl: 'https://maps.app.goo.gl/XPRjcqMWeGNqpRgG6',
    closingMessage: 'You are my today and all of my tomorrows.',
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
        number: '5000136699',
        holder: 'Dea Maharani',
        logo: '/assets/tanda-kasih/bca-2.png',
      },
    ],
  },
  // Teks cover halaman pertama
  cover: {
    titleTop: 'The Wedding of',
    titleBottom: 'Ibnu & Dea',
    title: 'The Wedding of Ibnu & Dea',
    subtitle: "You're Invited",
  },

  music: '/assets/music/daylight_fix.mp3',

}

export default wedding
