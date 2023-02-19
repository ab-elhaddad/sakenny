"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
exports.options = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Sakkeny Backend APIs",
            description: "This is a guide to use Sakenny Backend APIs.",
            version: "1.0.0",
        },
        schemes: ["http", "https"],
        basebath: "/",
    },
    apis: [
        '/users', '/users/login'
    ],
    paths: {
        "/users": {
            "get": {
                "description": "Returns all BOOKS from the system that the user has access to",
                "produces": [
                    "application/json"
                ],
                "responses": {
                    "200": {
                        "description": "A list of books.",
                        "schema": {
                            "type": "array",
                            "items": {}
                        }
                    }
                }
            }
        }
    }
};
