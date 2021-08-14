const Model = require ('../models/account')


// exports.readUser = (req, res) => {
//   const slug = req.params.slug.toLowerCase();
//   console.log(slug)

//   Model.findOne({ mobileNumber: slug }).exec((err, data) => {
//       if (err) {
//           return res.status(400).json({
//               error: errorHandler(err)
//           });
//       }
//       res.json(data);
//   });
// };


const readUser = async (req, res) => {
  if (!req.body) {
    return res.redirect (403, '/403')
  }

  const mobileNumber = req.body.mobileNumber
  const password = req.body.password

  if (!mobileNumber || !password) {
    return res.redirect ('/login')
  }

  try {

    const account = await Model.findOne ({ mobileNumber })
    if (!account) {
      return res.redirect ('/login')
    }

    if (!bcrypt.compareSync (password, account.password)) {
      return res.redirect ('/login')
    }

    res.send ({
      success: true,
      date: moment ().toDate (),
      message: 'Authentication verified.',
      user: {
        isVerified: account.verified.value,
        code: account.code,
        mobileNumber: account.mobileNumber,
        givenName: account.name.given,
        familyName: account.name.family,
        middleName: account.name.middle,
        addrHouseNo: account.address.houseNo,
        addrStreet: account.address.street,
        addrProvince: account.address.province,
        addrCity: account.address.city,
        addrZipCode: account.address.zipCode,
        bankName: account.bank.name,
        bankProvince: account.bank.province,
        bankCity: account.bank.city,
        bankCardHolder: account.bank.cardHolder,
        bankCardNumber: account.bank.cardNumber,
        validID: account.image.validIDUrl,
        dp: account.image.profileUrl,
        id: account._id
      },
      authToken: account.authToken
    })

  } catch (ex) {
    console.error (`${ moment ().format (process.env.DTF) } Error while authenticating account. ${ mobileNumber }`, ex.message || ex)
    return res.redirect (500, '/500')
  }

}

module.exports = {readUser}