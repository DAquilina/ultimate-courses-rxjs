import { fromEvent, Subscription, timer } from "rxjs";
import { auditTime, debounce, debounceTime, distinctUntilChanged, pluck, sampleTime, throttleTime } from "rxjs/operators";


const auditTimeInput = document.getElementById("auditTime");
const auditTimeValue = document.getElementById("auditTimeValue");
const debounceInput = document.getElementById("debounce");
const debounceValue = document.getElementById("debounceValue");
const debounceTimeInput = document.getElementById("debounceTime");
const debounceTimeValue = document.getElementById("debounceTimeValue");
const sampleTimeInput = document.getElementById("sampleTime");
const sampleTimeValue = document.getElementById("sampleTimeValue");
const throttleTimeInput = document.getElementById("throttleTime");
const throttleTimeValue = document.getElementById("throttleTimeValue");

const subscriptions = new Subscription();

let lastDebounceValue = 1;


subscriptions.add(
    fromEvent(auditTimeInput, "keyup").pipe(
        auditTime(1000),
        pluck("target", "value"),
        distinctUntilChanged()
    ).subscribe((value) => {

        auditTimeValue.innerText = value;
    })
);

subscriptions.add(
    fromEvent(debounceInput, "keyup").pipe(
        debounce(() => {

            return timer(lastDebounceValue);
        }),
        pluck("target", "value"),
        distinctUntilChanged()
    ).subscribe((value) => {

        lastDebounceValue = value;
        debounceValue.innerText = lastDebounceValue;
    })
);

subscriptions.add(
    fromEvent(debounceTimeInput, "keyup").pipe(
        debounceTime(1000),
        pluck("target", "value"),
        distinctUntilChanged()
    ).subscribe((value) => {

        debounceTimeValue.innerText = value;
    })
);

subscriptions.add(
    fromEvent(sampleTimeInput, "keyup").pipe(
        sampleTime(1000),
        pluck("target", "value"),
        distinctUntilChanged()
    ).subscribe((value) => {

        sampleTimeValue.innerText = value;
    })
);

subscriptions.add(
    fromEvent(throttleTimeInput, "keyup").pipe(
        throttleTime(1000),
        pluck("target", "value"),
        distinctUntilChanged()
    ).subscribe((value) => {

        throttleTimeValue.innerText = value;
    })
);
