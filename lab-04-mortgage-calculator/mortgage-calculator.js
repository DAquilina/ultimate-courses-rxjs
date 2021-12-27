import { combineLatest, fromEvent, of, Subscription } from "rxjs";
import { debounceTime, delay, filter, map, pluck, mergeMap, share } from "rxjs/operators";


const ammortizationPeriodInput = document.getElementById("ammortization-period");
const interestRateInput = document.getElementById("interest-rate");
const principleInput = document.getElementById("principle");

const paymentValue = document.getElementById("payment-value");

const subscriptions = new Subscription();


function calculateMortgage(prinicple, interestRate, ammortizationPeriod) {

    const resolvedInterest = interestRate / 1200; // Magic number?

    const total = (prinicple * resolvedInterest) / (1 - Math.pow(1/(1 + resolvedInterest), ammortizationPeriod));

    return total.toFixed(2);
}

function getValueStream(element) {

    return fromEvent(element, "input").pipe(
        debounceTime(300),
        pluck("target", "valueAsNumber"),
        filter((value) => {

            return !isNaN(value)
        })
    )
}

function processValue(value) {

    return of(value).pipe(
        delay(1000)
    );
}


const calculationStream =  combineLatest([
    getValueStream(principleInput),
    getValueStream(interestRateInput),
    getValueStream(ammortizationPeriodInput)
]).pipe(
    // Deconstruct the array
    map(([principle, interestRate, ammortizationPeriod]) => {

        return calculateMortgage(principle, interestRate, ammortizationPeriod);
    }),
    share()
)


subscriptions.add(
    calculationStream.pipe(
        mergeMap((value) => {

            return processValue(value);
        })
    ).subscribe((value) => {

        console.log(`Processed ${value}`);
    })
)

subscriptions.add(
    calculationStream.subscribe((value) => {

        paymentValue.innerText = `\$${value}`;
    })
)
