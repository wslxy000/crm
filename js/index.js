$(function(){
    let $itemBoxList = null;
    init();
 
    let $plan = $.Callbacks();
    $plan.add((_,baseInfo)=>{
        // console.log("渲染用户信息与退出:",baseInfo)
        $(".baseBox>span").html(`你好，${baseInfo.name || ""}`);
        $(".baseBox>a").click(async function(){
            let result = await axios.get("/user/signout");
            if(result.code==0){
                window.location.href="login.html";
                return;
            }
            alert("网络不给力，请稍后再试！")
        })
    })
    $plan.add((power)=>{
        // console.log("渲染菜单:",power)
        let str = ``;
        // userhandle|departhandle|jobhandle|customerall
        if(power.includes("userhandle")){
            str +=`
            <div class="itemBox" text="员工管理">
            <h3>
            <i class="iconfont icon-yuangong"></i>
            员工管理
            </h3>
            <nav class="item">
            <a href="page/userlist.html" target="iframeBox">员工列表</a>
            <a href="page/useradd.html" target="iframeBox">新增员工</a>
            </nav>
            </div>
            `
        }
        if(power.includes("departhandle")){
            str +=`
            <div class="itemBox" text="部门管理">
            <h3>
            <i class="iconfont icon-yuangong"></i>
            部门管理
            </h3>
            <nav class="item">
            <a href="page/userlist.html" target="iframeBox">部门列表</a>
            <a href="page/useradd.html" target="iframeBox">新增部门</a>
            </nav>
            </div>
            `
        }
        if(power.includes("jobhandle")){
            str +=`
            <div class="itemBox" text="职位管理">
            <h3>
            <i class="iconfont icon-yuangong"></i>
            职位管理
            </h3>
            <nav class="item">
            <a href="page/userlist.html" target="iframeBox">职位列表</a>
            <a href="page/useradd.html" target="iframeBox">新增职位</a>
            </nav>
            </div>
            `
        }
        if(power.includes("customerall")){
            str +=`
            <div class="itemBox" text="客户管理">
            <h3>
            <i class="iconfont icon-yuangong"></i>
            客户管理
            </h3>
            <nav class="item">
            <a href="page/userlist.html" target="iframeBox">我的客户</a>
            <a href="page/userlist.html" target="iframeBox">全部客户</a>
            <a href="page/useradd.html" target="iframeBox">新增客户</a>
            </nav>
            </div>
            `
        }
        $(".menuBox").html(str)
        $itemBoxList = $(".menuBox").find(".itemBox")
    })

    function handGroup(index){
        let $group1=$itemBoxList.filter((_,item)=>{
            let text = $(item).attr("text");
            return text === "客户管理"
        })
        let $group2=$itemBoxList.filter((_,item)=>{
            let text = $(item).attr("text");
            return /^(员工管理|部门管理|职位管理)/.test(text)
        })
        if(index == 0){
            $group1.css("display","block")
            $group2.css("display","none")
        }else if(index == 1){
            $group1.css("display","none")
            $group2.css("display","block")
        }
    }
    $plan.add(power=>{
        let initIndex = power.includes("customer") ? 0 : 1;
        $(".navBox>a").eq(initIndex).addClass("active").siblings().removeClass("active");
        handGroup(initIndex);
        $(".navBox>a").click(function(){
            let index = $(this).index();
            let text = $(this).html().trim()
            if(text==="客户管理"&& !/customerall/.test(power) || (text==="组织结构") && !/(userhandle|departhandle|jobhandle)/.test(power)){
                alert("没有权限访问！")
                return;
            }
            if(index===initIndex) return;
            $(this).addClass("active").siblings().removeClass("active");
            handGroup(index)
            initIndex=index;
        })
    })
    async function init(){
     let res= await axios.get('/user/login');
     if(res.code !=0){
         alert("您未登录，请先登录！");
         window.location.href = "login.html"
         return;
     }
     let [power,baseInfo]=await axios.all([
         axios.get("/user/power"),
         axios.get("/user/info")
     ])
     baseInfo.code === 0 ? baseInfo = baseInfo.data : null;
     power.code === 0 ? power = power.power : null;
     $plan.fire(power,baseInfo)
    }
})