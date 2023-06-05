"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeApp = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const middleware_1 = __importDefault(require("aws-serverless-express/middleware"));
const cors_middleware_1 = require("./src/middleware/cors.middleware");
const rooms_routes_1 = require("./src/routes/rooms.routes");
const error_1 = require("./src/error/error");
const authentication_middleware_1 = require("./src/middleware/authentication.middleware");
function initializeApp() {
    const app = (0, express_1.default)();
    initializeMiddleware(app);
    startServer(app);
    initializeAuthenticatedRoutes(app);
    initializeErrorHandling(app);
    return app;
}
exports.initializeApp = initializeApp;
function initializeMiddleware(app) {
    app.use(body_parser_1.default.json());
    app.use(cors_middleware_1.corsMiddleware);
    app.use(middleware_1.default.eventContext());
}
function initializeAuthenticatedRoutes(app) {
    app.use(authentication_middleware_1.authMiddleware);
    app.use('/rooms', rooms_routes_1.RoomsRouter);
}
/**
 * Initialize error handling for all the requests. This will be called if we call next with an error object
 */
function initializeErrorHandling(app) {
    // Our request was not handled
    app.use((req, res, next) => {
        const error = new Error('Not found -> Endpoint does not exist. Read the endpoints docs');
        error.status = 404;
        next(error);
    });
    // All unhandled errors should be passed on here using next(error)
    app.use((error, req, res, next) => {
        console.error(req.url + ' failed with error: ' + error);
        const expressError = (0, error_1.isExpressError)(error) ? error : (0, error_1.err)(error, 500);
        res.status(expressError.status || 500);
        res.json({
            error: {
                message: expressError.toString(),
            },
        });
    });
}
function startServer(app) {
    app.listen(3000, () => {
        console.log("App started");
    });
}
