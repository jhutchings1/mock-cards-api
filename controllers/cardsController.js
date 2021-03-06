const staticJson = require('../static')

module.exports = {
  getAllCards: (req, res) => {
    // return the static json file with all credit card info
    res.status(200).json(staticJson.allCardInfo)
  },
  getCard: (req, res) => {
    // parameter validation
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: 'Invalid parameters' })
    }
    // return static json for single card with id
    const returnCard = staticJson.allCardInfo.filter(card => card.id === req.params.id)
    if (returnCard && returnCard.length) {
      return res.status(200).json({ success: true, card: returnCard[0] })
    } else return res.status(200).json({ success: false, message: 'No card by that ID' })
  },
  apply: (req, res) => {
    // parameter validation
    if (!req.body.creditScore || !req.params.id) {
      return res.status(400).json({ success: false, message: 'Invalid parameters' })
    }

    // get credit score info passed in as well as the credit card being applied for id
    const usersCreditScore = req.body.creditScore
    const cardAppliedForId = req.params.id

    // get card applied for
    const cardAppliedForArray = staticJson.allCardInfo.filter(card => card.id === cardAppliedForId)

    // validate that the card applied for exists
    if (cardAppliedForArray.length < 1) {
      return res.status(400).json({ success: false, message: 'No card matches the id passed in, make sure the id passed in is the integer value of the id for the card being applied for' })
    }

    const cardAppliedFor = cardAppliedForArray[0]

    // validate the credit score passed in
    if (usersCreditScore < 100 || usersCreditScore > 850) {
      return res.status(400).json({ success: false, message: 'Invalid credit score passed in' })
    }

    const minPotentialScore = cardAppliedFor.recommended_credit_scores.reduce((min, score) => Math.min(min, score.min), 1000)

    // check if the user has a valid credit score, anything above the min will result in approval
    if (usersCreditScore >= minPotentialScore) {
      return res.status(200).json({ success: true, message: 'Success! The user has been approved!' })
    } else if (usersCreditScore < minPotentialScore) {
      return res.status(200).json({ success: true, message: 'Unfortunately the users credit score is not within the desired range for this card' })
    }

    return res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}
