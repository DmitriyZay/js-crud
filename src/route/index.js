// Підключаємо технологію express для back-end сервера
const express = require('express')

// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ================================================================
class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }
  //====
  static getById(id) {
    return (
      Track.#list.find((track) => track.id === id) || null
    )
  }
  //====
}
Track.create(
  'Fist track',
  'Name1',
  'https://picsum.photos/100/100',
)
Track.create(
  'Second track',
  'Name2',
  'https://picsum.photos/100/100',
)
Track.create(
  'Third track',
  'Name3',
  'https://picsum.photos/100/100',
)
Track.create(
  'Fourth track',
  'Name4',
  'https://picsum.photos/100/100',
)
Track.create(
  'Fifth track',
  'Name5',
  'https://picsum.photos/100/100',
)
Track.create(
  'Sixth track',
  'Name6',
  'https://picsum.photos/100/100',
)
Track.create(
  'Seven track',
  'Name7',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class Playlist {
  static #list = []
  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse
  }
  static makeMix(playlist) {
    const allTracks = Track.getList()
    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }
  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrack(track) {
    this.playlist.push(track)
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}
Playlist.makeMix(Playlist.create('Test1'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-choose', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('spotify-choose', {
    style: 'spotify-choose',
    data: {},
  })
})
// ↑↑ сюди вводимо JSON дані
// ================================================================
router.get('/spotify-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const isMix = !!req.query.isMix

  console.log(isMix)

  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
})
// ================================================================
router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      // важливо має бути return щоб далі не пілшо відпрацювання коду
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Необхідно ввести назву плейлиста',
        href: isMix
          ? `/spotify-create?isMix=true`
          : '/spotify-create',
      },
    })
  }
  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================
router.get('/spotify-playlist', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такогоо плейлиста не знайдено',
        href: `/`,
      },
    })
  }

  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-track-delete', function (req, res) {
  // res.render генерує нам HTML сторінку
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)
  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        href: `/spotify-playlist?id=${playlist.id}`,
      },
    })
  }
  playlist.deleteTrackById(trackId)

  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// ================================================================

router.get('/spotify-search', function (req, res) {
  // res.render генерує нам HTML сторінку
  const value = ''
  const list = Playlist.findListByValue(value)

  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amoount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  // res.render генерує нам HTML сторінку
  const value = req.body.value || ''
  const list = Playlist.findListByValue(value)
  console.log(value)

  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

// ================================================================

router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list1 = Playlist.getList()
  console.log('getList=', list1)
  // ↙️ cюди вводимо назву файлу з сontainer
  const value = ''
  const list = Playlist.findListByValue(value)
  
  console.log('findListByValue=', list)
  res.render('spotify-main', {
    style: 'spotify-main',
    data: {
      list,
	  list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
	
    },
  })
})
//=============================================
router.get('/spotify-add', function (req, res) {
	// res.render генерує нам HTML сторінку
	const playlistId = Number(req.query.playlistId)
	const playlist = Playlist.getById(playlistId)
	const tracks = Track.getList()
  
	console.log(playlistId)
	console.log(playlist.name)
	console.log(tracks.name)
  
	// ↙️ cюди вводимо назву файлу з сontainer
  
	res.render('spotify-add', {
	  style: 'spotify-add',
	  data: {
		playlistId: playlist.id,
		tracks: tracks,
	  },
	})
  })

//============================================

router.post('/spotify-add', function (req, res) {
	const playlistId = Number(req.body.playlistId)
	const trackId = Number(req.body.trackId)
	const playlist = Playlist.getById(playlistId)
	
	console.log ('playlistId:',playlistId)
	console.log ('trackId:',trackId)
	console.log ('playlist:',playlist)
	
	if (!playlist) {
	  return res.render('alert', {
		style: 'alert',
		data: {
		  message: 'Помилка',
		  info: 'Такого плейліста не знайдено',
		  href: `/spotify-playlist?id=${playlistId}`,

		},
	  })
	}

	
	const trackToAdd = Track.getList().find(
	  (track) => track.id === trackId,
	)
	if (!trackToAdd) {
	  return res.render('alert', {
		style: 'alert',
		data: {
		  message: 'Помилка',
		  info: 'Такого треку не знайдено',
		  link: `/spotify-add?playlistId=${playlistId}`,
		},
	  })
	}


	

	playlist.tracks.push(trackToAdd)
	res.render('spotify-playlist', {
	  style: 'spotify-playlist',
	  data: {
		playlistId: playlist.id,
		tracks: playlist.tracks,
		name: playlist.name,
	  },
	})
  })
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
