// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)
    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================
class Product {
  static #list = []
  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 100000)
    this.createDate = () => {
      this.date = new Date().toISOString()
    }
  }
  static getList = () => this.#list
  checkId = (id) => this.id === id
  static add = (product) => {
    this.#list.push(product)
  }
  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, data) => {
    const product = this.getById(id)
    const { price, name, description } = data
    if (product) {
      if (name) {
        product.name = name
      }
	  if (price) {
        product.price = price
      }
	  if (description) {
        product.description = description
      }
      return true
    } else {
      return false
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user_product-index', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user_product-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user_product-index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})
// ↑↑ сюди вводимо JSON дані
// ================================================================

// router.post для опрацювання запитів методу POST

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body
  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('user-success-info', {
    style: 'user-success-info',
    info: `користувача ${login} створено`,
  })
})

// ================================================================

// Сторінка для видалення користувача

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/user-delete', function (req, res) {
  const { id, login } = req.query // важливо при get має бути query

  User.deleteById(Number(id))

  res.render('user-success-info', {
    style: 'user-success-info',
    info: `користувача видалено`,
  })
})

// ================================================================

// Сторінка для Modify користувача

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body // важливо при post має бути body
  let result = false

  const user = User.getById(Number(id))
  //console.log(email, password, id)

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('user-success-infoo', {
    style: 'user-success-info',
    info: result
      ? ` Email користувача ${id} оновлено`
      : ` Сталася помилка дані для  ${id} не оновлено`,
  })
})

// ================================================================

// =====================Product===========================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-list', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})
// ↑↑ сюди вводимо JSON дані

// ================================================================
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  //const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})
// =========================================================
// router.post для опрацювання запитів методу POST

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)

  Product.add(product)

  //console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: `Продукт ${name} з ціною ${price} створено`,
	href:`/product-list`
  })
})

// ================================================================

// Сторінка для видалення користувача

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/product-delete', function (req, res) {
  const { id } = req.query // важливо при get має бути query

  Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    info: `Продукт видалено`,
	href:`/product-list`
  })
})

// ================================================================

// Сторінка для Modify користувача
// ================================================================
router.get('/product-edit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query
  const product = Product.getById(Number(id))
  // console.log(product)
  if (product) {
    // ↙️ cюди вводимо назву файлу з сontainer
    return res.render('product-edit', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'product-edit',
      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      info: 'Продукту за таким ID не знайдено',
	  href:`/product-list`
    })
  }
})
// ↑↑ сюди вводимо JSON дані

// =========================================================
// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/product-edit', function (req, res) {
  const { id, price, name, description } = req.body // важливо при post має бути body

  //const product=Product.getById(Number(id));
  //console.log(price, name, description)

  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  })
  console.log(id)
  console.log(product)
  if (product) {
    res.render('alert', {
      style: 'alert',
      info: `Інформація про товар ${name} з ${id} оновлена`,
	  href:`/product-list`
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Сталася помилка',
	  href:`/product-list`
    })
  }
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

//   // ================================================================

// // router.get Створює нам один ентпоїнт

// // ↙️ тут вводимо шлях (PATH) до сторінки
// router.get('/alert', function (req, res) {
// 	// res.render генерує нам HTML сторінку

// 	res.render('alert', {
// 	  // вказуємо назву папки контейнера, в якій знаходяться наші стилі
// 	  style: 'alert',
// 	  info: 'result',

// 	})
//   })
//   // ↑↑ сюди вводимо JSON дані
//   // ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
