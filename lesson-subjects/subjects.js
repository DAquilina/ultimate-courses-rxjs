import { AsyncSubject, BehaviorSubject, fromEvent, interval, ReplaySubject, Subject, Subscription } from "rxjs"
import { takeUntil, tap } from "rxjs/operators";


const subscriptions = new Subscription();

const completeSubject = new Subject();

const addSubscriptionButtonStream = fromEvent(document.getElementById("addSubscriptionButton"), "click");
const completeSourceButtonStream = fromEvent(document.getElementById("completeSourceButton"), "click");

const intervalStream = interval(1000).pipe(
    takeUntil(completeSubject)
);

const subjects = {
    "behaviorSubject": new BehaviorSubject("Start!"),
    "subject": new Subject(),
    "replaySubject": new ReplaySubject(),
    "replaySubjectN": new ReplaySubject(3),
    "asyncSubject": new AsyncSubject()
};

let subscriberCount = 0;
let newElement;


function addSubscriber(index, type) {

    newElement = document.createElement("div", {});
    newElement.id = `${type}-${index}`;

    document.getElementById(`${type}SubscriptionContainer`).appendChild(newElement);

    subjects[type].subscribe((value) => {

        const element = document.getElementById(`${type}-${index}`);

        if (element.innerText) {
            element.innerText += ", ";
        }

        element.innerText += `${value}`;
    });
}

function completeSource() {

    completeSubject.next();

    document.getElementById("addSubscriptionButton").disabled = true;
    document.getElementById("completeSourceButton").disabled = true;
}


Object.keys(subjects).forEach((key) => {

    subscriptions.add(
        intervalStream.pipe(
            tap((value) => {

                console.log(key, "Interval:", value);
            })
        ).subscribe(subjects[key])
    );
})

subscriptions.add(
    addSubscriptionButtonStream.subscribe((event) => {

        const targetIndex = subscriberCount++;

        addSubscriber(targetIndex, "subject");
        addSubscriber(targetIndex, "behaviorSubject");
        addSubscriber(targetIndex, "replaySubject");
        addSubscriber(targetIndex, "replaySubjectN");
        addSubscriber(targetIndex, "asyncSubject");
    })
);

subscriptions.add(
    completeSourceButtonStream.subscribe((event) => {

        completeSource();
    })
);
