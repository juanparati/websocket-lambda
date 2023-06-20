import { handlerPath } from '@libs/handler-resolver';

export const wsHandler = {
    handler: `${handlerPath(__dirname)}/handler.wsHandler`,
    events: [
        {
            websocket: '$connect',
        },
        {
            websocket: '$disconnect',
        },
        {
            websocket: '$default'
        }
    ],
};


