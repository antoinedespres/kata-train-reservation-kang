/**
 * Coach type
 * @property {number} totalSeatCount - number of seats in coach
 * @property {string[]} availableSeats - array of available seats
 */
type Coach = {
    /**
     * number of seats in coach
     */
    totalSeatCount: number,
    /**
     * array of available seats
     */
    availableSeats: string[]
}

/**
 * Coach dictionary
 * @property {Coach} coachNumber - coach object
 */

type CoachDict = {
    [coachNumber: string]: Coach
}

export { Coach, CoachDict };