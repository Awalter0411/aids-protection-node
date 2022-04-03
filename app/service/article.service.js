const Router = require('koa-router')
const { success, CODE, fail } = require('../../util/util')
const articleController = require('../controller/article.controller')

let router = new Router({
    prefix: '/api/article'
})

// 创建问题
router.post('/create', async (ctx) => {
    const { title, content } = ctx.request.body
    await articleController
        .create({
            title,
            content
        })
        .then((res) => {
            ctx.body = success(res, '创建成功', CODE.SUCCESS)
        })
        .catch((err) => {
            ctx.body = fail(err, '创建失败', CODE.BUSINESS_ERROR)
        })
})

// 查看问题列表
router.get('/list', async (ctx) => {
    await articleController
        .findAll()
        .then((res) => {
            ctx.body = success(res, '查找成功', CODE.SUCCESS)
        })
        .catch((err) => {
            ctx.body = fail(err, '查找失败', CODE.BUSINESS_ERROR)
        })
})

// 删除
router.delete('/delete', async (ctx) => {
    let { id } = ctx.request.body
    await articleController
        .delete(id)
        .then((res) => {
            ctx.body = success(res, '删除成功', CODE.SUCCESS)
        })
        .catch((err) => {
            ctx.body = fail(err, '删除失败', CODE.BUSINESS_ERROR)
        })
})

module.exports = router