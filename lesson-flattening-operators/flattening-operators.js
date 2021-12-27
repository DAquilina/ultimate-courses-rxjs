import { fromEvent, interval, Subscription } from "rxjs";
import { concatMap, exhaustMap, mergeMap, scan, switchMap, take } from "rxjs/operators";


const mouseDown = fromEvent(document, "mousedown");

let concatMapTotal = 0;
let exhaustMapTotal = 0;
let mergeMapTotal = 0;
let switchMapTotal = 0;

const concatMapValue = document.getElementById("concatMapValue");
const exhaustMapValue = document.getElementById("exhaustMapValue");
const mergeMapValue = document.getElementById("mergeMapValue");
const switchMapValue = document.getElementById("switchMapValue");

const intervalStream = interval(100).pipe(
    take(10)
);

const subscriptions = new Subscription();


// Executes increments sequentially
subscriptions.add(
    mouseDown.pipe(
        concatMap(() => {
    
            return intervalStream;
        }),
        scan((accumulator, current) => {
    
            return (accumulator + 0.1);
        }, concatMapTotal)
    ).subscribe((value) => {

        concatMapTotal = Math.round(value * 10) / 10;
        concatMapValue.innerText = concatMapTotal;
    })
);

// Ignores new increment events while a counter is running
subscriptions.add(
    mouseDown.pipe(
        exhaustMap(() => {
    
            return intervalStream;
        }),
        scan((accumulator, current) => {
    
            return (accumulator + 0.1);
        }, exhaustMapTotal)
    ).subscribe((value) => {

        exhaustMapTotal = Math.round(value * 10) / 10;
        exhaustMapValue.innerText = exhaustMapTotal;
    })
);

// Executes increments concurrently
subscriptions.add(
    mouseDown.pipe(
        mergeMap(() => {
    
            return intervalStream;
        }),
        scan((accumulator, current) => {
    
            return (accumulator + 0.1);
        }, mergeMapTotal)
    ).subscribe((value) => {

        mergeMapTotal = Math.round(value * 10) / 10;
        mergeMapValue.innerText = mergeMapTotal;
    })
);

// Will clear the previous increment on each click, potentially resulting in a lower total than the number of clicks
subscriptions.add(
    mouseDown.pipe(
        switchMap(() => {
    
            return intervalStream;
        }),
        scan((accumulator, current) => {
    
            return (accumulator + 0.1);
        }, switchMapTotal)
    ).subscribe((value) => {

        switchMapTotal = Math.round(value * 10) / 10;
        switchMapValue.innerText = switchMapTotal;
    })
);