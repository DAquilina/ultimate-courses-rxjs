import { interval, Subscription } from "rxjs";
import { finalize, share, shareReplay } from "rxjs/operators";

const subscriptions = new Subscription();


const observer = (streamLabel) => {

    return {
        next: (value) => {

            console.log(`Next (${streamLabel}):`, value);
        },
        error: (error) => {

            console.log(`Error (${streamLabel}):`, error);
        },
        complete: () => {

            // NOTE: The stream completes *after* the observers have already unsubscribed, so we will
            //       not see this message
            console.log(`Complete (${streamLabel})`);
        }
    };
};

// NOTE: at this point, the stream has not been multicast, so the first subscriber to each of the
//       multicast variants below will still create a new interval path
const stream = interval(1000).pipe(
    finalize(() => {

        // NOTE: finalize will run whenever the stream terminate, either by completing, through unsubscription,
        //       or when an error is thrown
        console.log("Source completed");
    })
);

const streamWithShare = stream.pipe(
    // NOTE: The instructions used the multicast operator, but this was deprecated in RxJs 8+
    share()
);

// shareReplay emits all previous values when the subscriber subscribes
const streamWithShareReplay = stream.pipe(
    shareReplay()
);

// You can limit both the number of replayed values and the time frame for which buffered values are
// stored by passing in arguments
const streamWithLimitedShareReplay = stream.pipe(
    shareReplay(2)
);

subscriptions.add(
    stream.subscribe(observer("-- No Multicast ----------"))
);

subscriptions.add(
    streamWithShare.subscribe(observer("share 0"))
);

subscriptions.add(
    streamWithShareReplay.subscribe(observer("shareReplay 0"))
);

setTimeout(() => {

    subscriptions.add(
        streamWithShare.subscribe(observer("share 1000"))
    );

    subscriptions.add(
        streamWithShareReplay.subscribe(observer("shareReplay 1000"))
    );

    // This is the first subscription to streamWithLimitedShareReplay, so it will create a new stream
    // instance that starts at 0 despite the other multicast streams having already emitted a value
    subscriptions.add(
        streamWithLimitedShareReplay.subscribe(observer("limited shareReplay 1000"))
    );
}, 1000);

setTimeout(() => {

    subscriptions.add(
        streamWithShare.subscribe(observer("share 2000"))
    );

    subscriptions.add(
        streamWithShareReplay.subscribe(observer("shareReplay 2000"))
    );
}, 2000);

setTimeout(() => {

    // Should only replay 2 and 3
    subscriptions.add(
        streamWithLimitedShareReplay.subscribe(observer("limited shareReplay 5000"))
    );
}, 5000);


setTimeout(() => {

    subscriptions.unsubscribe();
}, 10000);
