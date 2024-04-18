
const notFound = (req,res,next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err,req,res,next) => {
    let statusCode = err.statusCode ?? 500
    let message = err.message

    return res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })    
}

export {
    notFound,
    errorHandler
}