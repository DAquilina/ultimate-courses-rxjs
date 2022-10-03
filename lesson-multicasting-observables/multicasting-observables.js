import { interval, Subscription } from "rxjs";
import { finalize, share } from "rxjs/operators";

const subscriptions = new Subscription();


const observer = {
    next: (value) => {

        console.log("Next:", value);
    },
    error: (error) => {

        console.log("Error:", error);
    },
    complete: () => {

        console.log("Complete");
    }
}

const stream = interval(1000).pipe(
    // NOTE: The instructions used the multicast operator, but this was deprecated in RxJs 8+
    finalize(() => {

        console.log("Source completed");
    }),
    share()
);

subscriptions.add(
    stream.subscribe(observer)
);

setTimeout(() => {

    subscriptions.add(
        stream.subscribe(observer)
    );
}, 1000);

setTimeout(() => {

    subscriptions.add(
        stream.subscribe(observer)
    );
}, 2000);


setTimeout(() => {

    subscriptions.unsubscribe();
}, 10000);
