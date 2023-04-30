import { ConnectionDB } from "../../DB/connection.js"
import { failResponse } from "./errorHandling.js"
import * as Routers from '../Modules/index.routes.js'
import morgan from "morgan"
import cors from 'cors'

export const initiateApp = (app, express) => {
    app.use(express.json())
    const port = process.env.PORT
    const BaseURL = '/ecommerce'
    var whitelist = ['http://example1.com', 'http://127.0.0.1:5500']
    // two public networks
    // var corsOptions = {
    //   origin: function (origin, callback) {
    //     if (whitelist.indexOf(origin) !== -1) {
    //       callback(null, true)
    //     } else {
    //       callback(new Error('Not allowed by CORS'))
    //     }
    //   },
    // }
    // app.use(cors(corsOptions))
    //private - public
    if (process.env.ENV_MODE == 'dev') {
        app.use(cors())
        app.use(morgan('dev'))
    } else {
        app.use(async (req, res, next) => {

        if (!whitelist.includes(req.header('origin'))) {
            return next(new Error('Not allowed by CORS', { cause: 502 }))
        }
        await res.header('Access-Control-Allow-Origin', '*')
        await res.header('Access-Control-Allow-Header', '*')
        await res.header('Access-Control-Allow-Private-Network', 'true')
        await res.header('Access-Control-Allow-Method', '*')
        next()
        })
        app.use(morgan('combined'))
    }
    //Database connection
    ConnectionDB()

    //Routers
    app.use(`${BaseURL}/category`,Routers.categoryRouter);
    app.use(`${BaseURL}/subcategory`,Routers.subCategoryRouter);
    app.use(`${BaseURL}/auth`,Routers.authRouter)
    app.use(`${BaseURL}/coupon`,Routers.couponRouter)
    app.use(`${BaseURL}/brand`,Routers.brandRouter)
    app.use(`${BaseURL}/product`,Routers.productRouter)
    app.use(`${BaseURL}/cart`,Routers.cartRouter)
    app.use(`${BaseURL}/order`,Routers.orderRouter)
    app.use(`${BaseURL}/review`,Routers.reviewRouter)
    //Wrong routes
     app.use('*', (req,res) => {
        res.status(404).json({message: "NOT FOUND"})
    })

    //Fail response
    app.use(failResponse)

    app.listen(port, () => console.log(`Ecommerce app listening on port ${port}!`))
}