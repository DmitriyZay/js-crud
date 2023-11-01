// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []
  static #count = 0
  constructor(
    img,
    title,
    description,
    category,
    price,
    amount=0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }
  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }
  static getList = () => {
    return this.#list
  }
  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }
  static getRandomList = (id) => {
    const filtereList = this.#list.filter(
      (product) => product.id !== id,
    )
    const shuffledList = filtereList.sort(
      () => Math.random() - 0.5,
    )
    return shuffledList.slice(0, 3)
  }
}
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel`,
  `Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux`,
  [{ id: 2, text: 'Топ продажів' }],
  20000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)`,
  `Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без `,
  [{ id: 1, text: 'Готовий до відправки' }],
  40000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #count = 0
  static #list = []

  constructor(data, product) {
    this.id = ++Purchase.#count
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.phone = data.phone
    this.email = data.email
    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null
    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount
    this.product = product
  }
  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    this.#list.push(newPurchase)
	//newPurchase.product.amount = newPurchase.amount
    return newPurchase
  }
  static getList = () => {
    return Purchase.#list.reverse()
  }
  static getById = (id) => {
    return Purchase.#list.find((item) => item(id) === id)
  }
  static updateById = (id, data) => {
    // const purchase = Purchase.#list.find(
    //   (item) => item.id === id,
    // )
    const purchase = Purchase.getById(id)
    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email
      return true
    } else {
      return false
    }
  }
}
// ================================================================

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('purchase-index', {
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
})
// ↑↑ сюди вводимо JSON дані
// ================================================================
router.get('/purchase-product', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})
// ================================================================

router.post('/purchase-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

console.log(`AMOUNT:${amount}`)
  // ↙️ cюди вводимо назву файлу з сontainer

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Невірна кількість при замовлені',
        href: `/purchase-product?id=${id}`,
      },
    })
  }
  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такої кількості товару немає в наявності',
        href: `/purchase-product?id=${id}`,
      },
    })
  }
  console.log('=============')
  console.log(amount)
  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  // ================================================================

  res.render('purchase-create', {
    style: 'purchase-create',
    data: {
      id: product.id,

      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
    },
  })
})
// ================================================================
router.post('/purchase-submit', function (req, res) {
  //console.log (req,express.query)
  //   console.log(Number(req.query.id))
  //   console.log(req.body)
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        href: `/purchase-list`,
      },
    })
  }
  if (product.amount<=amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товару немає в потрібній кількості',
        href: `/purchase-list`,
      },
    })
  }
  console.log (totalPrice, productPrice, deliveryPrice,amount)
  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
 amount = Number(amount)
console.log (totalPrice, productPrice, deliveryPrice,amount)
  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) //||
    //isNaN(amount)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        href: `/purchase-list`,
      },
    })
  }
  if (!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Заповніть обов`язкові поля',
        info: 'Некоректні дані',
        href: `/purchase-list`,
      },
    })
  }
  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      firstname,
      lastname,
      email,
      phone,
    },
    product,
  )

 // console.log(purchase)
  
  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      href: `/purchase-list`,
    },
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
