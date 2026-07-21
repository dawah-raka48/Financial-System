/* ==========================================
   Financial System
   Authentication
========================================== */

const LOGIN_CODE =
localStorage.getItem("financial_code") || "123456";

const inputs = document.querySelectorAll(".pin");
const message = document.getElementById("loginMessage");

/* إذا كان المستخدم مسجل دخول من قبل */

if (localStorage.getItem("financial_logged") === "true") {
    window.location.href = "dashboard.html";
}

/* التركيز على أول خانة */

inputs[0].focus();

/* التنقل بين الخانات */

inputs.forEach((input, index) => {

    input.addEventListener("input", () => {

        input.value = input.value.replace(/[^0-9]/g, "");

        if (input.value && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }

        checkLogin();

    });

    input.addEventListener("keydown", (e) => {

        if (e.key === "Backspace" && input.value === "" && index > 0) {
            inputs[index - 1].focus();
        }

    });

});

/* فحص الكود */

function checkLogin() {

    let code = "";

    inputs.forEach(input => {
        code += input.value;
    });

    if (code.length !== 6) return;

    if (code === LOGIN_CODE) {

        localStorage.setItem("financial_logged", "true");

        message.style.color = "#22c55e";
        message.textContent = "جاري تسجيل الدخول...";

        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 400);

    } else {

        message.style.color = "#ef4444";
        message.textContent = "كود الدخول غير صحيح";

        document.querySelector(".login-card").classList.add("shake");

        setTimeout(() => {

            inputs.forEach(input => input.value = "");

            inputs[0].focus();

            message.textContent = "";

            document.querySelector(".login-card").classList.remove("shake");

        }, 700);

    }

}