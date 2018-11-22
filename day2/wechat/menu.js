const {url}=require('../config');

module.exports={
    "button":[
        {
            "type":"click",
            "name":"今日豆瓣",
            "key":"V1001"
        },
        {
            "name":"戳我啊👈",
            "sub_button":[
                {
                    "type":"view",
                    "name":"预告片🎥",
                    "url": `${url}/movie`
                },
                {
                    "type":"view",
                    "name":"语音识别🎤",
                    "url":`${url}/search`
                },
                {
                    "type": "click",
                    "name": "帮助",
                    "key": "help",
                },
                {
                    "name": "豆瓣官网",
                    "type": "view",
                    "url": "http://www.douban.com"
                },
                {
                    "name": "发送位置",
                    "type": "location_select",
                    "key": "rselfmenu_2_0"
                }]
        }]
}