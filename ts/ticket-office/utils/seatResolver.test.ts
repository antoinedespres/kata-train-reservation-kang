import { describe, expect, test } from '@jest/globals'
import { CoachDict } from '../types/coach';
import { tryGetSeatsToReserve } from './seatsResolver';

test('resolve available seats in the train', () => {
    const coach1Seats = ["1A", "1B"];
    const coach2Seats = ["2A", "2B", "2C", "2D", "2E"];
    const requestSeatCount = 2;

    const coachDictionary: CoachDict = {
        "1": { totalSeatCount: 10, availableSeats: coach1Seats },
        "2": { totalSeatCount: 5, availableSeats: coach2Seats },
    }

    const seats = tryGetSeatsToReserve(coachDictionary, requestSeatCount);

    expect(seats.length).toBe(requestSeatCount);
});

test('resolve available seats in the train when coach 1 does not have enough seats, but coach 2 has', () => {
    const coach1Seats = ["1A", "1B", "1C", "1D"];
    const coach2Seats = ["2A", "2B", "2C", "2D", "2E", "2F"];
    const requestSeatCount = 5

    const coachDictionary: CoachDict = {
        "1": { totalSeatCount: 5, availableSeats: coach1Seats },
        "2": { totalSeatCount: 10, availableSeats: coach2Seats },
    }

    const seats = tryGetSeatsToReserve(coachDictionary, requestSeatCount);

    expect(seats.length).toBe(requestSeatCount);
    for (const seat of seats) {
        expect(coach2Seats).toContain(seat);
    }
});

test('resolve available seats in the train when coach 1 is more than 70% full, but coach 2 has enough', () => {
    const coach1Seats = ["1A"];
    const coach2Seats = ["2A", "2B", "2C", "2D", "2E", "2F"];
    const requestSeatCount = 1;

    const coachDictionary: CoachDict = {
        "1": { totalSeatCount: 6, availableSeats: coach1Seats },
        "2": { totalSeatCount: 10, availableSeats: coach2Seats },
    }

    const seats = tryGetSeatsToReserve(coachDictionary, requestSeatCount);

    expect(seats.length).toBe(requestSeatCount);
    for (const seat of seats) {
        expect(coach2Seats).toContain(seat);
    }
});



test('resolve throw an error when the capacity of the train exceeds 70%', () => {
    const coach1Seats = ["1A", "1B"];
    const coach2Seats = ["2A", "2B", "2C"];
    const requestSeatCount = 3;
    const expectedError = new Error("The train reservation has passed the 70% threshold");

    const coachDictionary: CoachDict = {
        "1": { totalSeatCount: 4, availableSeats: coach1Seats },
        "2": { totalSeatCount: 6, availableSeats: coach2Seats },
    }

    expect(() => tryGetSeatsToReserve(coachDictionary, requestSeatCount)).toThrow(expectedError);
});

test('resolve find no available seats in the train, when all coaches cannot accomodate the requested number of seats', () => {
    const coach1Seats = ["1A", "1B", "1C", "1D", "1E", "1F", "1G"];
    const coach2Seats = ["2A", "2B", "2C", "2D", "2E", "2F", "2G"];
    const requestSeatCount = 8;
    const expectedSeatCount = 0;


    const coachDictionary: CoachDict = {
        "1": { totalSeatCount: 10, availableSeats: coach1Seats },
        "2": { totalSeatCount: 10, availableSeats: coach2Seats },
    }

    const seats = tryGetSeatsToReserve(coachDictionary, requestSeatCount);

    expect(seats.length).toBe(expectedSeatCount);
})