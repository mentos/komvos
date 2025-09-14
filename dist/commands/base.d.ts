declare function _exports(command: any): any;
declare namespace _exports {
    export { CommandArgumentError };
    export { CommandChannelArgumentError };
    export { CommandChannelNotFoundError };
    export { CommandError };
    export { CommandTargetError };
}
export = _exports;
declare class CommandArgumentError extends CommandError {
}
declare class CommandChannelArgumentError extends CommandError {
}
declare class CommandChannelNotFoundError extends CommandError {
}
declare class CommandError extends Error {
}
declare class CommandTargetError extends CommandError {
}
//# sourceMappingURL=base.d.ts.map