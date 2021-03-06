const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: process.env.ISSUER,
    clientId: process.env.CLIENT_ID
});

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) throw new Error('You must send an Authorization header');

        const [authType, token] = authorization.trim().split(' ');
        if (authType !== 'Bearer') throw new Error('Expected a Bearer token');
        const { claims } = await oktaJwtVerifier.verifyAccessToken(token);
        if (!claims.scp.includes(process.env.SCOPE)) {
            throw new Error('Could not verify the proper scope');
        }
        next();
    } catch (error) {
        return res.status(400).send({ status: 400, message: error.message });
    }
};