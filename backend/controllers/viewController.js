exports.getSignupForm = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: "Hello from sign up page"
    })
}