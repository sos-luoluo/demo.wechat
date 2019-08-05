import './extensions.js'
import { ajax, ListAjax} from './ajax.js'
import AppBase from './appbase.js'
import { extend, Deferred, deferredAll, random, serialize, convertTree, base64, WorkerManage} from './base.js'
import PageBase from './pagebase.js'
import { store, mmoize, listStore} from './store.js'
import tools from './tools.js'
import { uploadImg, pay} from './wxAPI.js'
import wxp from './wxp.js'


export default {
  ajax,
  ListAjax,
  AppBase,
  extend,
  Deferred,
  deferredAll,
  random,
  serialize,
  convertTree,
  base64,
  WorkerManage,
  PageBase,
  store,
  mmoize,
  listStore,
  tools,
  uploadImg,
  pay,
  wxp
}