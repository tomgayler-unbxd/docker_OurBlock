const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()



// Branching for non-resident owners to give their address 
// Found on sign-up-role
router.post('/role-check', function(req, res) {
    // Get the answer from session data
    // The name between the quotes is the same as the 'name' attribute on the input elements
    // However in JavaScript we can't use hyphens in variable names

    let role = req.session.data['role']

    if (role === 'Owner occupier') {
        res.redirect('v1/sign-up-success')
    } else {
        res.redirect('v1/sign-up-nonresident')
    }
})

// Create a single address object from different lines of address
router.post('/block-address', function(req, res) {
let address = req.session.data['b-address-line-1'+'b-address-line-2'+'b-address-town'+'b-address-postcode']

res.redirect('v1/block-home')
})




// Branching for officers to say if they think the recommendation should be approved or not
// Found on permitted-dev-reqs-manager
router.post('/refuse-or-approve', function(req, res) {
    // Get the answer from session data
    // The name between the quotes is the same as the 'name' attribute on the input elements
    // However in JavaScript we can't use hyphens in variable names

    let over19 = req.session.data['how-contacted']

    if (over19 === 'phone') {
        res.redirect('v08/make-recommendation')
    } else {
        res.redirect('v08/make-recommendation-grant')
    }
})


// Branching for type of evidence entry
// Found on set-data-type
router.post('/date-type-check', function(req, res) {
    // Get the answer from session data
    // The name between the quotes is the same as the 'name' attribute on the input elements
    // However in JavaScript we can't use hyphens in variable names

    let over20 = req.session.data['date-type']

    if (over20 === 'range') {
        res.redirect('v19/immunity-bills')
    } else {
        res.redirect('v19/immunity-tax')
    }
})

module.exports = router