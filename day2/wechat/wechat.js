/*
  获取access_token:
    - 全局唯一接口调用凭据，公众号所有接口调用时都需要使用access_token

  特点：
    1. 存储大小至少512字节
    2. 有效期只有2小时，提前5分钟刷新
    3. 唯一的，重复获取将导致上次获取的access_token失效

  请求地址：
    https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
  请求方式： GET
  返回值：{"access_token":"ACCESS_TOKEN","expires_in":7200}

  设计思路：
    1. 发送请求，获取access_token，保存下来（txt）
    2. 读取本地文件，检查是否过期，
      - 如果过期了，重新发送请求，获取access_token，保存下来（txt）
      - 如果没有过期，直接使用

  总结：
   1. 读取本地文件 readAccessToken
    - 如果本地有文件
      - 检查是否过期 isValidAccessToken
        - 如果过期了，重新发送请求，获取access_token（getAccessToken），保存下来（txt） saveAccessToken
        - 如果没有过期，直接使用
    - 如果本地没有文件
      - 发送请求，获取access_token，保存下来（txt）
 */

        const rp=require('request-promise-native');
        const {readFile,writeFile}=require('fs');

        const {appID,appsecret}=require('../config')


        class wechat{
            //我想获取就得发送请求  https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
            async getAccessToken(){
                const url=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
                const data=await rp({url,method:'GET',json:true});
                data.expires_in=Date.now()+7200*1000-300*1000;
                return data;
            }
            async saveAccessToken(filePath,accessToken){
                return new Promise((resolve, reject) => {
                    writeFile(filePath,JSON.stringify(accessToken),err => {
                        if(!err){
                            resolve();
                        }else{
                            reject('saveAccessToken方法出错了'+err);
                        }
                    })
                })
            }

            async readAccessToken(filePath){
                return new Promise((resolve, reject) => {
                    readFile(filePath,(err,data) => {
                    //    readFile返回的是buffer，先toString成JSON字符串再parse
                        if (!err){
                            resolve(JSON.parse(data.toString()));
                        } else {
                            reject('readAccessToken方法出错了'+err);
                        }
                    })
                })
            }

            isValidAccessToken({expires_in}){
                return Date.now() < expires_in;
            }

        }

            module.exports=wechat;

            (async ()=>{
                const w=new wechat();
                w.readAccessToken('./accessToken.txt')
                    .then(async res => {
                        //    说明有，先验证有效性
                        if(w.isValidAccessToken(res)) {
                            console.log(`未过期,access_token为：${res.toString()}`)
                            console.log(res)
                        }else {
                            const accessToken=await w.getAccessToken();
                            await w.saveAccessToken('./accessToken.txt',accessToken);
                        }
                    })
                    .catch(
                    async err => {
                        //    说明没有，获取并保存
                        const accessToken=await w.getAccessToken();
                        await w.saveAccessToken('./accessToken.txt',accessToken);
                    }
                    )
            })();