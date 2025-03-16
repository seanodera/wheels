export function toMoneyFormat(amount: number, shorten: boolean = false): string {
    if (shorten) {
        if (amount >= 1_000_000) {
            return (amount / 1_000_000).toFixed(2) + "M";
        } else if (amount >= 1_000) {
            return (amount / 1_000).toFixed(2) + "K";
        }
    }

    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export function deduceTimingValues(value: Date){

    const now = new Date().getTime();
    const endTime = new Date(value).getTime();
    const diff = endTime - now;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return {days: days, hours: hours, minutes: minutes, diff: diff};
}
