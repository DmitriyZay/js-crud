// Підключаємо технологію express для back-end сервера
const express = require('express')
const { emit } = require('nodemon')
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
    amount = 0,
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
  static #BONUS_FACTOR = 0.1
  static #count = 0
  static #list = []

  static #bonusAccount = new Map()
  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }
  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purchase.getBonusBalance(email)
    const updateBalance = currentBalance + amount - bonusUse
    Purchase.#bonusAccount.set(email, updateBalance)
    console.log(email, updateBalance)
    return amount
  }

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
   
    return newPurchase
  }
  static getList = () => {
    return Purchase.#list.reverse() 
  }
  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }
  static updateById = (id, data) => {

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
class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }
  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.25)

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
  const bonus = Purchase.calcBonusAmount(totalPrice)
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
      bonus,
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
    comment,
    promocode,
    bonus,
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
  if (product.amount <= amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товару немає в потрібній кількості',
        href: `/purchase-list`,
      },
    })
  }
  console.log(
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,
  )
  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)
  console.log(
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,
    bonus,
  )
  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
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

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)
    console.log(bonusAmount)
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }
    Purchase.updateBonusBalance(email, totalPrice, bonus)
    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }
  //console.log(`promocode`, promocode)
  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }
  if (totalPrice < 0) {
    totalPrice = 0
  }

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,
      firstname,
      lastname,
      email,
      phone,
      promocode,
      comment,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      href: `/purchase-list?id=${id}`,
    },
  })
})

// ================================================================
router.get('/purchase-list', function (req, res) {
  const list = Purchase.getList()
  console.log('purchase-list:', list)

  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',
    //   component: ['heading', 'purchase-item', 'divider'],
    title: 'Мої замовлення',

    data: {
      purchases: {
        list,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.get('/purchase-info', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)
  // ↙️ cюди вводимо назву файлу з сontainer

  res.render('purchase-info', {
    style: 'purchase-info',
    title: 'Інформація про замовлення',
    data: {
		id: purchase.id,
		firstname: purchase.firstname,
		lastname: purchase.lastname,
		phone: purchase.phone,
		email: purchase.email,
		totalPrice:purchase.totalPrice,
		productPrice:purchase.productPrice,
		deliveryPrice:purchase.deliveryPrice,
		amount:purchase.amount,
		bonus:purchase.bonus,
		comment:purchase.comment,
		product_title:purchase.product.title,
    },
  })
})



router.get('/purchase-modify', function (req, res) {
	
	const id = Number(req.query.id)
	console.log (id)
	const purchase = Purchase.getById(id)
 	if (!purchase) {
	  // Якщо товар з таким id не знайдено, відображаємо повідомлення про помилку
	  res.render('alert', {
		style: 'alert',
		isError: true,
		data: {
			message: 'Помилка',
			info: 'Замовлення з таким ID не знайдено',
			href: `/`,
		  },
	  })
	} else {
	  res.render('purchase-modify', {
		style: 'purchase-modify',
		title: 'Зміна данних замовлення',
 		data: {
		  id: purchase.id,
		  firstname: purchase.firstname,
		  lastname: purchase.lastname,
		  phone: purchase.phone,
		  email: purchase.email,
		
		},
	  })
	}
  })
  
  // ==========================================================
  router.post('/purchase-modify', function (req, res) {
	const id = Number(req.query.id)
	let { firstname, lastname, phone, email } =
	  req.body
  
	const purchase = Purchase.getById(id)
  
	console.log(purchase)
  
	if (purchase) {
	  const newPurchase = Purchase.updateById(id, {
		firstname,
		lastname,
		phone,
		email,
		})
  
	  console.log(newPurchase)
  
	  // Якщо оновлення вдалося, відображаємо повідомлення про успіх
	  if (newPurchase) {
		res.render('alert', {
		  style: 'alert',
		    
		  data: {
			href: '/purchase-list',
			message: 'Успішне виконання дії',
			info: 'Товар успішно оновлено',
		  },
		})
	  } else {
		// Якщо оновлення не вдалося (наприклад, товару з таким id не існує),
		// відображаємо повідомлення про помилку
		res.render('alert', {
		  style: 'alert',
		   
		  data: {
			href: '/purchase-list',
			message: 'Помилка',
			info: 'Не вдалося оновити товар',
		  },
			
	  })
	}}
  })
// Підключаємо роутер до бек-енду
module.exports = router
