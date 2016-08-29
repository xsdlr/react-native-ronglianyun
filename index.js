/**
 * Created by xsdlr on 16/8/28.
 */
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import replace from 'lodash/replace';
import isString from 'lodash/isString';
import utils from './utils';
import moment from 'moment';

const developHost = 'sandboxapp.cloopen.com';
const produceHost = 'app.cloopen.com';
const hostPort = 8883;
const serverVersion = '2013-12-26';

export default class RLCloud {
  /**
   * 构造器
   * @param appId           应用ID
   * @param subAccount      子账号
   * @param subAccountToken 子帐号令牌
   * @param voipAccount     VoIP帐号
   * @param voipPassword    VoIP密码
   * @param isDev           是否为测试
   */
  constructor({appId, subAccount, subAccountToken, voipAccount, voipPassword}, isDev = true) {
    const config = {appId, subAccount, subAccountToken, voipAccount, voipPassword};
    utils.checkParameter(config);
    this.config = {appId, subAccount, subAccountToken, voipAccount, voipPassword};
    this.endPoint = `https://${isDev ? developHost : produceHost}:${hostPort}/${serverVersion}/SubAccounts/${subAccount}`;
  }
  /**
   * 发起请求
   * @param url             url
   * @param parameters      参数
   * @param method          请求方式
   * @param headers         请求头
   * @returns {Promise.<json>}
   * @private
   */
  _requst({url, parameters, method='POST',headers={}}) {
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const serviceUrl = `${url}?sig=${utils.accountSign(this.config, timestamp)}`;
    const baseHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': utils.authorization(this.config, timestamp),
    };
    const _headers = merge({}, baseHeaders, headers);

    return fetch(serviceUrl, {
      method: method,
      headers: _headers,
      body: JSON.stringify(parameters),
    }).catch(() => {
      return Promise.reject('网络错误');
    })
      .then(res => res.json()
        .catch(() => Promise.reject('JSON解析错误'))
        .then(json => {
          if (isEmpty(json)) return Promise.reject('无返回包体');
          const statusCode = json.statusCode;
          if (statusCode === '000000') {
            return json;
          } else {
            const statusMsg = json.statusMsg || '发生错误';
            return Promise.reject(replace(statusMsg, /【.*?】/i, ''));
          }
        }));
  }
  /**
   * 回拨电话
   * @param from                      主叫号码
   * @param to                        被叫号码
   * @param customerSerNum            被叫侧显示号码
   * @param fromSerNum                主叫侧显示号码
   * @param promptTone                第三方自定义回拨提示音
   * @returns {(string, date)|error}  订单号,创建时间
   */
  callBack(from, to, customerSerNum='', fromSerNum='', promptTone='') {
    if (from === to) return Promise.reject('被叫电话号码与主叫电话号码相同');
    const url = `${this.endPoint}/Calls/Callback`;
    const parameters = {from, to, customerSerNum, fromSerNum, promptTone};
    return this._requst({url, parameters}).then(json => {
      const {callSid, dateCreated} = json.CallBack || {};
      const createDate = dateCreated ? moment(dateCreated, moment.ISO_8601).toDate() : null;
      return {callSid, createDate};
    });
  }
  /**
   * 取消回拨电话
   * @param callSid           回拨电话业务id
   * @param type              挂断类型,0:任意时间都可以挂断电话; 1:被叫应答前可以挂断电话,其他时段返回错误代码; 2:主叫应答前可以挂断电话,其他时段返回错误代码; 默认值为0.
   * @returns {string|error}  状态码
   */
  callCancel(callSid, type=0) {
    if(isEmpty(callSid)) return Promise.reject('callSid为空');
    if(!isString(callSid)) return Promise.reject('callSid错误');
    const {appId} = this.config;
    const url = `${this.endPoint}/Calls/CallCancel`;
    const parameters = {appId, callSid, type};
    return this._requst({url, parameters}).then(({statusCode}) => {
      return statusCode;
    });
  }
}
