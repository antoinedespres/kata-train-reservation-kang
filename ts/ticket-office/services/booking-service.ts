import config from '../config';
import { Seat } from '../types/seat';
import { Coach, CoachDict } from '../types/coach';
import { tryGetSeatsToReserve } from '../utils/seatsResolver';
import { Response, BookingResponse, ErrorResponse } from '../dto/response';


export const book = async (trainId: string, seatCount: number): Promise<Response> => {
    let bookingRef = '';
    // Step 1: get a booking reference
    try {
        bookingRef = await getBookingRef();
    } catch {
        return { message: "Cannot get booking reference", code: 500 };
    }


    let seats: string[] = [];

    try {
        seats = await getSeatsToReserve(trainId, seatCount);
    } catch (error) {
        return { message: error.message, code: 404 };
    }

    console.log(seats);


    const reservation = {
        "booking_reference": bookingRef,
        "seats": seats,
        "train_id": trainId
    };

    console.log('Reservation ', reservation);

    const response = await fetch(`${config.trainDataAPIUrl}/reserve`, {
        method: 'POST',
        body: JSON.stringify(reservation),
        headers: { 'Content-Type': 'application/json' }
    });


    if (response.status === 500) {
        return { message: "Internal server error", code: 500 };
    }

    return reservation
}

const getBookingRef = async (): Promise<string> => {
    const response = await fetch(config.bookingReferenceAPIUrl)
    return await response.text()
}

const getSeatsToReserve = async (trainId: string, seatCount: number): Promise<string[]> => {
    // Step 2: fetch train data
    const response = await fetch(`${config.trainDataAPIUrl}/data_for_train/${trainId}`)
    const train = await response.json()
    const seats = Object.values(train.seats) as Seat[]
    console.log('Seats ', seats);

    const coaches: CoachDict = transformSeatsIntoCoachDictionnary(seats);
    console.log('Coaches: ', coaches);
    const seatsToReserve = tryGetSeatsToReserve(coaches, seatCount)

    return seatsToReserve
}

const transformSeatsIntoCoachDictionnary = (seats: Seat[]): CoachDict => {
    return seats.reduce((coaches: CoachDict, seat: Seat) => {
        if (!coaches[seat.coach]) {
            coaches[seat.coach] = { totalSeatCount: 0, availableSeats: [] }
        }
        coaches[seat.coach].totalSeatCount++
        if (seat.booking_reference === '') {
            coaches[seat.coach].availableSeats.push(seat.seat_number)
        }
        return coaches
    }, {})
}