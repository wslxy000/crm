$(function(){
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
    showUserList()
    async function showUserList(){
        let params = {
            departmentId: $(".selectBox option:selected").val(),
            // departmentId:$(".selectBox").val(),
            scarch:$(".searchInp").val().trim()
        }
        let result = await axios.get("/user/list",{params})
        if(result.code !== 0) return;
        let str=``;
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
    }
    $(".selectBox").on("change",showUserList)
})