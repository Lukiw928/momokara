// details.html のHTMLを生成する。

let menu = localStorage.getItem("menu_name");
let data = JSON.parse(localStorage.getItem("item_data"));
let file_path = localStorage.getItem("file_path");
let classification = localStorage.getItem("classification").trim();
// ご飯のサイズ一覧
let rice = {
    "無し":-100,
    "半分":-50,
    "少なめ":0,
    "普通":0,
    "大盛":50,
    "特盛":100
};
// ご飯の具
let rice_ball = [
    "高菜","明太子","昆布","梅"
];


// ヘッダー部分
var back = "";
if (classification=="おにぎり"){
    back += "<a class='to_cooking_btn' href='menus.html'>戻る</a><h1>"+menu+"</h1>"
}else{
    back += "<a class='to_cooking_btn' href='cooking.html'>戻る</a><h1>"+menu+"</h1>"
}

// body部分
var res = "";

res += "<div class='container'><ul>";

// 種別がおにぎりの時用の画面
if (classification=="おにぎり"){
    for (var i=0; i<4; i++){
        res += "<li><input type='radio' name='rice_ball' id="+rice_ball[i]+" onclick=add_rice_ball(this.id)><label for="+rice_ball[i]+">"+rice_ball[i]+"</label>";
        res += "<div class='check'></div></li>";
    }

// 種別がおにぎり以外の時
}else{
    res += "<div class='item_img'>";
    res += "<img src='img/cooking/"+file_path+"/"+data["image_index"]+".png'>";
    res += "</div>";

    // サイズを選択してもらうチェックボックス
    for (let [size,price] of Object.entries(data["price"])){
        res += "<li><input type='radio' name='size' id="+size+" onclick=add_size(this.id)><label for="+size+">"+size+" : "+price+" 円</label>";
        res += "<div class='check'></div></li>";
    }
}
res += "</ul>"

// ご飯のサイズを選択してもらうチェックボックス
if (classification=="弁当" || classification=="丼"){
    res += "<ul>"
    for (let [size,price] of Object.entries(rice)){
        if (classification=="丼" && size=="無し"){
            continue
        }
        if (size=="普通"){
            res += "<li><input type='radio' name='rice' checked='checked' id="+size+" onclick=add_rice(this.id)><label for="+size+">"+size+" : "+price+" 円</label>";
        }else{
            res += "<li><input type='radio' name='rice' id="+size+" onclick=add_rice(this.id)><label for="+size+">"+size+" : "+price+" 円</label>";
        }
        res += "<div class='check'></div></li>";
    }
    res += "</ul>"
}

// 高菜の洗濯をしてもらうチェックボックス
if (classification=="弁当"){
    res += "<ul><li><input type='checkbox' name='takana' id='takana'><label for='takana'>高菜トッピング : 50円</label>";
    res += "<div class='check'></div></li></ul>";
}
res += "</div>"

// 次の画面へすすむ - 弁当か否かで遷移
res += "<div class='to_next'>"
if (classification=="弁当"){
    res += "<p onclick=to_decision_bento();>すすむ</p>"
}else{
    res += "<p onclick=to_decision();>すすむ</p>"
}
res += "</div>"

// HTMLを生成
$(document).ready(function(){
    localStorage.setItem("rice","普通")
    localStorage.setItem("size",null)
    $("header").html(back)
    $("#description").html(res)
})

// 料理のサイズをセット
function add_size(getId){
    localStorage.setItem("size",getId);
}

// ご飯をセット
function add_rice(getId){
    localStorage.setItem("rice",getId);
    console.log(localStorage.getItem("rice"));
}

// ご飯の具をセット
function add_rice_ball(getId){
    localStorage.setItem("rice_ball",getId);
    console.log(getId);
}

// 弁当用の遷移関数
function to_decision_bento(){
    let takana = document.getElementsByName("takana");
    let rice_data = document.getElementsByName("rice");
    var calculation = 0;

    // 高菜がチェックされているか
    if (takana.item(0).checked){
        localStorage.setItem("takana",true)
        takana = true
    }else{
        localStorage.setItem("takana",false)
        takana = false
    }

    // 追加
    let size = document.getElementsByName("size");
    var go = false;
    for (var i=0; i < size.length; i++){
        if (size.item(i).checked){
            go = true
        }
    }
    if (rice_data.item(0).checked && takana){
        alert("ご飯無しでは高菜トッピングはできません。")
    }
    else if (!go){
        alert("お弁当のサイズを選択してください")
    }else{
        var transmit = []
        transmit.push(menu+" "+localStorage.getItem("size"))
        calculation += data["price"][localStorage.getItem("size")]
        transmit.push("+ ご飯"+localStorage.getItem("rice"))
        calculation += rice[localStorage.getItem("rice")]
        if (takana){
            transmit.push("+ 高菜トッピング")
            calculation += 50
        }
        // console.log(calculation)
        localStorage.setItem("summary",null)
        localStorage.setItem("summary",JSON.stringify(transmit))
        localStorage.setItem("total",calculation)
        window.location.href = "decision.html";
    }
}

// 弁当以外の遷移関数
function to_decision(){
    if (classification=="おにぎり"){
        var summary = JSON.parse(localStorage.getItem("summary"))
        summary.push(localStorage.getItem("rice_ball"))
        localStorage.setItem("summary",JSON.stringify(summary))
        window.location.href = "decision.html";
    }else{
        let size = document.getElementsByName("size");
        var go = false;
        var calculation = 0;
        for (var i=0; i < size.length; i++){
            if (size.item(i).checked){
                go = true
            }
        }
        if (go){
            var transmit = []
            transmit.push(menu+" "+localStorage.getItem("size"))
            calculation += data["price"][localStorage.getItem("size")]
            if (classification=="丼"){
                transmit.push("ご飯"+localStorage.getItem("rice"))
                calculation += rice[localStorage.getItem("rice")]
            }
            console.log(calculation)
            localStorage.setItem("summary",null)
            localStorage.setItem("summary",JSON.stringify(transmit))
            localStorage.setItem("total",calculation)
            window.location.href = "decision.html";
        }else{
            alert("サイズを選択してください")
        }
    }
    
}

// debug

// for (let [key, value] of Object.entries(data)) {
//     if (key=="price"){
//         for (let [size, price] of Object.entries(value)) {
//             console.log(size,price)
//         }
//     }else{
//         console.log('key:' + key + ' value:' + value);
//     }
// }