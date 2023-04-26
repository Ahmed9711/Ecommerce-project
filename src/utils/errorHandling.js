let stackvar;

export const asyncHandler = (API) => {
    return (req, res, next) => {
        API(req, res, next).catch(err => {
            if(err.code === 11000){
                stackvar = err.stack;
                return next(new Error("Email already registered", {cause: 400}))
            }
            stackvar = err.stack;
            next(new Error(err.message))
        })
    }
}

export const failResponse = (err, req, res, next) => {
    if(err){
        if(process.env.ENV_MODE == 'dev'){
            return res.status(err['cause'] || 500).json({
                message: "Fail error",
                Error: err.message,
                stack: stackvar
            })
        }
        return res.status(err['cause'] || 500).json({
            message: "Fail error",
            Error: err.message
        })
    }
}

