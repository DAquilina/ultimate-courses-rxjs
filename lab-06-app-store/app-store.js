import { fromEvent, Subscription } from "rxjs";

import { ObservableStore } from "./app-store-model";


const USERS = [
    "DAquilina",
    "UltimateCourses",
    "5318008",
    "Tom Bombadill",
    "Gerry Attrick",
    "not-a-bot",
    "President Dwayne Elizondo Mountain Dew Herbert Camacho"
]


const subscriptions = new Subscription;


const getRandomUserButton = document.getElementById("getRandomUser");
const toggleIsAuthenticatedButton = document.getElementById("toggleIsAuthenticated");

const getRandomUserStream = fromEvent(getRandomUserButton, "click");
const toggleIsAuthenticatedStream = fromEvent(toggleIsAuthenticatedButton, "click");


function getRandomUser() {

    return USERS[Math.floor(Math.random() * USERS.length)];
}


const observerFactory = (key) => {

    return {
        next: (value) => {

            document.getElementById(key).innerHTML = value;
        },
        error: (error) => {

            console.log("Error:", error);
        },
        complete: () => {

            console.log("Complete");
        }
    }
}

const store = new ObservableStore({
    user: "DAquilina",
    isAuthenticated: false
});


let isAuthenticated = false;


subscriptions.add(
    store.selectState("user").subscribe(observerFactory("user"))
);

subscriptions.add(
    store.selectState("isAuthenticated").subscribe(observerFactory("isAuthenticated"))
);

subscriptions.add(
    store.selectState("isAuthenticated").subscribe(observerFactory("isAuthenticated"))
);


subscriptions.add(
    toggleIsAuthenticatedStream.subscribe({
        next: (event) => {

            isAuthenticated = !isAuthenticated;

            store.updateState({
                isAuthenticated: isAuthenticated
            });
        }
    })
);


subscriptions.add(
    getRandomUserStream.subscribe({
        next: (event) => {

            isAuthenticated = false;

            store.updateState({
                user: getRandomUser(),
                isAuthenticated: isAuthenticated
            });
        }
    })
);
