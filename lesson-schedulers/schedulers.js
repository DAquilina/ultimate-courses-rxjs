import { animationFrameScheduler, asapScheduler, asyncScheduler, fromEvent, range, Subscription } from "rxjs"
import { finalize, observeOn, subscribeOn, tap } from "rxjs/operators";


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

const registerSchedulerObserver = (scheduler) => {

    return {
        next: (value) => {

            asyncSchedulerButton.disabled = true;
            asapSchedulerButton.disabled = true;
            animationFrameSchedulerButton.disabled = true;

            subscriptions.add(
                heavySource.pipe(
                    observeOn(scheduler)
                ).subscribe(updateContainerObserver)
            );
        }
    };
};

const updateContainerObserver = {
    next: (value) => {

        outputContainer.innerText = value;
    },
    complete: () => {

        outputContainer.innerText = "Done!";
    }
};


const asyncSchedulerButton = document.getElementById("asyncSchedulerButton");
const asapSchedulerButton = document.getElementById("asapSchedulerButton");
const animationFrameSchedulerButton = document.getElementById("animationFrameSchedulerButton");

const outputContainer = document.getElementById("schedulerResultContainer"); 

const asyncStream = fromEvent(asyncSchedulerButton, "click");
const asapStream = fromEvent(asapSchedulerButton, "click");
const animationFrameStream = fromEvent(animationFrameSchedulerButton, "click");

subscriptions.add(
    asyncStream.subscribe(
        registerSchedulerObserver(asyncScheduler)
    )
);

subscriptions.add(
    asapStream.subscribe(
        registerSchedulerObserver(asapScheduler)
    )
);

// This should, theoretically, render every number, but does not. TODO: Why?
subscriptions.add(
    animationFrameStream.subscribe(
        registerSchedulerObserver(animationFrameScheduler)
    )
);

/* ********* observeOn vs subscribeOn ********** */

const basicSource = range(1, 5);

const heavySource = range(1, 20000).pipe(
    finalize(() => {

        asyncSchedulerButton.disabled = false;
        asapSchedulerButton.disabled = false;
        animationFrameSchedulerButton.disabled = false;

        setTimeout(() => {

            outputContainer.innerText = "";
        }, 3000);
    })
);

// Subscription happens immediately, but the observer is pushed into the asyncScheduler
// This means that we'll see the `tapped` values first in the console, because they emit
// immediately and appear before the basic subscription
subscriptions.add(
    basicSource.pipe(
        tap((value) => {

            console.log("tap -> observeOn", value);
        }),
        // This is the first thing to be executed after the synchronous emissions since it
        // is the first entity in the async queue
        observeOn(asyncScheduler)
    ).subscribe(observer("observeOn"))
);

// Subscription resolves asynchronously, so the `tapped` values aren't emitted until the same frame as
// the observed values
subscriptions.add(
    basicSource.pipe(
        tap((value) => {

            console.log("tap -> subscribeOn", value);
        }),
        subscribeOn(asyncScheduler)
    ).subscribe(observer("subscribeOn"))
);

// Subscription happens immediately, and the observer executes synchronously.
// We'll see this values after the `tapped` values from the observeOn scheduler
subscriptions.add(
    basicSource.subscribe(observer("Basic"))
);
