const Router = require('koa-router')
const { success, CODE, fail } = require('../../util/util')
const volunteerController = require('../controller/volunteer.controller')
const userController = require('../controller/user.controller')
const tokenVerify = require('../../util/tokenVerify')

let router = new Router({
    prefix: '/api/volunteer'
})

// create
router.post('/create', async (ctx) => {
    const { title, desc, startDate, endDate } = ctx.request.body
    await volunteerController
        .create({ title, desc, startDate, endDate })
        .then((res) => {
            ctx.body = success(res, '创建成功', CODE.SUCCESS)
        })
        .catch((err) => {
            ctx.body = fail(err, '创建失败', CODE.BUSINESS_ERROR)
        })
})

// list
router.get('/list', async (ctx) => {
    await volunteerController
        .findAll()
        .then((res) => {
            ctx.body = success(res, '查找成功', CODE.SUCCESS)
        })
        .catch((err) => {
            ctx.body = fail(err, '查找失败', CODE.BUSINESS_ERROR)
        })
})

// list by user_id
router.get('/list/user', async (ctx) => {
    const { userId } = ctx.request.query
    await volunteerController
        .findListByUserId(userId)
        .then((res) => {
            ctx.body = success(res, '查找成功', CODE.SUCCESS)
        })
        .catch((err) => {
            ctx.body = fail(err, '查找失败', CODE.BUSINESS_ERROR)
        })
})

// booking
router.post('/booking', async (ctx) => {
    const userId = tokenVerify(ctx)
    const { volunteerId } = ctx.request.body
    const user = await userController.findOne({
        id: userId
    })
    const volunteer = await volunteerController.findOne({
        id: volunteerId
    })
    await volunteer
        .addUsers(user)
        .then(async (res) => {
            return await userController.update(userId, {
                integral: user.dataValues.integral + 10
            })
        })
        .then((res) => {
            ctx.body = success(res, '预约成功', CODE.SUCCESS)
        })
        .catch((err) => {
            ctx.body = fail(err, '预约失败', CODE.BUSINESS_ERROR)
        })
})

module.exports = router
