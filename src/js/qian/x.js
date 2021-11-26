$(document).ready(function () {
    $("#btn").click(function () {
        //ajax请求
        $.ajax({
            dataType: "json",		//返回的数据类型
            type: "get",			//设置请求方式
            url: "../../api/menu.json",		//设置请求URL
            success: function (msg) {		//设置响应成功之后执行的回调函数,响应数据会自动赋给参数 msg
                msg.forEach(function(data){ 
                    //把解析后的数据渲染到div中
                    $("#container").append(data.名称);
                });
            },
            error: function () {		//设置响应失败之后执行的回调函数
                alert("失败喽");
            }
        });
    });
});