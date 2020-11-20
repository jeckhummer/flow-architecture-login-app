import * as React from 'react';

export type IAsyncData<T> =
    | { status: 'initial' }
    | { status: 'loading'; initial: true }
    | { status: 'loading'; initial: false; data: T | null }
    | { status: 'success'; data: T }
    | { status: 'error'; error: string };

export function useAsyncData<T>(
    initialData?: T,
): [IAsyncData<T>, (promise: Promise<T>) => Promise<T>, (state: IAsyncData<T>) => void] {
    const [asyncData, setAsyncData] = React.useState<IAsyncData<T>>(
        initialData !== undefined
            ? { status: 'success', data: initialData }
            : { status: 'initial' },
    );

    function initAsyncData(promise: Promise<T>): Promise<T> {
        setAsyncData(x =>
            x.status === 'initial' || (x.status === 'loading' && x.initial)
                ? {
                      initial: true,
                      status: 'loading',
                  }
                : {
                      data: x.status !== 'error' ? x.data : null,
                      initial: false,
                      status: 'loading',
                  },
        );

        return promise
            .then(data => {
                setAsyncData(() => ({ data, status: 'success' }));
                return data;
            })
            .catch(error => {
                setAsyncData(() => ({ error, status: 'error' }));
                throw error;
            });
    }

    return [asyncData, initAsyncData, setAsyncData];
}
