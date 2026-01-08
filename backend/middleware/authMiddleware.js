import JWT from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export const authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || '';
		const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

		if (!token) {
			return res.status(401).json({ status: 'failed', message: 'No token provided' });
		}

		const decoded = JWT.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		console.error('authMiddleware error:', err);
		return res.status(401).json({ status: 'failed', message: 'Invalid or expired token' });
	}
};