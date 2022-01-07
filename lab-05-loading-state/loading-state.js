import { fromEvent, Subscription } from "rxjs";
import { loadingService } from "./loading.service";


const overlay = document.getElementById("overlay");
const stateButton = document.getElementById("stateButton");

const subscriptions = new Subscription();

subscriptions.add(
    loadingService.loadingStream.subscribe((state) => {

        if (state) {
            overlay.classList.add("open");
        }
        else {
            overlay.classList.remove("open");
        }
    })
);

subscriptions.add(
    fromEvent(stateButton, "click").subscribe((event) => {

        loadingService.setLoadingState(true);
        
        setTimeout(() => {
        
            loadingService.setLoadingState(false);
        }, 3000);
    })
);

