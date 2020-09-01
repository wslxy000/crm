$(function(){
    let userId = null;
    let params = window.location.href.queryURLParams();
    if(params.hasOwnProperty("id")){
        userId = params.id;
        getBaseInfo();
    }
    async function getBaseInfo(){
        let result = await axios.get("/user/info",{
            params:{ userId }
        })
        if(result.code === 0){
            result = result.data;
            $(".username").val(result.name);
            result.sex ==0 ? $("#man").prop('checked',true):$("#woman").prop('checked',true);
            $(".useremail").val(result.email);
            $(".userphone").val(result.phone);
            $(".userdepartment").val(result.departmentId);
            $(".userjob").val(result.jobId);
            $(".userdesc").val(result.desc);
            return;
        }
        alert("编辑不成功！！");
        userId = null;
    }
    //下拉显示
    initDeptAndJob()
    async function initDeptAndJob(){
        let departmentData=await queryDepart();
        let jobData = await queryJob();
        if(departmentData.code === 0){
            departmentData=departmentData.data;
            let str=``;
            departmentData.forEach(item=>{
                str +=`
                <option value="${item.id}">${item.name}</option>
                `
            })
            $('.userdepartment').html(str)
        }
        if(jobData.code === 0){
            jobData=jobData.data;
            let str=``;
            jobData.forEach(item=>{
                str +=`
                <option value="${item.id}">${item.name}</option>
                `
            })
            $(".userjob").html(str)
        }
    }
    //校验姓名
    function checkname(){
        let val = $(".username").val().trim();
        if(val.length==0){
            $(".spanusername").html("必填！")
            return false;
        }
        if(!/^[\u4e00-\u9fa5]{2,10}$/.test(val)){
            $(".spanusername").html("姓名为2~10个汉字");
            return false;
        }
        $(".spanusername").html("");
            return true;
    }
    //校验邮箱
    function checkemail(){
        let val = $(".useremail").val().trim();
        if(val.length==0){
            $(".spanuseremail").html("必填！");
            return false;
        }
        if(!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(val)){
            $(".spanuseremail").html("邮箱格式不正确！");
            return false;
        }
        $(".spanuseremail").html(" ");
            return true;
    }
    //校验手机号
    function checkphone(){
        let val = $(".userphone").val().trim();
        if(val.length==0){
            $(".spanuserphone").html("必填！");
            return false;
        }
        if(!/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(val)){
            $(".spanuserphone").html("请填写正确的手机号！");
            return false;
        }
        $(".spanuserphone").html("");
        return true;
    }
    $(".username").blur(checkname);
    $(".useremail").blur(checkemail);
    $(".userphone").blur(checkphone);
    $(".submit").click(async function(){
        if(!checkname()||!checkemail()||!checkphone()){
            alert("数据不合法！");
            return;
        };
        let params = {
            name:$(".username").val().trim(),
            sex:$("#man").val().trim(),
            email:$(".useremail").val().trim(),
            phone:$(".userphone").val().trim(),
            departmentId:$(".userdepartment").val(),
            jobId:$(".userjob").val(),
            desc:$(".userdesc").val().trim()
        }
        //判断是否为编辑
        if(userId){
            params.userId=userId;
            let result = await axios.post('/user/update',params);
            if(result.code === 0){
                alert("修改数据成功！");
                window.location.href="userlist.html";
                return;
            }
            alert("网络不给力！");
            return;
        }
        //实现添加
        let result = await axios.post("/user/add",params);
        if(result.code === 0){
            alert("添加员工成功！");
            window.location.href="userlist.html";
            return;
        }
        alert("网络不给力！！")
    })
   
})