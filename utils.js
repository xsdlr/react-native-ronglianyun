/**
 * Created by xsdlr on 16/8/28.
 */
import isEmpty from 'lodash/isEmpty';
import md5 from 'blueimp-md5';
import Base64 from 'base-64';

/**
 * 检测必要参数
 * @param appId           应用ID
 * @param subAccount      子账号
 * @param subAccountToken 子帐号令牌
 * @param voipAccount     VoIP帐号
 * @param voipPassword    VoIP密码
 */
export const checkParameter = ({appId, subAccount, subAccountToken, voipAccount, voipPassword}) => {
  if (isEmpty(appId)) {
    throw new Error('应用ID为空');
  } else if (isEmpty(subAccount)) {
    throw new Error('子账号为空');
  } else if (isEmpty(subAccountToken)) {
    throw new Error('子帐号令牌为空');
  } else if (isEmpty(voipAccount)) {
    throw new Error('VoIP帐号为空');
  } else if (isEmpty(voipPassword)) {
    throw new Error('VoIP密码为空');
  }
};
/**
 * 账户签名
 * @param subAccount      子账号
 * @param subAccountToken 子帐号令牌
 * @param timestamp       时间戳
 * @returns {string}      签名
 */
export const accountSign = ({subAccount, subAccountToken}, timestamp) => {
  return `${md5(`${subAccount}${subAccountToken}${timestamp}`)}`;
};
/**
 * Authorization编码
 * @param subAccount  子账号
 * @param timestamp   时间戳
 * @returns {string}  认证编码
 */
export const authorization = ({subAccount}, timestamp) => {
  return Base64.encode(`${subAccount}:${timestamp}`);
};

export default {
  checkParameter,
  accountSign,
  authorization,
};
