```javascript
let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

let coins =
    Number(localStorage.getItem("coins")) || 0;

let darkMode =
    localStorage.getItem("darkMode") === "true";

let time = 25 * 60;

let timer = null;

let running = false;


// ==============================
// حفظ البيانات
// ==============================

function saveData() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "coins",
        coins
    );
}


// ==============================
// إضافة مهمة
// ==============================

function addTask() {

    const input =
        document.getElementById("taskInput");

    const text =
        input.value.trim();

    if (text === "") {

        alert("اكتب المهمة الأول!");

        return;
    }

    tasks.push({

        text: text,

        completed: false,

        rewarded: false

    });

    input.value = "";

    saveData();

    showTasks();
}


// ==============================
// عرض المهام
// ==============================

function showTasks() {

    const list =
        document.getElementById("taskList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    tasks.forEach(function(task, index) {

        const li =
            document.createElement("li");

        li.innerHTML = `

            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="completeTask(${index})"
            >

            <span class="task-name ${
                task.completed
                    ? "completed"
                    : ""
            }">
                ${task.text}
            </span>

            <button
                class="delete-btn"
                onclick="deleteTask(${index})">
                حذف
            </button>

        `;

        list.appendChild(li);

    });

    updateStats();
}


// ==============================
// إكمال المهمة
// ==============================

function completeTask(index) {

    const task =
        tasks[index];

    if (!task) {
        return;
    }

    task.completed =
        !task.completed;

    if (
        task.completed &&
        !task.rewarded
    ) {

        task.rewarded = true;

        coins += 10;

        alert(
            "🎉 أحسنت!\n\n" +
            "🪙 حصلت على 10 Coins!"
        );
    }

    saveData();

    showTasks();
}


// ==============================
// حذف المهمة
// ==============================

function deleteTask(index) {

    tasks.splice(index, 1);

    saveData();

    showTasks();
}


// ==============================
// الإحصائيات
// ==============================

function updateStats() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;

    let percentage = 0;

    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );
    }

    const taskCount =
        document.getElementById(
            "taskCount"
        );

    const completedCount =
        document.getElementById(
            "completedCount"
        );

    const progress =
        document.getElementById(
            "progress"
        );

    const coinsDisplay =
        document.getElementById(
            "coins"
        );

    if (taskCount) {

        taskCount.textContent =
            total;
    }

    if (completedCount) {

        completedCount.textContent =
            completed;
    }

    if (progress) {

        progress.textContent =
            percentage + "%";
    }

    if (coinsDisplay) {

        coinsDisplay.textContent =
            coins;
    }

    updateLevel();
}


// ==============================
// المستوى
// ==============================

function updateLevel() {

    const levelElement =
        document.getElementById(
            "level"
        );

    const levelCoins =
        document.getElementById(
            "levelCoins"
        );

    const levelProgress =
        document.getElementById(
            "levelProgress"
        );

    if (
        !levelElement ||
        !levelCoins ||
        !levelProgress
    ) {
        return;
    }

    const level =
        Math.floor(coins / 100) + 1;

    const currentCoins =
        coins % 100;

    levelElement.textContent =
        level;

    levelCoins.textContent =
        currentCoins;

    levelProgress.style.width =
        currentCoins + "%";
}


// ==============================
// الساعة والتاريخ
// ==============================

function updateClock() {

    const now =
        new Date();

    const hours =
        String(now.getHours())
            .padStart(2, "0");

    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");

    const seconds =
        String(now.getSeconds())
            .padStart(2, "0");

    const clock =
        document.getElementById(
            "clock"
        );

    if (clock) {

        clock.textContent =
            `${hours}:${minutes}:${seconds}`;
    }

    const days = [
        "الأحد",
        "الاثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت"
    ];

    const months = [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر"
    ];

    const date =
        document.getElementById(
            "date"
        );

    if (date) {

        date.textContent =
            `${days[now.getDay()]}، ` +
            `${now.getDate()} ` +
            `${months[now.getMonth()]} ` +
            `${now.getFullYear()}`;
    }
}


// ==============================
// الوضع الليلي
// ==============================

function applyDarkMode() {

    document.body.classList.toggle(
        "dark",
        darkMode
    );

    const button =
        document.getElementById(
            "themeButton"
        );

    if (button) {

        button.textContent =
            darkMode
                ? "☀️"
                : "🌙";
    }
}


function toggleDarkMode() {

    darkMode =
        !darkMode;

    localStorage.setItem(
        "darkMode",
        darkMode
    );

    applyDarkMode();
}


// ==============================
// المؤقت
// ==============================

function updateTimer() {

    let minutes =
        Math.floor(time / 60);

    let seconds =
        time % 60;

    minutes =
        String(minutes)
            .padStart(2, "0");

    seconds =
        String(seconds)
            .padStart(2, "0");

    const display =
        document.getElementById(
            "timerDisplay"
        );

    if (display) {

        display.textContent =
            minutes + ":" + seconds;
    }
}


function startTimer() {

    if (running) {
        return;
    }

    running = true;

    timer =
        setInterval(function() {

            if (time > 0) {

                time--;

                updateTimer();

            } else {

                clearInterval(timer);

                running = false;

                alert(
                    "🎉 انتهى وقت التركيز!"
                );
            }

        }, 1000);
}


function pauseTimer() {

    clearInterval(timer);

    running = false;
}


function resetTimer() {

    clearInterval(timer);

    running = false;

    time = 25 * 60;

    updateTimer();
}


// ==============================
// تشغيل الموقع
// ==============================

showTasks();

updateTimer();

updateStats();

applyDarkMode();

updateClock();

setInterval(
    updateClock,
    1000
);
```
