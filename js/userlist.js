$(function(){
    let checklist = null;
    //下拉选项卡
    initDepartMent()
    async function initDepartMent(){
        let result = await queryDepart();
        if(result.code==0){
            let str =``;
            str += `<option value="0">全部</option>`
            result.data.forEach(item=>{
                str+=`
                <option value="${item.id}">${item.name}</option>
                `
            })
            $(".selectBox").html(str)
        }
    }
    //显示员工列表
    showUserList()
    async function showUserList(){
        let params = {
            departmentId: $(".selectBox option:selected").val(),
            // departmentId:$(".selectBox").val(),
            search:$(".searchInp").val().trim()
        }
        let result = await axios.get("/user/list",{params})
        let str=``;
        if(result.code !== 0){
            $("tbody").html(str)
            return;
        }
        result.data.forEach(item=>{
            let {
                id,
                name,
                sex,
                email,
                phone,
                department,
                job,
                desc
            } = item;
            str +=`
            <tr>
            <td class="w3"><input type="checkbox" userId="${id}"></td>
            <td class="w10">${name}</td>
            <td class="w5">${sex==0?'男':'女'}</td>
            <td class="w10">${department}</td>
            <td class="w10">${job}</td>
            <td class="w15">${email}</td>
            <td class="w15">${phone}</td>
            <td class="w20">${desc}</td>
            <td class="w12" userId="${id}">
                 <a href="javascript:;">编辑</a>
                 <a href="javascript:;">删除</a>
                 <a href="javascript:;">重置密码</a>
            </td>
            </tr>
            `
        })
        $("tbody").html(str)
        checklist = $("tbody").find('input[type="checkbox"]')
    }
    //筛选
    $(".selectBox").on("change",showUserList);
    //编辑-删除—重置密码
    delegate();
    function delegate(){
        $("tbody").on("click","a",async e=>{
            let target = e.target,
            tag = target.tagName,
            text = target.innerHTML.trim();
            if(tag==='A'){
                let userId = $(target).parent().attr("userid")
                if(text==="编辑"){
                    window.location.href=`useradd.html?id=${userId}`
                    return;
                }
                if(text==="删除"){
                    let flag = confirm("你确定要删除此用户吗？");
                    if(!flag) return;
                    let result = await axios.get('/user/delete',{
                        params:{ userId }
                    })
                    if(result.code===0){
                        alert("删除用户信息成功！");
                        showUserList();
                        checklist = $("tbody").find('input[type="checkbox"]')
                        // $(target).parent().parent().remove();
                        return;
                    }
                    return;
                }
                if(text==="重置密码"){
                    let flag = confirm("你确定要重置此用户的密码吗？");
                    if(!flag) return;
                    let result = await axios.post("/user/resetpassword",{userId});
                    if(result.code===0){
                        alert("重置密码成功，请告诉你的员工！")
                        return;
                    }
                    return;
                }
            }
        })
    }
    //全选操作
    selecthandle()
    function selecthandle(){
        $("#checkAll").click(e=>{
            let checked = $("#checkAll").prop("checked");
            checklist.prop("checked",checked)
        })
        //下面全选，全选键跟着改变
        $("tbody").on("click","input",e=>{
            if(e.target.tagName === "INPUT"){
                let flag = true;
                newChecklist = Array.from(checklist);
                newChecklist.forEach(item=>{
                    if(!$(item).prop("checked")){
                        flag = false;
                    }
                })
                $("#checkAll").prop("checked",flag)
            }
        })

    }
    //批量删除操作
    $(".deleteAll").click(e=>{
        let arr = [];
        [].forEach.call(checklist,item=>{
            if($(item).prop("checked")){
                arr.push($(item).attr('userid'))
            }
        })
        if(arr.length === 0){
            alert("请选择一些数据！")
            return;
        }
        let flag = confirm("你确定要删除这些数据吗？");
        if(!flag) return;
        let index = -1;
        async  function deleteUser(){
            let userId = arr[++index];
            if(index>=arr.length){
                alert("已删除所选员工！");
                showUserList();
                return;
            }
            let result = await axios.get('/user/delete',{
                params:{
                    userId
                }
            })
            if(result.code != 0) return;    
            deleteUser();
        }
        deleteUser()
    })

})