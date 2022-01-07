import { Subject } from 'rxjs';


const loadingSubject = new Subject();


export const loadingService = {
    setLoadingState: (state) => {

        loadingSubject.next(!!state);
    },
    loadingStream: loadingSubject.asObservable()
};
