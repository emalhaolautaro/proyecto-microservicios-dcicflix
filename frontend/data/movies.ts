export interface Movie {
  id: number
  title: string
  year: number
  duration: string
  genre: string
  director: string
  description: string
  videoUrl?: string // URL del video para reproducir
  posterUrl?: string // URL del poster de la película
  publicDomainReason: string // Razón por la que es de dominio público
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "Nosferatu",
    year: 1922,
    duration: "1h 34m",
    genre: "Horror",
    director: "F.W. Murnau",
    description: "El clásico vampiro alemán que definió el género de terror.",
    videoUrl: "https://www.youtube.com/embed/xbT1vrsNUT0?si=lA-Ug_PZQrMCgfmO",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/lsG4UFjL8SGKaH0Nz8vgFVJGifM.jpg",
    publicDomainReason: "Copyright expiró en 1998 (70 años después de la muerte del director en 1931)"
  },
  {
    id: 2,
    title: "Metropolis",
    year: 1927,
    duration: "2h 33m",
    genre: "Sci-Fi",
    director: "Fritz Lang",
    description: "Obra maestra del cine mudo sobre una sociedad futurista.",
    videoUrl: "https://www.youtube.com/embed/6qiBk6oQ1RI?si=1A7AFFOWwZYd7Psj",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/vODOVn29fr0nLF9MVfpfKDcxuXF.jpg",
    publicDomainReason: "Producida en Alemania antes de 1923, no tuvo protección de copyright en Estados Unidos"
  },
  {
    id: 3,
    title: "The Cabinet of Dr. Caligari",
    year: 1920,
    duration: "1h 16m",
    genre: "Horror",
    director: "Robert Wiene",
    description: "Pionero del expresionismo alemán en el cine.",
    videoUrl: "https://www.youtube.com/embed/gEpAFK8mLuI?si=lYLiqDC6Aam2Gmfy",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/cXSzcOF6RINcXrExn0nR4ExFoR3.jpg",
    publicDomainReason: "Película alemana de 1920, anterior a las leyes internacionales de copyright"
  },
  {
    id: 4,
    title: "Night of the Living Dead",
    year: 1968,
    duration: "1h 36m",
    genre: "Horror",
    director: "George A. Romero",
    description: "La película que creó el género zombie moderno.",
    videoUrl: "https://www.youtube.com/embed/l-FGlw6jWgQ?si=9WPA6YmovzjlQuxS",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/rb2NWyb008u1EcKCOyXs2Nmj0ra.jpg",
    publicDomainReason: "Los distribuidores no incluyeron el aviso de copyright requerido en los créditos"
  },
  {
    id: 5,
    title: "Plan 9 from Outer Space",
    year: 1957,
    duration: "1h 19m",
    genre: "Sci-Fi",
    director: "Ed Wood",
    description: "Famosa película B de ciencia ficción.",
    videoUrl: "https://www.youtube.com/embed/qsb74pW7goU?si=uSrqFgtjYKXICO4s",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/bmicZi7PvlnZ9rZqp6QXN2Db0pT.jpg",
    publicDomainReason: "Copyright no fue renovado después de los 28 años iniciales de protección"
  },
  {
    id: 6,
    title: "The Phantom of the Opera",
    year: 1925,
    duration: "1h 33m",
    genre: "Horror",
    director: "Rupert Julian",
    description: "El clásico del terror con Lon Chaney.",
    videoUrl: "https://www.youtube.com/embed/uA2pvD-hx9Y?si=r-AymI_4ckjXOVkC",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/bpJKYjCu64wrI40LTAEcKve4bKD.jpg",
    publicDomainReason: "Producida antes de 1923, automáticamente en dominio público en Estados Unidos"
  },
  {
    id: 7,
    title: "Battleship Potemkin",
    year: 1925,
    duration: "1h 15m",
    genre: "Drama",
    director: "Sergei Eisenstein",
    description: "Obra maestra del montaje cinematográfico soviético.",
    videoUrl: "https://www.youtube.com/embed/mCR44ihk6C8?si=DLZYZTdyREiktTGS",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/zAfqJQlV2kcSuZpIkmIKohAbDDp.jpg",
    publicDomainReason: "Película soviética anterior a 1923, nunca tuvo copyright en Estados Unidos"
  },
  {
    id: 8,
    title: "The Birth of a Nation",
    year: 1915,
    duration: "3h 15m",
    genre: "Drama",
    director: "D.W. Griffith",
    description: "Película histórica controvertida pero técnicamente innovadora.",
    videoUrl: "https://www.youtube.com/embed/4wZQeXT_EWY?si=4nL7z0Lonsfon-jn",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/4jHXoc4IwzirilhBh3vEuhyQhYe.jpg",
    publicDomainReason: "Producida en 1915, automáticamente en dominio público por antigüedad"
  },
  {
    id: 9,
    title: "Intolerance",
    year: 1916,
    duration: "3h 17m",
    genre: "Drama",
    director: "D.W. Griffith",
    description: "Épica ambiciosa sobre la intolerancia a través de la historia.",
    videoUrl: "https://www.youtube.com/embed/QTrBrDWxjg8?si=SE7fQz-kcO74wwN1",
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Intolerance_%28film%29.jpg/800px-Intolerance_%28film%29.jpg",
    publicDomainReason: "Producida en 1916, automáticamente en dominio público por antigüedad"
  },
  {
    id: 10,
    title: "The Great Train Robbery",
    year: 1903,
    duration: "12m",
    genre: "Western",
    director: "Edwin S. Porter",
    description: "Una de las primeras películas narrativas del cine.",
    videoUrl: "https://www.youtube.com/embed/cT6Pz9t89Lk?si=AV66mAAhqw4zKy4e",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/ckSEVwg554zEjCnSFHc4ZHe6hfB.jpg",
    publicDomainReason: "Producida en 1903, muy anterior a las leyes modernas de copyright"
  },
  {
    id: 11,
    title: "A Trip to the Moon",
    year: 1902,
    duration: "13m",
    genre: "Sci-Fi",
    director: "Georges Méliès",
    description: "Pionera del cine de ciencia ficción y efectos especiales.",
    videoUrl: "https://www.youtube.com/embed/ZNAHcMMOHE8?si=1QY2HxqB6SsKisLq",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/6KEHWjimW5LlnVW7dkx4oq3yetI.jpg",
    publicDomainReason: "Producida en 1902, muy anterior a las protecciones internacionales de copyright"
  },
  {
    id: 12,
    title: "The Gold Rush",
    year: 1925,
    duration: "1h 35m",
    genre: "Comedy",
    director: "Charlie Chaplin",
    description: "Clásica comedia de Chaplin en Alaska.",
    videoUrl: "https://www.youtube.com/embed/PCNyfVMEmqM?si=KSben5FMkL_7eNXl",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/eQRFo1qwRREYwj47Yoe1PisgOle.jpg",
    publicDomainReason: "Copyright expiró por falta de renovación en el sistema estadounidense de 28 años"
  },
  {
    id: 13,
    title: "Sherlock Jr.",
    year: 1924,
    duration: "45m",
    genre: "Comedy",
    director: "Buster Keaton",
    description: "Obra maestra de Buster Keaton sobre cine dentro del cine.",
    videoUrl: "https://www.youtube.com/embed/4oWK7vCGM3g?si=nGURu_PAVly1MSYP",
    posterUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Sherlock_jr_poster.jpg",
    publicDomainReason: "Producida en 1924, copyright no fue renovado correctamente"
  },
  {
    id: 14,
    title: "The General",
    year: 1926,
    duration: "1h 7m",
    genre: "Action",
    director: "Buster Keaton",
    description: "Épica de acción de Keaton ambientada en la Guerra Civil.",
    videoUrl: "https://www.youtube.com/embed/hNovKyCYKZ0?si=6LNU67_E08qdFPZR",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/nIp4gIXogCjfB1QABNsWwa9gSca.jpg",
    publicDomainReason: "Copyright expiró tras no ser renovado después del período inicial de 28 años"
  },
  {
    id: 15,
    title: "Safety Last!",
    year: 1923,
    duration: "1h 10m",
    genre: "Comedy",
    director: "Fred C. Newmeyer",
    description: "Harold Lloyd en su famosa escena colgando del reloj.",
    videoUrl: "https://www.youtube.com/embed/DcMJc0KkTms?si=0x-8KLyVSRMnR94M",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/fEt5HWJ32ek8ibef7zSZnA00Jp0.jpg",
    publicDomainReason: "Producida en 1923, justo en el límite de entrada automática al dominio público"
  },
  {
    id: 16,
    title: "The Man with a Movie Camera",
    year: 1929,
    duration: "1h 8m",
    genre: "Documentary",
    director: "Dziga Vertov",
    description: "Documental experimental soviético sobre la vida urbana.",
    videoUrl: "https://www.youtube.com/embed/3GyNB4-eN1E?si=Ry32TRv17tM3SnoG",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/oirgjyrLqrCCP2SDnsGb0e9Ws4l.jpg",
    publicDomainReason: "Película soviética de 1929, nunca tuvo protección de copyright en Occidente"
  },
  {
    id: 17,
    title: "Häxan",
    year: 1922,
    duration: "1h 45m",
    genre: "Horror",
    director: "Benjamin Christensen",
    description: "Documental-ficción sobre brujería y superstición.",
    videoUrl: "https://archive.org/embed/Haxan_201510",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/1ZILGNPote7d7C8UNCISTdtELyW.jpg",
    publicDomainReason: "Película danesa de 1922, anterior a las protecciones internacionales de copyright"
  },
  {
    id: 18,
    title: "The Adventures of Prince Achmed",
    year: 1926,
    duration: "1h 5m",
    genre: "Fantasy",
    director: "Lotte Reiniger",
    description: "Primera película de animación de largometraje.",
    videoUrl: "https://www.youtube.com/embed/_RlnylV5lQk?si=gt4R2S68tvdLu8ii",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/3NMYlguqMavc0JIK0rN9MZqV4tY.jpg",
    publicDomainReason: "Película alemana de 1926, copyright expiró por no ser renovado"
  },
  {
    id: 19,
    title: "The Passion of Joan of Arc",
    year: 1928,
    duration: "1h 54m",
    genre: "Drama",
    director: "Carl Theodor Dreyer",
    description: "Obra maestra del cine mudo sobre Juana de Arco.",
    videoUrl: "https://www.youtube.com/embed/P_gly_fIfEE?si=x1I7sZGT-Ipxd7dq",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/plzI7N52uHhERUZLNSVbGGakFwR.jpg",
    publicDomainReason: "Película francesa de 1928, copyright no fue renovado en Estados Unidos"
  },
  {
    id: 20,
    title: "The Kid",
    year: 1921,
    duration: "1h 8m",
    genre: "Comedy",
    director: "Charlie Chaplin",
    description: "Tierna comedia de Chaplin sobre un vagabundo y un niño.",
    videoUrl: "https://www.youtube.com/embed/Lih7_P_hdNg?si=PWrspyky3lpbAo4N",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/A9NWYyn7eX0H9XIjaOvfWJ9mCGA.jpg",
    publicDomainReason: "Producida en 1921, automáticamente en dominio público por antigüedad"
  },
  {
    id: 21,
    title: "Sunrise: A Song of Two Humans",
    year: 1927,
    duration: "1h 34m",
    genre: "Romance",
    director: "F.W. Murnau",
    description: "Poema visual sobre amor y redención.",
    videoUrl: "https://www.youtube.com/embed/S_5RESfBBgA?si=TXAkok8dSnNhb1HW",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/oj8ZW8jKXBSs8F1e5iWsTUeXSJW.jpg",
    publicDomainReason: "Copyright no fue renovado después del período inicial de protección"
  },
  {
    id: 22,
    title: "The Last Laugh",
    year: 1924,
    duration: "1h 30m",
    genre: "Drama",
    director: "F.W. Murnau",
    description: "Drama mudo sobre la dignidad humana.",
    videoUrl: "https://www.youtube.com/embed/Djqmwlj3ZqQ?si=MjIkRIZa93P4mHr0",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTk2MzY4MzcwOV5BMl5BanBnXkFtZTgwOTU4NTcwMjE@._V1_.jpg",
    publicDomainReason: "Película alemana de 1924, copyright expiró por falta de renovación"
  },
  {
    id: 23,
    title: "Steamboat Willie",
    year: 1928,
    duration: "8m",
    genre: "Fantasy",
    director: "Walt Disney",
    description: "Debut sonoro de Mickey Mouse.",
    videoUrl: "https://www.youtube.com/embed/I5pG1wbRKOg?si=62NVmnKw69DywTIC",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/ybR0RzVkF9OLEsQHfYMDVgjrmH8.jpg",
    publicDomainReason: "Entró al dominio público en 2024 tras cumplirse 95 años desde su publicación"
  },
  {
    id: 24,
    title: "The Golem",
    year: 1920,
    duration: "1h 25m",
    genre: "Horror",
    director: "Paul Wegener",
    description: "Leyenda del golem de Praga en el cine expresionista.",
    videoUrl: "https://www.youtube.com/embed/bN2Pt4OGego?si=KdCDv853pEwVOP9N",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/uCW9SCWApOzNll4iIiuBgQ2K7KA.jpg",
    publicDomainReason: "Película alemana de 1920, anterior a las protecciones internacionales modernas"
  },
  {
    id: 25,
    title: "The Immigrant",
    year: 1917,
    duration: "24m",
    genre: "Comedy",
    director: "Charlie Chaplin",
    description: "Cortometraje de Chaplin sobre inmigración.",
    videoUrl: "https://www.youtube.com/embed/RV_a3H9UYXk?si=5fsdBfWUumotqDQT",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/f4xP9DvXKqpYKo0Fth5tKyZY8ej.jpg",
    publicDomainReason: "Producida en 1917, automáticamente en dominio público por antigüedad"
  },
  {
    id: 26,
    title: "The Thief of Bagdad",
    year: 1924,
    duration: "2h 35m",
    genre: "Adventure",
    director: "Raoul Walsh",
    description: "Épica aventura de fantasía con Douglas Fairbanks.",
    videoUrl: "https://www.youtube.com/embed/FZuwscYZhf8?si=c0fMzeF1rjUfEls5",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/8t4CJ591N2FATf2yUiQNQk9p0tB.jpg",
    publicDomainReason: "Copyright no fue renovado tras el período inicial de 28 años"
  },
  {
    id: 27,
    title: "Dr. Jekyll and Mr. Hyde",
    year: 1920,
    duration: "1h 19m",
    genre: "Thriller",
    director: "John S. Robertson",
    description: "Adaptación clásica de la novela de Stevenson.",
    videoUrl: "https://www.youtube.com/embed/ullJoBolcqE?si=nZOHaS1KMwT40C5Z",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/iouotwCZjnpezoXOV2qFo3aC6cb.jpg",
    publicDomainReason: "Producida en 1920, automáticamente en dominio público por antigüedad"
  },
  {
    id: 28,
    title: "The Cat and the Canary",
    year: 1927,
    duration: "1h 48m",
    genre: "Mystery",
    director: "Paul Leni",
    description: "Misterio de casa embrujada del cine mudo.",
    videoUrl: "https://www.youtube.com/embed/iukAGXR1mD0?si=Lswqj-Wc8hz1FHPq",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/iPfklQJoxHQRNTjAnFkv4wpFRs1.jpg",
    publicDomainReason: "Copyright expiró por no ser renovado después del período inicial"
  },
  {
    id: 29,
    title: "Robin Hood",
    year: 1922,
    duration: "2h 23m",
    genre: "Adventure",
    director: "Allan Dwan",
    description: "Aventuras épicas de Robin Hood con Douglas Fairbanks.",
    videoUrl: "https://www.youtube.com/embed/SGWNp0j6Vgg?si=q2r3t-3IWh6oQQ_k",
    posterUrl: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p19043_p_v8_aa.jpg",
    publicDomainReason: "Producida en 1922, automáticamente en dominio público por antigüedad"
  },
  {
    id: 30,
    title: "The Mark of Zorro",
    year: 1920,
    duration: "1h 30m",
    genre: "Adventure",
    director: "Fred Niblo",
    description: "Las aventuras del enmascarado justiciero.",
    videoUrl: "https://www.youtube.com/embed/-SmwZ144F6E?si=crPFhWIOJACYXpQ-",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/4USBYELPcCLxl9Z8R9MPEcvGaoL.jpg",
    publicDomainReason: "Producida en 1920, automáticamente en dominio público por antigüedad"
  },
  {
    id: 31,
    title: "A star is born",
    year: 1937,
    duration: "1h 51m",
    genre: "Romance",
    director: "William A. Wellman",
    description: "Un actor alcohólico ayuda a una joven a alcanzar la fama, pero su carrera decae.",
    videoUrl: "https://www.youtube.com/embed/NFvCgvEUYVk?si=EX8d72ordbLJ5nTg",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/dZ2G4EPlIAWZzzFukZPmONRJEs8.jpg",
    publicDomainReason: "Copyright no fue renovado después del período inicial de 28 años de protección"
  },
  {
    id: 32,
    title: "The little princess",
    year: 1939,
    duration: "1h 33m",
    genre: "Drama",
    director: "Walter Lang",
    description: "Una niña rica que cae en desgracia sigue creyendo en la bondad y el amor.",
    videoUrl: "https://www.youtube.com/embed/V9JSRHVuLBE?si=ehHwt9LFRax-wzr3",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/yogrkvZrwQs9uV5s01RcUh1qred.jpg",
    publicDomainReason: "Copyright no fue renovado tras el vencimiento del período inicial de protección"
  },
  {
    id: 33,
    title: "The count of Monte Cristo",
    year: 1934,
    duration: "1h 53m",
    genre: "Adventure",
    director: "Rowland V. Lee",
    description: "Tras pasar 13 años en prisión injustamente encarcelado, Edmundo Dantés logra fugar para maquinar una diabólica venganza contra sus enemigos.",
    videoUrl: "https://www.youtube.com/embed/V8N0WDmjLU4?si=TK4dOzoBVFxpaw2_",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/oq4x1Bobtuc5890Xw7Te9dLW47H.jpg",
    publicDomainReason: "Copyright expiró por no ser renovado después de los 28 años iniciales"
  },
  {
    id: 34,
    title: "Begotten",
    year: 1991,
    duration: "1h 12m",
    genre: "Horror",
    director: "E. Elias Merhige",
    description: "Una experiencia visual perturbadora sin diálogo que reimagina la creación bíblica a través de imágenes oníricas y surrealistas en blanco y negro.",
    videoUrl: "https://archive.org/embed/y-2mate.com-begotten-full-movie-1990-480p",
    posterUrl: "https://www.themoviedb.org/t/p/w1280/rvgYcVToOHe0gKWtF3mz6SvM4Aw.jpg",
    publicDomainReason: "El director liberó voluntariamente la película al dominio público"
  },
]

// Función para obtener géneros únicos
export const getGenres = (): string[] => {
  const genres = movies.map((movie) => movie.genre)
  return ["Todos", ...Array.from(new Set(genres))]
}

// Función para filtrar películas por género
export const filterMoviesByGenre = (genre: string): Movie[] => {
  if (genre === "Todos") return movies
  return movies.filter((movie) => movie.genre === genre)
}

// Función para obtener una película por ID
export const getMovieById = (id: number): Movie | undefined => {
  return movies.find((movie) => movie.id === id)
}

// Función para obtener una película por título
export const getMovieByTitle = (title: string): Movie | undefined => {
  return movies.find((movie) => 
    movie.title.toLowerCase().trim() === title.toLowerCase().trim()
  )
}