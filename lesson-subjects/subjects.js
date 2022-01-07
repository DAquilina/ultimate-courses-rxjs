import { BehaviorSubject, fromEvent, interval, Subject, Subscription } from "rxjs"
import { tap } from "rxjs/operators";


const subscriptions = new Subscription();

const clickStream = fromEvent(document.getElementById("addSubscriptionButton"), "click");
const intervalStream = interval(1000);

const subjects = {
    "behaviorSubject": new BehaviorSubject("Start!"),
    "subject": new Subject()
};

let subscriberCount = 0;
let newElement;


function addSubscriber(index, type) {

    newElement = document.createElement("div", {});
    newElement.id = `${type}-${index}`;

    document.getElementById(`${type}SubscriptionContainer`).appendChild(newElement);

    subjects[type].subscribe((value) => {

        document.getElementById(`${type}-${index}`).innerText += `${value}, `;
    });
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
    clickStream.subscribe((event) => {

        const targetIndex = subscriberCount++;

        addSubscriber(targetIndex, "subject");
        addSubscriber(targetIndex, "behaviorSubject");
    })
);
