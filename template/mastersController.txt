const getList = async (req, res, next) => {
  try {
    let data = {
      masters: {
        country: [
          {
            value: "USD",
            name: "$",
          },
          {
            value: "EUR",
            name: "€",
          },
          {
            value: "BTC",
            name: "฿",
          },
          {
            value: "JPY",
            name: "¥",
          },
        ],
        regex: { password: "/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/", email: "/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/" },
      },
    }
    res.status(200).json({ data })
  } catch (error) {
    res.status(400).json({ messgae: "An error Occoured" })
  }
}

module.exports = {
  getList
}
