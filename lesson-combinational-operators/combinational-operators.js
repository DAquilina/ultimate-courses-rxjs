import { combineLatest, concat, forkJoin, interval, merge, Subscription } from "rxjs";
import { take } from "rxjs/operators";


const intervalStream = interval(1000).pipe(
    take(5)
);

const combineLatestElement = document.getElementById("combine-latest-container");
const concatElement = document.getElementById("concat-container");
const forkJoinElement = document.getElementById("fork-join-container");
const mergeElement = document.getElementById("merge-container");

const combineLatestValues = [];
const concatValues = [];
const forkJoinValues = [];
const mergeValues = [];


const subscriptions = new Subscription();


subscriptions.add(
    combineLatest([intervalStream, intervalStream]).subscribe((value) => {

        combineLatestValues.push(`(${value.join(", ")})`);

        combineLatestElement.innerText = `[${combineLatestValues.join(", ")}]`;
    })
);

subscriptions.add(
    concat(intervalStream, intervalStream).subscribe((value) => {

        concatValues.push(value);

        concatElement.innerText = `[${concatValues.join(", ")}]`;
    })
);

subscriptions.add(
    forkJoin([intervalStream, intervalStream]).subscribe((value) => {

        forkJoinValues.push(`(${value.join(", ")})`);

        forkJoinElement.innerText = `[${forkJoinValues.join(", ")}]`;
    })
);

subscriptions.add(
    merge(intervalStream, intervalStream).subscribe((value) => {

        mergeValues.push(value);

        mergeElement.innerText = `[${mergeValues.join(", ")}]`;
    })
);
