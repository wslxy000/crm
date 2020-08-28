$(".submit").click(async function(){
    let account = $(".userName").val().trim();
    let password = $(".userPass").val().trim();
    if(account == "" || password == ""){
        alert("账号或密码不能为空！")
        return;
    }
    password = md5(password);
    // axios.post("/user/login",{
    //     account,
    //     password
    // }).then(res=>{
    //     if(parseInt(res.code) === 0){
    //         alert("登录成功")
    //         window.location.href="index.html"
    //         return;
    //     }
    //     alert("用户名或密码错误")
    // }).catch(err=>{
    //     console.log(err)
    // }) 
    let res = await axios.post("/user/login",{account,password});
    // console.log(res)
    if(parseInt(res.code) === 0){
        alert("登录成功")
        location.href="index.html"
        return;
    }
    alert("用户名或密码错误")
})