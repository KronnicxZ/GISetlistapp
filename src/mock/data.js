export const mockSongs = [
  {
    id: '1',
    title: 'Wonderwall',
    artist: 'Oasis',
    bpm: '120',
    key: 'Am',
    lyrics: 'Today is gonna be the day\nThat they\'re gonna throw it back to you\nBy now you should\'ve somehow\nRealized what you gotta do',
    notes: 'Intro: Am G F C\nVerse: Am G F C\nChorus: C G Am F',
  },
  {
    id: '2',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    bpm: '125',
    key: 'D',
    lyrics: 'She\'s got a smile that it seems to me\nReminds me of childhood memories\nWhere everything was as fresh as the bright blue sky',
    notes: 'Intro: D C G\nVerse: D C G\nChorus: G D C',
  },
  {
    id: '3',
    title: 'Nothing Else Matters',
    artist: 'Metallica',
    bpm: '110',
    key: 'Em',
    lyrics: 'So close, no matter how far\nCouldn\'t be much more from the heart\nForever trusting who we are\nAnd nothing else matters',
    notes: 'Intro: Em C G D\nVerse: Em C G D\nChorus: C G D Em',
  },
  {
    id: '4',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    bpm: '115',
    key: 'Am',
    lyrics: 'There\'s a lady who\'s sure\nAll that glitters is gold\nAnd she\'s buying a stairway to heaven',
    notes: 'Intro: Am C G D\nVerse: Am C G D\nChorus: C G D Am',
  },
  {
    id: '5',
    title: 'Hotel California',
    artist: 'Eagles',
    bpm: '118',
    key: 'Bm',
    lyrics: 'On a dark desert highway\nCool wind in my hair\nWarm smell of colitas\nRising up through the air',
    notes: 'Intro: Bm F# A E G D Em F#\nVerse: Bm F# A E G D Em F#',
  },
];

export const mockSetlists = [
  {
    id: '1',
    name: 'Concierto de Rock Clásico',
    date: '2023-12-15',
    songs: ['1', '2', '4'],
  },
  {
    id: '2',
    name: 'Noche de Baladas',
    date: '2023-12-20',
    songs: ['3', '5'],
  },
  {
    id: '3',
    name: 'Festival de Verano',
    date: '2024-01-10',
    songs: ['1', '2', '3', '4', '5'],
  },
];