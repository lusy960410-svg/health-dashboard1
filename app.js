const $=id=>document.getElementById(id);
$("today").textContent=new Intl.DateTimeFormat("zh-CN",{dateStyle:"medium"}).format(new Date());
$("importBtn").onclick=()=>$("fileInput").click();
$("fileInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>parseCSV(r.result);r.readAsText(f)};
const WHOOP_API_URL="https://script.google.com/macros/s/AKfycbxIwLZDBT70r9vZzuL5GF4YdqjmbzWp4g_Pmv-FYVrWGkZPN-ArtLuNvG0xYQh0wFw4-Q/exec";

function loadWhoopData(){
  const s=document.createElement("script");
  s.src=WHOOP_API_URL+"?api=dashboard&callback=receiveWhoopData&_="+Date.now();
  document.body.appendChild(s);
}

function receiveWhoopData(data){
  const r=data.recovery?.records?.[0]?.score||{};
  const c=data.cycles?.records?.[0]?.score||{};
  const sl=data.sleep?.records?.[0]?.score||{};
  
  $("recovery").textContent=r.recovery_score??"—";
  $("hrv").textContent=r.hrv_rmssd_milli?Math.round(r.hrv_rmssd_milli):"—";
  $("rhr").textContent=r.resting_heart_rate??"—";
  $("strain").textContent=c.strain??"—";
  
  if(sl.stage_summary?.total_in_bed_time_milli){
    const WHOOP_API="https://script.google.com/macros/s/AKfycbxIwLZDBT70r9vZzuL5GF4YdqjmbzWp4g_Pmv-FYVrWGkZPN-ArtLuNvG0xYQh0wFw4-Q/exec?api=dashboard&callback=handleWhoopData";

function loadWhoopData(){
  const s=document.createElement("script");
  s.src=WHOOP_API;
  document.body.appendChild(s);
}

function handleWhoopData(data){
  const r=data.recovery.records?.[0];
  const c=data.cycles.records?.[0];
  const s=data.sleep.records?.[0];

  if(r?.score){
    $("recovery").textContent=r.score.recovery_score ?? "—";
    $("hrv").textContent=r.score.hrv_rmssd_milli
      ? Math.round(r.score.hrv_rmssd_milli)+" ms" : "—";
    $("rhr").textContent=r.score.resting_heart_rate
      ? Math.round(r.score.resting_heart_rate)+" bpm" : "—";
  }

  if(c?.score){
    $("strain").textContent=c.score.strain
      ? Number(c.score.strain).toFixed(1) : "—";
  }

  if(s?.score?.stage_summary){
    const x=s.score.stage_summary;
    const ms=(x.total_light_sleep_time_milli||0)
      +(x.total_slow_wave_sleep_time_milli||0)
      +(x.total_rem_sleep_time_milli||0);
    $("sleep").textContent=ms
      ? (ms/3600000).toFixed(1)+" h" : "—";
  }

  $("steps").textContent="—";
  $("status").textContent="WHOOP 数据已连接";
}

loadWhoopData();
    $("sleep").textContent=(sl.stage_summary.total_in_bed_time_milli/3600000).toFixed(1)+" h";
  }
  
  $("status").textContent="WHOOP 数据已同步";
  $("summary").textContent="已读取 WHOOP 最新数据";
}

loadWhoopData();
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