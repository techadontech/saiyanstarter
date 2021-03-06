/**
 * @author Leon Mwandiringa
 * @uses bootsrap mvc app instance
 * @return server app object
 */

import * as express from "express";
import {Request, Response, NextFunction} from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import router from "../Routes/web";
import LoggerStream from "../App/Controllers/LogsLogger";
import * as gzip from "compression";
import CorsSecurity from "../App/Middlewares/CorsSecurity";
import ServerSecurity from "../App/Middlewares/BaseSecurity";
//import RealtimeMiddleware from "../App/Middlewares/RealtimeLogger";

class App{

    public express: express.Application;

    constructor(){

        this.express = express();
        this.moduleMiddlewares();
        this.LocalMiddlewares();
        this.routes();

    }

    /* run global modules middlewares */
    private moduleMiddlewares(): void{

        this.express.use(gzip());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: true}));

    }

    /* define and run global local middlewares */
    private LocalMiddlewares(): void{

        //security middlewares
        this.express.use(ServerSecurity.CORE);
        this.express.use(ServerSecurity.XSS);
        this.express.use(ServerSecurity.CSP);
        this.express.use(CorsSecurity.CORS);

        //logger to file middlewares
        this.express.use(LoggerStream.writeStream());
        //this.express.use(RealtimeMiddleware.LogRequest);

    }

    /* call and run global router middlewares */
    private routes(): void{

        let route = express.Router();
        this.express.use(router);
  
    }

}

export default new App().express;