type BookingResponse = {
    booking_reference: string
    train_id: string
    seats: string[]
}

type ErrorResponse = {
    code: number,
    message: string
}
type Response = BookingResponse | ErrorResponse

function responseIsError(response: Response): response is ErrorResponse {
    return (response as ErrorResponse).code !== undefined
}
export { Response, BookingResponse, ErrorResponse, responseIsError }

