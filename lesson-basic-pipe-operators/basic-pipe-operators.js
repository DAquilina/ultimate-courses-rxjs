import { fromEvent, interval, Subscription } from "rxjs";
import { map, mapTo, pluck, reduce, take } from "rxjs/operators";


const observer = {
    complete: logComplete,
    error: console.error,
    next: console.log,
}

const subscriptions = new Subscription();


function computeTotal(accumulator, currentValue) {

    return accumulator + currentValue;
}


function logComplete() {

    console.log("Complete!");
}


subscriptions.add(
    fromEvent(document, "keydown").pipe(
        map((event) => {

            return `keydown: ${event.code}`
        })
    ).subscribe(observer)
);

subscriptions.add(
    fromEvent(document, "keyup").pipe(
        pluck("code"),
        map((code) => {

            return `keyup: ${code}`;
        })
    ).subscribe(observer)
);

subscriptions.add(
    fromEvent(document, "keypress").pipe(
        mapTo("keypress happened")
    ).subscribe(observer)
);

subscriptions.add(
    interval(1000).pipe(
        take(5),
        reduce(computeTotal)
    ).subscribe((value) => {

        subscriptions.unsubscribe();

        console.log("Reduce completed:", value);
    })
)
