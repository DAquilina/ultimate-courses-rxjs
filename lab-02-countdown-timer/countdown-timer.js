import { fromEvent, interval, Subscription } from "rxjs";
import { filter, map, mapTo, scan, take, takeWhile, takeUntil, startWith } from "rxjs/operators";


const messageElement = document.getElementById("timer-message");
const timerElement = document.getElementById("timer");

const abortButton = document.getElementById("abort");

const subscriptions = new Subscription();

const abortStream = fromEvent(abortButton, "click");
const intervalStream = interval(500);

let launched;

const START_VALUE = 10;


/**
 * Toggles the fade class to make the timer fade in and out
 */
subscriptions.add(
    intervalStream.pipe(
        scan((accumulator, current) => {

            return !accumulator;
        }),
        take((2 * START_VALUE) + 1),
        takeUntil(abortStream)
    ).subscribe({
        next: (on) => {

            if (on) {
                timerElement.classList = "text-larger";
            }
            else {
                timerElement.classList = "text-larger fade";
            }
        }
    })
);

/**
 * Handles the timer countdown and the message
 */
subscriptions.add(
    intervalStream.pipe(
        map((value) => {
            
            return (value / 2);
        }),
        filter((value) => {
            
            return ((value % 1) === 0);
        }),
        mapTo(-1),
        scan((accumulator, current) => {

            return accumulator + current;
        }, START_VALUE),
        takeWhile((value) => {

            return (value > 0);
        }, true),
        takeUntil(abortStream),
        startWith(START_VALUE)
    ).subscribe((value) => {

        timerElement.innerText = value.toString();

        if (value == 0) {
            launched = true;
            messageElement.innerText = "Liftoff!";
            abortButton.style.display = "none";
        }
    })
);

/**
 * Ends the timer prematurely
 */
subscriptions.add(
    abortStream.subscribe((event) => {

        if (!launched) {
            timerElement.classList = "text-larger fade";
            messageElement.innerText = "ABORTED";
            abortButton.style.display = "none";
        }
    })
);
