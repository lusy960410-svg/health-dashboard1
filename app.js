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
  
  const $ = id => document.getElementById(id);

$("today").textContent =
  new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date());

$("importBtn").onclick = () => $("fileInput").click();

$("fileInput").onchange = e => {
  const f = e.target.files[0];
  if (!f) return;

  const reader = new FileReader();

  reader.onload = ev => {
    const rows = ev.target.result.trim().split(/\r?\n/);
    if (rows.length < 2) return;

    const headers = rows[0].split(",").map(x => x.trim().toLowerCase());
    const values = rows[1].split(",").map(x => x.trim());

    const data = {};
    headers.forEach((h, i) => data[h] = values[i]);

    if (data.recovery) $("recovery").textContent = data.recovery;
    if (data.sleep) $("sleep").textContent = data.sleep;
    if (data.hrv) $("hrv").textContent = data.hrv;
    if (data.rhr) $("rhr").textContent = data.rhr;
    if (data.strain) $("strain").textContent = data.strain;
    if (data.steps) $("steps").textContent = data.steps;
  };

  reader.readAsText(f);
};


const WHOOP_API_URL =
  "https://script.google.com/macros/s/AKfycbxIwLZDBT70r9vZzuL5GF4YdqjmbzWp4g_Pmv-FYVrWGkZPN-ArtLuNvG0xYQh0wFw4-Q/exec";


function loadWhoopData() {
  const s = document.createElement("script");
  s.src = WHOOP_API_URL + "?api=dashboard&callback=receiveWhoopData";
  document.body.appendChild(s);
}


function receiveWhoopData(data) {

  const r = data.recovery?.records?.[0]?.score || {};
  const c = data.cycles?.records?.[0]?.score || {};
  const sl = data.sleep?.records?.[0]?.score || {};

  $("recovery").textContent =
    r.recovery_score ?? "—";

  $("hrv").textContent =
    r.hrv_rmssd_milli
      ? Math.round(r.hrv_rmssd_milli) + " ms"
      : "—";

  $("rhr").textContent =
    r.resting_heart_rate
      ? Math.round(r.resting_heart_rate) + " bpm"
      : "—";

  $("strain").textContent =
    c.strain != null
      ? Number(c.strain).toFixed(1)
      : "—";

  if (sl.stage_summary) {

    const x = sl.stage_summary;

    const ms =
      (x.total_light_sleep_time_milli || 0) +
      (x.total_slow_wave_sleep_time_milli || 0) +
      (x.total_rem_sleep_time_milli || 0);

    $("sleep").textContent =
      ms
        ? (ms / 3600000).toFixed(1) + " 小时"
        : "—";
  }
}


loadWhoopData();