export = ReactionHandler;
declare class ReactionHandler extends EventEmitter<[never]> {
    constructor(message: any, filter: any, permanent?: boolean, options?: {});
    client: any;
    filter: any;
    message: any;
    options: {};
    permanent: boolean;
    ended: boolean;
    collected: any[];
    listenerAdd: (msg: any, emoji: any, reactor: any) => boolean;
    listenerRemove: (msg: any, emoji: any, userID: any) => boolean;
    checkAddPreConditions(msg: object, emoji: object, reactor: Eris.Member): boolean;
    checkRemovePreConditions(msg: object, emoji: object, reactorId: string): boolean;
    stopListening(reason: string): void;
}
declare namespace ReactionHandler {
    export { collectReactions };
}
import EventEmitter_1 = require("events");
import EventEmitter = EventEmitter_1.EventEmitter;
declare function collectReactions(message: any, filter: any, options: any): Promise<any>;
//# sourceMappingURL=ReactionHandler.d.ts.map