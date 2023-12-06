import config from '../config';
import { Seat } from '../types/seat';
import { Coach, CoachDict } from '../types/coach';
import { tryGetSeatsToReserve } from '../utils/seatsResolver';

export const book = async (trainId: string, seatCount: number): Promise<any> => {
    // Step 1: get a booking reference
    const bookingRef = await getBookingRef();


    const seats = await getSeatsToReserve(trainId, seatCount);
    console.log('Seats to reserve', seats);


}

const getBookingRef = async (): Promise<string> => {
    try {
        const response = await fetch(config.bookingReferenceAPIUrl)
        return await response.text()
    } catch (error) {
        return null;
    }
}

const getSeatsToReserve = async (trainId: string, seatCount: number): Promise<string[]> => {
    try {
        // Step 2: fetch train data
        const response = await fetch(`${config.traingDataAPIUrl}/${trainId}`)
        const train = await response.json()
        const seats = Object.values(train.seats) as Seat[]
        console.log('Seats from api', seats);
        const coaches: CoachDict = transformSeatsIntoCoachDictionnary(seats);
        console.log(coaches);
        const seatsToReserve = tryGetSeatsToReserve(coaches, seatCount)

        return seatsToReserve


    } catch (error) {
        return [];
    }
}

const transformSeatsIntoCoachDictionnary = (seats: Seat[]): CoachDict => {
    return seats.reduce((coaches: CoachDict, seat: Seat) => {
        if (!coaches[seat.coach]) {
            coaches[seat.coach] = { totalSeatCount: 0, availableSeats: [] }
        }
        coaches[seat.coach].totalSeatCount++
        if (seat.booking_reference === null) {
            coaches[seat.coach].availableSeats.push(seat.seat_number)
        }
        return coaches
    }, {})
}