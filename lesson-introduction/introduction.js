import { Observable, Subscription } from "rxjs";

const subscriptions = new Subscription();


const observer = {
    next: (value) => {

        console.log("Next:", value);
    },
    error: (error) => {

        console.log("Error:", error);
    },
    complete: () => {

        console.log("Complete:");
    }
}

const stream = new Observable((subscriber) => {

    let count = 0;

    const intervalId = setInterval(() => {

        console.log(count++);
    }, 1000);

    return () => {

        console.log("Internal completion callback");

        clearTimeout(intervalId);
    };
});

subscriptions.add(
    stream.subscribe(observer)
);

subscriptions.add(
    stream.subscribe(observer)
);

subscriptions.add(
    stream.subscribe(observer)
);

setTimeout(() => {

    subscriptions.unsubscribe();
}, 10000);
