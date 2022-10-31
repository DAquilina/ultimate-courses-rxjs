import { queueScheduler } from 'rxjs';


/*
 * This code was taken directly from the Ultimate Courses RxJs masterclass example
 */
console.log("synchronous - before");

// This entire queue will execute before the next synchronous task
queueScheduler.schedule(() => {
    queueScheduler.schedule(() => {
        console.log("inside second queue");

        queueScheduler.schedule(() => {

            console.log("inside third queue");
        });
    });

    console.log("inside first queue");
});

console.log("synchronous - after");
