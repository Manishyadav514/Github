"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const requireAuth_1 = __importDefault(require("./middleware/requireAuth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
app.options("*", (0, cors_1.default)());
// requireAuth middleware is applied to all routes except /login and /register 
// to prevent unauthenticated users from accessing protected routes
app.use(requireAuth_1.default);
app.use(express_1.default.json());
// routes
app.use(routes_1.default);
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI || "";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
// connect to MongoDB
mongoose_1.default
    .connect(uri, options)
    .then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})
    .catch((error) => {
    throw error;
});
