const $ = id => document.getElementById(id);

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

setText(
  "today",
  new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date())
);

const WHOOP_API_URL =
  "https://script.google.com/macros/s/AKfycbxIwLZDBT70r9vZzuL5GF4YdqjmbzWp4g_Pmv-FYVrWGkZPN-ArtLuNvG0xYQh0wFw4-Q/exec";


// =========================
// CSV 导入
// =========================

const importBtn = $("importBtn");
const fileInput = $("fileInput");

if (importBtn && fileInput) {
  importBtn.onclick = () => fileInput.click();

  fileInput.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = event => {
      const text = event.target.result;
      const rows = parseCSV(text);

      if (!rows.length) return;

      const latest = rows[rows.length - 1];

      setText("recovery", latest.recovery ?? "—");
      setText("sleep", latest.sleep ?? "—");
      setText("hrv", latest.hrv ?? "—");
      setText("rhr", latest.rhr ?? "—");
      setText("strain", latest.strain ?? "—");
      setText("steps", latest.steps ?? "—");

      setText("status", "CSV 数据已导入");
    };

    reader.readAsText(file);
  };
}

function parseCSV(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map(x => x.trim().toLowerCase());

  return lines.slice(1).map(line => {
    const values = line.split(",");
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() ?? "";
    });

    return row;
  });
}


// =========================
// WHOOP 数据
// =========================

function loadWhoopData() {
  const script = document.createElement("script");

  script.src =
    WHOOP_API_URL +
    "?api=dashboard&callback=receiveWhoopData";

  script.onerror = () => {
    setText("status", "WHOOP 数据读取失败");
  };

  document.body.appendChild(script);
}


// =========================
// WHOOP 数据处理
// =========================

function receiveWhoopData(data) {
  if (!data) {
    setText("status", "WHOOP 没有返回数据");
    return;
  }

  const recovery =
    data.recovery?.records?.[0]?.score || {};

  const cycle =
    data.cycles?.records?.[0]?.score || {};

  const sleep =
    data.sleep?.records?.[0]?.score || {};


  // Recovery
  if (recovery.recovery_score != null) {
    setText(
      "recovery",
      Math.round(recovery.recovery_score)
    );
  }


  // HRV
  if (recovery.hrv_rmssd_milli != null) {
    setText(
      "hrv",
      Math.round(recovery.hrv_rmssd_milli) + " ms"
    );
  }


  // RHR
  if (recovery.resting_heart_rate != null) {
    setText(
      "rhr",
      Math.round(recovery.resting_heart_rate) + " bpm"
    );
  }


  // Strain
  if (cycle.strain != null) {
    setText(
      "strain",
      Number(cycle.strain).toFixed(1)
    );
  }


  // Sleep
  if (sleep.stage_summary) {
    const x = sleep.stage_summary;

    const ms =
      (x.total_light_sleep_time_milli || 0) +
      (x.total_slow_wave_sleep_time_milli || 0) +
      (x.total_rem_sleep_time_milli || 0);

    if (ms > 0) {
      const hours = ms / 1000 / 60 / 60;

      setText(
        "sleep",
        hours.toFixed(1) + " h"
      );
    }
  }


  // WHOOP API 当前没有直接提供 Steps
  setText("steps", "—");

  setText("status", "WHOOP 已连接 · 数据已更新");
}


// =========================
// 页面打开时自动读取 WHOOP
// =========================

window.addEventListener("DOMContentLoaded", () => {
  loadWhoopData();
});