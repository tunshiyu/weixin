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

        const {appID,appsecret}=require('../config');
        const api=require('../config/api');


        class wechat{
            //我想获取就得发送请求  https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
            /**
             * 发送请求获取access_token
             * @returns {Promise<void>}
             */
            async getAccessToken(){
                const url=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
                const data=await rp({url,method:'GET',json:true});
                data.expires_in=Date.now()+7200*1000-300*1000;
                return data;
            }

            /**
             * 保存access_token
             * @param filePath
             * @param accessToken
             * @returns {Promise<*>}
             */
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

            /**
             * 读取本地的access_token文件
             * @param filePath  文件路径
             * @returns {Promise<*>}
             */

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

            /**
             * 验证是否合法
             * @param expires_in 过期时间
             * @returns {boolean}
             */
            isValidAccessToken({expires_in}){
                return Date.now() < expires_in;
            }

            /**
             * 拿到一个合法的access_token
             * @returns {Promise<* | never>}
             */
            async fetchAccessToken(){
                if(this.access_token && this.expires_in && this.isValidAccessToken(this.access_token)){
                //    如果有说明this上已经存在，直接返回
                    return Promise.resolve({access_token:this.access_token,expires_in:this.expires_in});
                }
                return this.readAccessToken('./accessToken.txt')
                    .then(async res => {
                        //    说明有，先验证有效性
                        if(this.isValidAccessToken(res)) {
                            // console.log(`未过期,access_token为：${res.toString()}`)
                           return res;
                        }else {
                            const accessToken=await this.getAccessToken();
                            await this.saveAccessToken('./accessToken.txt',accessToken);
                            return accessToken;
                        }
                    })
                    .catch(
                        async err => {
                            //    说明没有，获取并保存
                            const accessToken=await this.getAccessToken();
                            await this.saveAccessToken('./accessToken.txt',accessToken);
                            return accessToken;
                        }
                    )
                    .then(res => {
                        this.access_token=res.access_token;
                        this.expires_in=res.expires_in;
                        return Promise.resolve(res);
                    })
            }

            /**
             * 创建自定义菜单
             * @param menu  menu模板
             * @returns {Promise<*|void>}
             */
            async createMenu(menu){
                try{
                    const {access_token}=await this.fetchAccessToken();
                    const url=`${api.menu.create}access_token=${access_token}`;
                    const result=await rp({url,method:'POST',json: true,body:menu});
                    return result;
                }catch (e) {
                    return Promise.reject('createMenu方法出错了'+e);
                }

            }

            /**
             * 删除自定义菜单
             * @returns {Promise<*|void>}
             */
            async deleteMenu(){
                try{
                    const {access_token}=await this.fetchAccessToken();
                    const url=`${api.menu.delete}access_token=${access_token}`;
                    const result=await rp({url,method:'GET',json: true});
                    return result;
                }catch (e) {
                    return Promise.reject('deleteMenu方法出错了'+e);
                }
            }

            /**
             * 创建标签
             * @param name  标签名
             * @returns {Promise<*>}
             */
            async createTags(name){
                try{
                    const {access_token}=await this.fetchAccessToken();
                    const url=`${api.tags.create}access_token=${access_token}`;
                    const result=await rp({url,method:'POST',json:true,body:{tag:{name}}});
                    return result;
                }catch (e) {
                        return promise.reject('createTags方法出错了'+e);
                            }
            }

            /**
             * 获取已创建的所有标签
             * @returns {Promise<*>}
             */
            async getTags(){
                try{
                    const {access_token}=await this.fetchAccessToken();
                    const url=`${api.tags.get}access_token=${access_token}`;
                    const result=await rp({url,method:'GET',json:true});
                    return result;
                }catch (e) {
                    return promise.reject('getTags方法出错了'+e);
                }
            }


            /**
             * 编辑某个标签
             * @param id  标签id
             * @param name  标签名字
             * @returns {Promise<*>}
             */
            async updateTags(id,name){
                try{
                    const {access_token}=await this.fetchAccessToken();
                    const url=`${api.tags.update}access_token=${access_token}`;
                    const result = await rp({url,method:'POST',json:true,body:{tag:{id,name}}});
                    return result;
                }catch (e) {
                    return promise.reject('updateTags方法出错了'+e);
                }
            }

            /**
             * 获取某个标签 下的用户
             * @param tagid  标签ID
             * @param next_openid
             * @returns {Promise<*>}
             */
            async  getTagUsers(tagid,next_openid){
                try{
                    const {access_token}=await this.fetchAccessToken();
                    const url=`${api.tags.getTagUsers}access_token=${access_token}`;
                    await rp({url,method:'POST',json:true,body:{tagid,next_openid}})
                }catch (e) {
                    return promise.reject('getTagUsers方法出错了'+e);
                }
            }

            /**
             * 批量为用用户打标签
             * @param open_list  要传入某个标签的用户数组
             * @param tagid   标签ID
             * @returns {Promise<*>}
             */
            async  batchUserTag(open_list,tagid){
                try{
                    const {access_token}=await this.fetchAccessToken();
                    const url=`${api.user.batchUserTag}access_token=${access_token}`;
                    await rp({url,method:'POST',json:true,body:{open_list,tagid}})
                }catch (e) {
                    return promise.reject('batchUserTag方法出错了'+e);
                }
            }


            /**
             * 获取某个用户身上所有标签
             * @param openid  用户ID
             * @returns {Promise<*>}
             */
            async  getUserTags(openid){
                try{
                    const {access_token}=await this.fetchAccessToken();
                    const url=`${api.user.getUserTags}access_token=${access_token}`;
                    await rp({url,method:'POST',json:true,body:{openid}})
                }catch (e) {
                    return promise.reject('getUserTags方法出错了'+e);
                }
            }

            async getInfo(openid){
                try{
                    const {access_token}=await this.fetchAccessToken();
                    const url=`${api.user.getInfo}access_token=${access_token}&openid=${openid}&lang=zh_CN`;
                    const result=await rp({url,method:'GET',json:true});
                    return result;
                }catch (e) {
                    return promise.reject('getInfo方法出错了'+e);
                }
            }

            async getUserList(){
                try{
                    const {access_token}=await this.fetchAccessToken();
                    const url=`${api.user.getuserlist}access_token=${access_token}`;
                    const result=await rp({url,method:'GET',json:true});
                    return result;
                }catch (e) {
                    return promise.reject('getUserList方法出错了'+e);
                }
            }

            /**
             * 群发消息
             * @param body  发送消息的内容  （文本或者图文消息）
             * @returns {Promise<*>}
             */
            async sendAll(body){
                try{
                    const {access_token}=await this.fetchAccessToken();
                    const url=`${api.message.sendAll}access_token=${access_token}`;
                    const result=await rp({url,method:'GET',json:true,body});
                    return result;
                }catch (e) {
                    return promise.reject('sendAll方法出错了'+e);
                }
            }

        }

            module.exports=wechat;

            (async ()=>{
                const w=new wechat();
                // const accessToken=await w.fetchAccessToken();
                // console.log(accessToken);
                //***********删除创建菜单*********

              /* let a=await w.deleteMenu();
                console.log(a);
                a=await w.createMenu(require('./menu'));
                console.log(a);*/

                //***********标签相关功能测试***********
               /* let a=await w.getTags();
                console.log('标签列表:'+JSON.stringify(a));
                // a=await w.createTags('各位尊敬的老师');
                // console.log(a);
                a=await w.getUserList();
                console.log('用户列表:'+JSON.stringify(a));

                a=await  w.getInfo('oeY5I0kEQ3B5-uX3Ezy2CLmUQy9I');
                console.log('用户基本信息:'+JSON.stringify(a));*/

                //***********全体推送 需要上传图片的MidiaID***********
              /*  w.sendAll({
                    "filter":{
                        "is_to_all":false,
                        "tag_id":2
                    },
                    "mpnews":{
                        "media_id":"123dsdajkasd231jhksad"
                    },
                    "msgtype":"mpnews",
                    "send_ignore_reprint":0
                })*/


            })();