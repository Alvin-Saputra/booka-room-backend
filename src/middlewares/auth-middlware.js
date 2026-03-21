import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Akses ditolak. Token tidak ditemukan atau format salah.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        
        next(); // Lanjut ke middleware atau controller berikutnya
    } catch (err) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid Token or Token Expired'
        });
    }
};


export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'You are not authorized to perform this action.'
            });
        }
        next();
    };
};