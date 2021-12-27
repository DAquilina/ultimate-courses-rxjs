import { EMPTY, fromEvent, interval, merge, of, Subscription } from "rxjs";
import { mapTo, scan, takeWhile, startWith, switchMap, tap } from "rxjs/operators";


const messageElement = document.getElementById("timer-message");
const timerElement = document.getElementById("timer");

const abortButton = document.getElementById("abort");
const pauseButton = document.getElementById("pause");
const startButton = document.getElementById("start");

const subscriptions = new Subscription();

const abortStream = fromEvent(abortButton, "click");
const pauseStream = fromEvent(pauseButton, "click");
const startStream = fromEvent(startButton, "click");
const intervalStream = interval(1000);

let launched;

const START_VALUE = 10;

const STATE = {
    stop: -1,
    pause: 0,
    start: 1
};


subscriptions.add(
    merge(
        abortStream.pipe(
            mapTo(STATE.stop)
        ),
        pauseStream.pipe(
            mapTo(STATE.pause)
        ),
        startStream.pipe(
            mapTo(STATE.start)
        )
    ).pipe(
        tap((state) => {
    
            switch (state) {
                case STATE.pause:
                    pauseButton.style.display = "none";
                    startButton.style.display = "inline-block";
                    
                    messageElement.innerText = "PAUSED";

                    break;
                case STATE.start:
                    abortButton.classList = "control-button";
                    pauseButton.style.display = "inline-block";
                    startButton.style.display = "none";
                    
                    messageElement.innerText = "";

                    break;
                case STATE.stop:
                    abortButton.classList = "control-button disabled";
                    pauseButton.style.display = "none";
                    startButton.style.display = "inline-block";

                    messageElement.innerText = "ABORTED";

                    break;
            }
        }),
        switchMap((state) => {

            switch (state) {
                case STATE.pause:
                    return EMPTY;
                case STATE.start:
                    return intervalStream;
                case STATE.stop:
                    return of(state);
            }
        }),
        scan((accumulator, current) => {

            if (current === STATE.stop) {
                return START_VALUE;
            }
            else {
                return accumulator - 1;
            }
        }, START_VALUE),
        takeWhile((value) => {

            return (value >= 0);
        }),
        startWith(START_VALUE)
    ).subscribe((value) => {
        
        timerElement.innerText = value.toString();

        if (value == 0) {
            messageElement.innerText = "Liftoff!";
            
            pauseButton.style.display = "none";
            startButton.style.display = "inline-block";

            abortButton.classList = "control-button disabled";
            startButton.classList = "control-button disabled";
        }
    })
);
