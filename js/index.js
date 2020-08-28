$(function(){
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
        console.log("渲染菜单:",power)
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
     $plan.fire(power,baseInfo)
    }
})