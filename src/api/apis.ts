export * from './contactApi';
import { ContactApi } from './contactApi';
export * from './contactApiInterface'
export * from './contactByIdApi';
import { ContactByIdApi } from './contactByIdApi';
export * from './contactByIdApiInterface'
export * from './contactListApi';
import { ContactListApi } from './contactListApi';
export * from './contactListApiInterface'
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models';

export const APIS = [ContactApi, ContactByIdApi, ContactListApi];
