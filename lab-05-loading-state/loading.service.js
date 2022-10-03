import { BehaviorSubject } from 'rxjs';


const loadingSubject = new BehaviorSubject(false);


export const loadingService = {
    setLoadingState: (state) => {

        loadingSubject.next(!!state);
    },
    loadingStream: loadingSubject.asObservable()
};
