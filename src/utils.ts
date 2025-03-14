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
