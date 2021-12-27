import { fromEvent, Subscription } from "rxjs";

const subscriptions = new Subscription();

const clickStream = fromEvent(document, "click");

subscriptions.add(
    clickStream.subscribe((event) => {

        console.log(`[${event.clientX}, ${event.clientY}]`);
    })
);
