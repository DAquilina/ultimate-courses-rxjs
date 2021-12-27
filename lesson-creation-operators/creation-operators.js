import { from, of, Subscription } from "rxjs";

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

// Concept: Generator Function
// '-> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
function* generator(max) {

    for (let count = 0; count <= max; count++) {
        yield count
    }
}

console.log("-- of -----");

subscriptions.add(
    of([1, 2, 3, 4, 5]).subscribe(observer)
);

console.log("-- from (static) -----");

subscriptions.add(
    from([1, 2, 3, 4, 5]).subscribe(observer)
);

console.log("-- from (iterator) -----");

subscriptions.add(
    from(generator(5)).subscribe(observer)
);
