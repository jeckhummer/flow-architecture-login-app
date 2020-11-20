export function delay<T>(timeoutInMs: number, arg?: T): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(arg), timeoutInMs));
}
