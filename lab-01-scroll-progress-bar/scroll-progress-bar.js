import { fromEvent, Subscription } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";


const progressBar = document.querySelector(".scroll-progress-bar");

const subscriptions = new Subscription();


function calculateScrollPercent(element) {

    // Concept: Object destructuring
    // '-> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    const {
        clientHeight,
        scrollHeight,
        scrollTop
    } = element;

    return ((scrollTop / (scrollHeight - clientHeight)) * 100);
}


subscriptions.add(
    fromEvent(document, "scroll").pipe(
        map((event) => {

            // Note: scrollingElement determines the element that is causing the scroll to happen, an dit should be used for this calculation.
            //       The lab indicates that documentElement schould be used, but in that case scrollTop is always 0
            return calculateScrollPercent(event.target.scrollingElement);
        }),
        distinctUntilChanged()
    ).subscribe((percent) => {

        progressBar.style.width = `${percent}%`;
    })
);
