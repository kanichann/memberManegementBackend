const jwt = require('jsonwebtoken')




module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        console.log('authNONE');
    } else {
        const token = req.get('Authorization').split(' ')[1];
        console.log(token, 'is-auth13');
        let decodToken;
        try {
            decodToken = jwt.verify(token, 'someSupterpass');
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {


                const error = new Error(err);
                error.statusCode = 500;
                error.msg = '認証の有効期限がきれています。'
                return next(error)
            }
        }
        if (!decodToken) {
            const error = new Error();
            error.msg = '認証の有効期限がきれています。'
            next(error);
        }
        req.mail = decodToken.mail;
        req.userId = decodToken.userId;

    }
    next()

}