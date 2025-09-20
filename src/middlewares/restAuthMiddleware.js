import { StatusCodes } from "http-status-codes"
import jwt from 'jsonwebtoken'

const restAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token not found' })
  }

  const token = authHeader.split(' ')[1] // Espera o formato 'Bearer <token>'

  try {
    const jwtToken = process.env.API_JWT_SECRET || 'token-exemplo'
    const decoded = jwt.verify(token, jwtToken)
    req.user = decoded
    next()
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token invalid' })
  }
}

export default restAuthMiddleware