const mainBtns = document.querySelectorAll(".clockSettings button");
const sessionTimer = document.getElementById("session-length");
const breakTimer = document.getElementById("break-length");
const play = document.getElementById("start_stop");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const reset = document.getElementById("reset");
let playing = false;
let inSession = true;
let timerId;
let currentTime;
const divmod = (x, y) => [Math.floor(x / y).toString(), (x % y).toString()];
const notNegative = (count) => {
    if (count > 1) return true;
    else return false;
};
const notOutOfBounds = (count) => {
    if (count < 60) return true;
    else return false;
};

function changeTime(event) {
    if (event.target.dataset.upDown === "up") {
        if (event.target.dataset.mode === "break") {
            if (notOutOfBounds(breakTimer.textContent))
                breakTimer.textContent = +breakTimer.textContent + 1;
        } else if (event.target.dataset.mode === "session") {
            if (notOutOfBounds(sessionTimer.textContent))
                sessionTimer.textContent = +sessionTimer.textContent + 1;
        }
    } else if (event.target.dataset.upDown === "down") {
        if (event.target.dataset.mode === "break") {
            if (notNegative(breakTimer.textContent))
                breakTimer.textContent = +breakTimer.textContent - 1;
        } else if (event.target.dataset.mode === "session") {
            if (notNegative(sessionTimer.textContent))
                sessionTimer.textContent = +sessionTimer.textContent - 1;
        }
    }
    minutes.textContent = sessionTimer.textContent;
}

mainBtns.forEach((el) => el.addEventListener("click", changeTime));

const resetClock = () => {
    clearInterval(timerId);
    playing = false;
    minutes.textContent = timer.session;
    sessionTimer.textContent = timer.session;
    breakTimer.textContent = timer.break;
    seconds.textContent = "00";
    document.title = "Pomodoro App";
    document.getElementById("mainTitle").textContent = "25 + 5 Clock";
};
reset.addEventListener("click", resetClock);

let timer = {
    session: 25,
    break: 5,
    multiplier: 60,
};

const checkSession = () => {
    clearInterval(timerId);
    document.getElementById("beep").play();
    inSession = !inSession;
    playing = false;
    setTimeout(startClock, 2000);
};

const startClock = () => {
    if (inSession) {
        currentTime = +sessionTimer.textContent * 60;
        document.getElementById("mainTitle").textContent = "Work Session";
    } else {
        currentTime = +breakTimer.textContent * 60;
        document.getElementById("mainTitle").textContent = "Break Time!";
    }
    if (!playing) {
        playing = true;
        const endTime = Math.floor(Date.now() / 1000) + currentTime;
        timerId = setInterval(() => {
            let secondsPassed = endTime - Math.floor(Date.now() / 1000);
            if (secondsPassed <= 0) {
                checkSession();
            }
            let [min, sec] = divmod(secondsPassed, 60);
            minutes.textContent = min;
            seconds.textContent = sec.padStart(2, "0");
            document.title = `${min}:${sec.padStart(2, "0")} left!`;
        }, 1000);
    }
};

play.addEventListener("click", startClock);
