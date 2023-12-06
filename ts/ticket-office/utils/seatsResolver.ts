import { CoachDict } from "../types/coach"

export const tryGetSeatsToReserve = (coaches: CoachDict, seatCount: number): string[] => {
    const { totalSeatCount, totalAvailableSeats, seatsToReserve } = Object.values(coaches).reduce((result, coach) => {
        const seatsNotReserved = result.seatsToReserve.length === 0

        if (seatsNotReserved) {
            const hasEnoughAvailableSeats = coach.availableSeats.length >= seatCount
            const hasOver30PercentAvailable = coach.availableSeats.length / coach.totalSeatCount > 0.3
            if (hasEnoughAvailableSeats && hasOver30PercentAvailable) {
                result.seatsToReserve = coach.availableSeats.slice(0, seatCount)
            }
        }
        result.totalSeatCount += coach.totalSeatCount
        result.totalAvailableSeats += coach.availableSeats.length
        return result
    }, { totalSeatCount: 0, totalAvailableSeats: 0, seatsToReserve: [] as string[] })

    if (totalAvailableSeats - seatCount < totalSeatCount * 0.3) {
        throw new Error("The train reservation has passed the 70% threshold");
    }

    if (seatsToReserve.length === 0) {
        throw new Error("No wagon can accommodate the number of seats requested");
    }

    return seatsToReserve
}