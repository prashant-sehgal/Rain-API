import { Request } from 'express'
import { UserInterface } from '../userModel'

// request interface with customs properties
export default interface RequestInterface extends Request {
    user: UserInterface
    file: any
}
