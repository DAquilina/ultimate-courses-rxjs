import {
    BehaviorSubject,
    Subject
} from "rxjs";

import {
    distinctUntilKeyChanged,
    pluck,
    scan
} from "rxjs/operators";


export class ObservableStore {

    constructor(initialState) {

        // State is stored as a set of key-value pairs
        this._store = new BehaviorSubject(initialState);
        this._stateUpdates = new Subject();

        this._stateUpdates.pipe(
            scan((accumulatedValues, currentValue) => {

                return {
                    ...accumulatedValues,
                    ...currentValue
                }
            }, initialState)
        ).subscribe(this._store);
    }

    updateState(state) {

        this._stateUpdates.next(state);
    }

    selectState(key) {

        return this._store.pipe(
            distinctUntilKeyChanged(key),
            pluck(key)
        );
    }

    stateChanges() {

        return this._store.asObservable();
    }
}
