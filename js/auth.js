/* ==========================================
   Financial System
   Authentication
========================================== */


/* ==========================================
   Elements
========================================== */

const inputs =
    document.querySelectorAll(".pin");

const message =
    document.getElementById(
        "loginMessage"
    );


/* ==========================================
   Login Code
========================================== */

function getLoginCode() {

    let savedCode =
        localStorage.getItem(
            "financial_code"
        );


    /* ==========================
       Default Code
    ========================== */

    if (!savedCode) {

        savedCode = "111555";

        localStorage.setItem(
            "financial_code",
            savedCode
        );

    }


    /* ==========================
       Fix Old Default Code
    ========================== */

    if (savedCode === "123456") {

        savedCode = "111555";

        localStorage.setItem(
            "financial_code",
            savedCode
        );

    }


    return savedCode;

}


/* ==========================================
   Already Logged In
========================================== */

if (
    localStorage.getItem(
        "financial_logged"
    ) === "true"
) {

    window.location.href =
        "dashboard.html";

}


/* ==========================================
   Focus First Input
========================================== */

if (inputs.length > 0) {

    inputs[0].focus();

}


/* ==========================================
   Input Handling
========================================== */

inputs.forEach(
    (input, index) => {


        /* ==========================
           Input
        ========================== */

        input.addEventListener(
            "input",
            () => {


                /* أرقام فقط */

                input.value =
                    input.value.replace(
                        /[^0-9]/g,
                        ""
                    );


                /* الانتقال للخانة التالية */

                if (
                    input.value &&
                    index <
                        inputs.length - 1
                ) {

                    inputs[
                        index + 1
                    ].focus();

                }


                /* فحص الكود */

                checkLogin();

            }
        );


        /* ==========================
           Backspace
        ========================== */

        input.addEventListener(
            "keydown",
            (e) => {


                if (
                    e.key ===
                        "Backspace" &&
                    input.value === "" &&
                    index > 0
                ) {

                    inputs[
                        index - 1
                    ].focus();

                }

            }
        );

    }
);


/* ==========================================
   Check Login
========================================== */

function checkLogin() {


    let code = "";


    /* تجميع الأرقام */

    inputs.forEach(
        input => {

            code +=
                input.value;

        }
    );


    /* ==========================
       الكود غير مكتمل
    ========================== */

    if (
        code.length !== 6
    ) {

        return;

    }


    /* ==========================
       الكود الصحيح
    ========================== */

    const correctCode =
        getLoginCode();


    if (
        code === correctCode
    ) {


        /* تسجيل الدخول */

        localStorage.setItem(
            "financial_logged",
            "true"
        );


        /* رسالة النجاح */

        if (message) {

            message.style.color =
                "#22c55e";

            message.textContent =
                "جاري تسجيل الدخول...";

        }


        /* الانتقال للرئيسية */

        setTimeout(
            () => {

                window.location.href =
                    "dashboard.html";

            },
            400
        );


        return;

    }


    /* ==========================
       الكود غير صحيح
    ========================== */

    if (message) {

        message.style.color =
            "#ef4444";

        message.textContent =
            "كود الدخول غير صحيح";

    }


    /* إضافة الاهتزاز */

    const loginCard =
        document.querySelector(
            ".login-card"
        );


    if (loginCard) {

        loginCard.classList.add(
            "shake"
        );

    }


    /* ==========================
       إعادة المحاولة
    ========================== */

    setTimeout(
        () => {


            inputs.forEach(
                input => {

                    input.value = "";

                }
            );


            if (
                inputs.length > 0
            ) {

                inputs[0].focus();

            }


            if (message) {

                message.textContent =
                    "";

            }


            if (loginCard) {

                loginCard.classList.remove(
                    "shake"
                );

            }

        },
        700
    );

}


/* ==========================================
   Paste 6-Digit Code
========================================== */

document.addEventListener(
    "paste",
    (e) => {


        const pasted =
            (
                e.clipboardData ||
                window.clipboardData
            )
            .getData("text")
            .replace(
                /[^0-9]/g,
                ""
            );


        /* لازم يكون 6 أرقام */

        if (
            pasted.length !== 6
        ) {

            return;

        }


        /* توزيع الأرقام */

        inputs.forEach(
            (input, index) => {

                input.value =
                    pasted[index] || "";

            }
        );


        /* فحص الكود */

        checkLogin();

    }
);
