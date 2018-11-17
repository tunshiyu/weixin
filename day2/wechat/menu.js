
module.exports={
    "button":[
        {
            "type":"click",
            "name":"今日豆瓣",
            "key":"V1001"
        },
        {
            "name":"豆瓣预告片",
            "sub_button":[
                {
                    "type":"view",
                    "name":"搜索",
                    "url":"http://www.douban.com/"
                },
                {
                    "type": "pic_photo_or_album",
                    "name": "拍照或者相册发图",
                    "key": "rselfmenu_1_1",
                    "sub_button": [ ]
                }, {
                    "name": "发送位置",
                    "type": "location_select",
                    "key": "rselfmenu_2_0"
                }, ]
        }]
}