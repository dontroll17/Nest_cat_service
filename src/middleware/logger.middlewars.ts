import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger();

    use(req, res, next: NextFunction) {
        const { ip, method, path: url } = req;
        const userAgent = req.get('user-agent') || '';

        res.on('close', () => {
            const {statusCode} = res;
            const len = res.get('content-lenth') || '0';

            this.logger.log(
                `[${method}] ${url} ${statusCode} ${len} - ${userAgent} ${ip}`
            )
        });

        next();
    }
}