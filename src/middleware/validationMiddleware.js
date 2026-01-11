import { ZodError } from "zod"

export const validateBody = (schema) => {
    return (req, res, next)=>{
        try{
            req.body = schema.parse(req.body)
            next()
        }catch(error){
            if(error instanceof ZodError){
                return res.status(400).send({
                    error: 'Invalid body',
                    details: error.issues.map((issue)=>{
                        return issue.message
                    }),
                })
            } else {
                res.status(500).send({error: 'internal server error'})
                console.log(error)
            }
        }
    }
}

export const validateParams = (schema)=> {
    return (req, res, next)=>{
        try{
            schema.parse(req.params)
            next()
        }catch(error){
            if(error instanceof ZodError){
                return res.status(400).send({
                    error: 'Invalid parameters',
                    details: error.issues,
                })
            } else {
                res.status(500).send({error: 'internal server error'})
                console.log(error)
            }
        }
    }
}