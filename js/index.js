/**
 * Created by lenovo on 2017/3/6.
 */
$(function(){
    var nav_top = $('.nav').offset().top;
    $(window).on('scroll',function(){
        var scr_top =$(window).scrollTop();
        if(scr_top>=nav_top){
            $('.nav').css({
                'position': 'fixed',
                'top':0
            });
            $('.nav .nav_left').css({
                'opacity':'1'
            });
            $('.top').fadeIn(200);
        }else {
            $('.nav').css({
                'position': 'static',
            });
            $('.nav .nav_left').css({
                'opacity':'0'
            });
            $('.top').fadeOut(200);
        }
    });
    $('.top').on('click',function(){
        $('html body').animate({
            scrollTop:0
        });
    });

    var itemArray ;
    itemArray = store.get('itemArray')|| [];
    render_view();

    $('.nav_right input[type="submit"]').on('click',function(event){
        var event = event|| window.event;
        event.preventDefault();

        var inp_content = $('input[type="text"]').val();
        if($.trim(inp_content) == ''){
            alert('请输入内容！');
            return;
        }else{
            var item = {
                title:'',
                content:'',
                isCheck:false,
                remind_time:'',
                is_notice:false
            };
            item.title = inp_content;
            itemArray.push(item);
            render_view();
        }
    });
    //tab切换
    $('.content .header li').on('click',function(){
        $(this).addClass('curr').siblings().removeClass('curr');
        var index = $(this).index();
        $('.body').eq(index).addClass('active').siblings().removeClass('active');
    });
    //点击删除
    $('body').on('click','.del',function(){
        var item = $(this).parent();
        var index =item.data('index');
        if (index == undefined || !itemArray[index])return;
        delete itemArray[index];

        $(this).parent().slideUp(1000,function(){
            $(this).remove();
        });
        store.set('itemArray',itemArray);
    });
    //完成事项的添加
    $('body').on('click','input[type=checkbox]',function(){
        var item = $(this).parent();
        var index = item.data('index');
        if (index == undefined || !itemArray[index])return;
        var obj = itemArray[index];
        obj.isCheck = $(this).is(':checked');
        itemArray[index] = obj;
        render_view();
    });
    //详情按钮的设置
    var cur_index = 0;
    $('body').on('click','.detail',function(){
        $('.mask').fadeIn();
        var item = $(this).parent();
        var index = item.data('index');
        cur_index = index;
        var obj = itemArray[index];
        $('.detail_header .title').text(obj.title);
        $('.detail_body textarea').val(obj.content);
        $('.detail_body input[type=text]').val(obj.remind_time);
    });
    $('.mask').click(function(){
        $(this).fadeOut();
    });
    $('.close').click(function(){
        $('.mask').fadeOut();
    });
    $('.detail_content').click(function(event){
        event.stopPropagation();
    });
    /*8.2设置当光标移动到input中设置时间的时候，让对应的时间的选择器展示出来*/
    /*8.21设置本地化时间(设置中国时间)*/
    $.datetimepicker.setLocale('ch');
    /*8.22给对应的标签设置对应时间选择器*/
    $('#date_time').datetimepicker();

    //详情中点击更新的操作
    $('.detail_body button').click(function(){
        var item = itemArray[cur_index];
        item.title = $('.detail_body textarea').val();
        item.remind_time = $('.detail_body input[type=text]').val();
        item.is_notice = false;
        itemArray[cur_index] = item;
        store.set('itemArray',itemArray);

        render_view();
        $('.mask').fadeOut();
    });
    //提醒设置
    setInterval(function(){
        var cur_time = (new Date()).getTime();
        for(var i=0;i<itemArray.length;i++){
            var item = itemArray[i];
            if(item == undefined ||!item ||item.remind_time.length<1||item.is_notice){continue};

            var rem_time = (new Date(item.remind_time)).getTime();
            if(cur_time - rem_time > 2000){
                alert(0);
                $('video').get(0).play();
                $('video').get(0).currentTime = 0;

                item.is_notice = true;
                itemArray[i] = item;
                store.set('itemArray',itemArray);
            }

        }
    })
    //渲染
    function render_view(){
        store.set('itemArray',itemArray);
        $('.task').empty();
        $('.finish_task').empty();
        for(var i=0;i<itemArray.length;i++){
            var obj = itemArray[i];
            if (obj == undefined ||!obj){//为了规范和严格要进行元素的判定
                continue;

            }
            var tag =
                '<li data-index='+ i +' >'+
                '<input type="checkbox"'+(obj.isCheck?'checked':'')+'>'+
                '<span class="right detail">详情</span>'+
                '<span class="right del">删除</span>'+
                '<span class="item_title">'+obj.title+'</span>'+
                '</li>';
            if(obj.isCheck){
                $('.finish_task').prepend(tag);
            }else{
                $('.task').prepend(tag);
            }
        }
    }
});
