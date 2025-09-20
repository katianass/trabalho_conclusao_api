import { StatusCodes } from "http-status-codes"
import { validationResult } from 'express-validator'

export class Controller {
    handleValidationErrors(req, res, next) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const newErrors = errors.array().map((error) => {
                return {
                    field: error.path,
                    message: error.msg,
                }
            })
            return res.status(StatusCodes.BAD_REQUEST).json({ errors: newErrors })
        }
        next()
    }
}