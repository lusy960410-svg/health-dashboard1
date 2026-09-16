const $=id=>document.getElementById(id);
$("today").textContent=new Intl.DateTimeFormat("zh-CN",{dateStyle:"medium"}).format(new Date());
$("importBtn").onclick=()=>$("fileInput").click();
$("fileInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>parseCSV(r.result);r.readAsText(f)};
function parseCSV(text){
 const rows=text.trim().split(/\r?\n/).map(x=>x.split(",").map(v=>v.trim().replace(/^"|"$/g,"")));
 if(rows.length<2)return;
 const h=rows[0].map(x=>x.toLowerCase());
 const data=rows.slice(1).map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]??""])));
 const pick=(o,keys)=>{for(const k of keys){if(o[k]!==undefined&&o[k]!=="")return o[k]}return "—"};
 const latest=data[data.length-1];
 $("recovery").textContent=pick(latest,["recovery","recovery_score"]);
 $("sleep").textContent=pick(latest,["sleep","sleep_duration","sleep_hours"]);
 $("hrv").textContent=pick(latest,["hrv","hrv_ms"]);
 $("rhr").textContent=pick(latest,["rhr","resting_heart_rate"]);
 $("strain").textContent=pick(latest,["strain"]);
 $("steps").textContent=pick(latest,["steps"]);
 $("status").textContent="数据已载入";
 $("summary").textContent=`已读取 ${data.length} 条记录。字段名可继续扩展适配不同设备。`;
 const cols=["date","recovery","sleep","hrv","rhr","strain","steps"];
 $("table").innerHTML="<table><thead><tr>"+cols.map(c=>`<th>${c}</th>`).join("")+"</tr></thead><tbody>"+
 data.slice(-7).reverse().map(o=>"<tr>"+cols.map(c=>`<td>${pick(o,[c])}</td>`).join("")+"</tr>").join("")+"</tbody></table>";
}