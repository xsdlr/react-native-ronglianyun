#容联云React Native Rest SDK
##API文档
###初始化
```js
const isDev = true;		//是否是测试环境
const api = new RLCloud({
	appId: '', 				//应用ID
	subAccount: '', 	   //子账号
	subAccountToken: '',//子帐号令牌
	voipAccount: '', 		//VoIP帐号
	voipPassword: ''		//VoIP密码
}, isDev);
```
###回拨电话
```js
/**
   * 回拨电话
   * @param from                      主叫号码
   * @param to                        被叫号码
   * @param customerSerNum            被叫侧显示号码
   * @param fromSerNum                主叫侧显示号码
   * @param promptTone                第三方自定义回拨提示音
   * @returns {Promise{(string, date)|error}}  订单号,创建时间
   */
callBack(from, to, customerSerNum, fromSerNum, promptTone)
```
###取消回拨电话
```js
/**
   * 取消回拨电话
   * @param callSid           回拨电话业务id
   * @param type              挂断类型
   * 0:任意时间都可以挂断电话; 
   * 1:被叫应答前可以挂断电话,其他时段返回错误代码; 
   * 2:主叫应答前可以挂断电话,其他时段返回错误代码; 默认值为0.
   * @returns {Promise{string|error}}  状态码
   */
   callCancel(callSid, type)
   ```
   


