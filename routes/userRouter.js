const express = require("express")
const UserController = require("../controllers/userController")

const userRouter = express.Router()

userRouter.get("/user", UserController.getUser)
userRouter.get("/course", UserController.getCourse)
userRouter.post("/withdraw", UserController.withdraw)


module.exports = userRouter