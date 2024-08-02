export const successresponse = (res ,message ,data = {}) => {
    const logMessage = {
        status: 'success',
        message,
        data
    };
    console.log(logMessage);
    res.status(200).json(logMessage);
};
export const errorResponse = (res ,message ,error = {}) => {
    const logMessage = {
        status: 'error',
        message,
        error
    };
    console.log(logMessage);
    res.status(500).json(logMessage);
};