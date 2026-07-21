/* ==========================================
   Financial System
   Settings
========================================== */

const openingCash =
document.getElementById("openingCash");

const openingBank =
document.getElementById("openingBank");

const loginCode =
document.getElementById("loginCode");

const darkMode =
document.getElementById("darkMode");

const saveSettings =
document.getElementById("saveSettings");

/* ==========================================
   Load Settings
========================================== */

let settings = STORAGE.getSettings();

openingCash.value = settings.cashBalance || 0;

openingBank.value = settings.bankBalance || 0;

loginCode.value = localStorage.getItem("financial_code") || "258963";

darkMode.checked = settings.darkMode || false;

/* ==========================================
   Save Settings
========================================== */

saveSettings.addEventListener("click",()=>{

    settings.cashBalance =
    Number(openingCash.value);

    settings.bankBalance =
    Number(openingBank.value);

    settings.darkMode =
    darkMode.checked;

    STORAGE.saveSettings(settings);

    localStorage.setItem(
        "financial_code",
        loginCode.value
    );

    alert("تم حفظ الإعدادات بنجاح");

});

/* ==========================================
   Dark Mode
========================================== */

if(settings.darkMode){

    document.body.classList.add("dark");

}else{

    document.body.classList.remove("dark");

}