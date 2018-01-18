const staticJson = require('../static')

module.exports = {
  getAllCards: (req, res) => {
    // return the static json file with all credit card info
    res.status(200).json(staticJson.allCardInfo)
  },
  apply: (req, res) => {
    // parameter validation
    if (!req.body.creditScore || !req.params.id) {
      return res.status(400).json({ success: false, message: 'Invalid parameters' })
    }

    // get credit score info passed in as well as the credit card being applied for id
    const usersCreditScore = req.body.creditScore
    const cardAppliedForId = req.params.id

    // validate that the card applied for exists
    if (!Object.keys(staticJson.allCardInfo).includes(cardAppliedForId)) {
      return res.status(400).json({ success: false, message: 'No card matches the id passed in, make sure the id passed in is the integer value of the id for the card being applied for' })
    }

    // validate the credit score passed in
    if (usersCreditScore < 100 || usersCreditScore > 850) {
      return res.status(400).json({ success: false, message: 'Invalid credit score passed in' })
    }

    const cardAppliedFor = staticJson.allCardInfo[cardAppliedForId]
    const minPotentialScore = cardAppliedFor.recommended_credit_scores.reduce((min, score) => Math.min(min, score.min), 0)

    // check if the user has a valid credit score, anything above the min will result in approval
    if (usersCreditScore >= minPotentialScore) {
      return res.status(200).json({ success: true, message: 'Success! The user has been approved!' })
    } else if (usersCreditScore < minPotentialScore) {
      return res.status(200).json({ success: true, message: 'Unfortunately the users credit score is not within the desired range for this card' })
    }

    return res.status(500).json({ success: false, message: 'Something went wrong' })
  }
}
