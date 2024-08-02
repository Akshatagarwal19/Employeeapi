import { errorResponse } from "./responseformatter.js";

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    errorResponse(res, err.message, err);
};

export default errorHandler;