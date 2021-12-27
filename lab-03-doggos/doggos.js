import { fromEvent, Subscription, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import { finalize, pluck, switchMapTo, takeUntil, tap } from "rxjs/operators";


const nextButton = document.getElementById("next");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");

const nextClick = fromEvent(nextButton, "click");
const pauseClick = fromEvent(pauseButton, "click");
const playClick = fromEvent(playButton, "click");

const img = document.getElementById("image-element");


const request = ajax.getJSON('https://random.dog/woof.json?include=jpg,jpeg,png,gif').pipe(
    pluck('url')
);


const poller = timer(0, 5000).pipe(
    tap((event) => {

        pauseButton.style.display = "inline-block";
        playButton.style.display = "none";
    }),
    switchMapTo(request),
    takeUntil(pauseClick),
    finalize(() => {

        pauseButton.style.display = "none";
        playButton.style.display = "inline-block";
    })
)


const subscriptions = new Subscription();


subscriptions.add(
    playClick.pipe(
        switchMapTo(poller)
    ).subscribe((imageUrl) => {

        img.src = imageUrl;
        img.style.display = "block";
    })
);

subscriptions.add(
    nextClick.subscribe((event) => {

        // Reset the interval
        pauseButton.click();
        playButton.click();
    })
);
