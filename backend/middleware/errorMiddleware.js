/**
 * Middleware function to handle 404 api routes errors.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const notFound = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

/**
 * Express middleware function that handles errors globally and sends an appropriate response to the client.
 * @param {Error} err - The error object passed to the middleware.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 */
const errorHandler = (err, req, res, next) => {
	let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	let message = err.message;

	res.status(statusCode).json({
		message: message,
		stack: process.env.NODE_ENV === 'production' ? null : err.stack,
	});
};

export { errorHandler, notFound };
