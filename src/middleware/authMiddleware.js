exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();  // Uživatel je přihlášen → pokračuj
    } else {
        return res.redirect('/auth/login');
    }
};