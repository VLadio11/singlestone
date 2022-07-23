const Koa = require('koa');
var Router = require('koa-router');
const { ContactManager, handle } = require('./src/contacts');
const app = new Koa();

const router = Router();

router.get('contacts', ContactManager.handle);

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);