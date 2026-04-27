// script.js — updated to match current index.html inputs (A1, A2, B, C1, C2, D, E)
// and to handle empty inputs as 0. Also fixed date suffix logic.

function fill() {
  // read numeric inputs, default to 0 when empty
  const a1 = Number(document.getElementById("A1").value) || 0;
  const a2 = Number(document.getElementById("A2").value) || 0;
  const b = Number(document.getElementById("B").value) || 0;
  const c1 = Number(document.getElementById("C1").value) || 0;
  const c2 = Number(document.getElementById("C2").value) || 0;
  const d = Number(document.getElementById("D").value) || 0;
  const e = Number(document.getElementById("E").value) || 0;

  const V1 = Number(document.getElementById("V").textContent) || 0;

  const vol1 = Number(document.getElementById("vol").value) || 0;
  const ls1 = Number(document.getElementById("ls").value) || 0;

  const TV11 = Number(document.getElementById("TV1").value) || 0;
  const TV22 = Number(document.getElementById("TV2").value) || 0;

  // calculations
  const totalBelievers = a1 + a2 + b + c1 + c2 + d + e;
  const overallTotal = totalBelievers + V1;

  const totalMainHall = a1 + a2 + b + c1 + c2;
  const totalBalcony = d + e + V1;

  const vab = TV11 - vol1;      // volunteers absent (TV1 - vol present)
  const lsab = TV22 - ls1;     // WL&SL absent (TV2 - ls present)
  const tav = vol1 + ls1;      // total present volunteers + ls
  const tlav = vab + lsab;     // total abs (vab + lsab)
  const TV12_sum = TV11 + TV22; // combined TV1 + TV2

  // write results to DOM
  document.getElementById("nob").textContent = totalBelievers;
  document.getElementById("ot").textContent = overallTotal;
  document.getElementById("mh").textContent = totalMainHall;
  document.getElementById("fv").textContent = totalBalcony;

  document.getElementById("vab").textContent = vab;
  document.getElementById("lsab").textContent = lsab;

  document.getElementById("tav").textContent = tav;
  document.getElementById("tlav").textContent = tlav;
  document.getElementById("TV12").textContent = TV12_sum;


  // ✅ ADD THIS AT THE END OF fill()
localStorage.setItem('NLAG_mainHall', totalMainHall);
localStorage.setItem('NLAG_balcony', totalBalcony);

// auto generate report
generateReport(totalMainHall, totalBalcony);
markSaved();
}

function calculateVolAndLdePresent() {
  const vol = Number(document.getElementById("vol").value) || 0;
  const ls = Number(document.getElementById("ls").value) || 0;

  document.getElementById("V").textContent = vol + ls;
}


// date formatting and suffix
function getFormattedDate() {
  const date = new Date();
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function suffix(d) {
    if (d % 10 === 1 && d !== 11) return "st";
    if (d % 10 === 2 && d !== 12) return "nd";
    if (d % 10 === 3 && d !== 13) return "rd";
    return "th";
  }

  return day + suffix(day) + " " + monthNames[date.getMonth()];
}

// set date on load




// paste into script.js or a <script> before </body>
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('TV1') === null) localStorage.setItem('TV1', '26');
  if (localStorage.getItem('TV2') === null) localStorage.setItem('TV2', '9');

  const tv1 = document.getElementById('TV1');
  const tv2 = document.getElementById('TV2');
  const volInput = document.getElementById("vol");
  const lsInput = document.getElementById("ls");

  if (tv1) tv1.value = localStorage.getItem('TV1');
  if (tv2) tv2.value = localStorage.getItem('TV2');

  if (tv1) tv1.addEventListener('input', e => localStorage.setItem('TV1', e.target.value));
  if (tv2) tv2.addEventListener('input', e => localStorage.setItem('TV2', e.target.value));

  if (volInput) volInput.addEventListener("input", calculateVolAndLdePresent);
  if (lsInput) lsInput.addEventListener("input", calculateVolAndLdePresent);

  calculateVolAndLdePresent();

  document.getElementById("dat").textContent = getFormattedDate();
});

// Prevent accidental refresh / tab close
let formChanged = false;

// mark page as changed when user types in any input
document.addEventListener("input", function (e) {
  if (e.target.matches("input")) {
    formChanged = true;
  }
});

// when user clicks fill, assume data is intentionally saved/generated
function markSaved() {
  formChanged = false;
}

// browser warning on refresh / close
window.addEventListener("beforeunload", function (e) {
  if (formChanged) {
    e.preventDefault();
    e.returnValue = "";
  }
});
