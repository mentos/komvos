"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS_KEYS = exports.BAN_REASONS = void 0;
__exportStar(require("./database"), exports);
exports.BAN_REASONS = {
    ABUSER: 'Harassment, threatening behaviour or doxxing',
    ADVERTISING: 'Advertising / invite posting',
    BAN_EVASION: 'Ban Evasion, duplicate account or impersonation',
    CHILD_SAFETY: 'Child Safety',
    GRAPHIC_CONTENT: 'Graphic or illegal content',
    RAIDING: 'Raiding',
    SCAM_ILLEGAL_SERVICES: 'Scam, fraud or illegal services / cheating',
    SPAMMING_TROLLING: 'Spamming / trolling',
    MUTUAL_NETWORK: 'Follow up network ban'
};
exports.SETTINGS_KEYS = {
    ALLOW_INVITES: 'allowInvites',
    ALERTS_CHANNEL_ID: 'alertsChannelId',
    CHANNEL_ID: 'channelId',
    PREFIX: 'prefix',
    ROLE_ID: 'reportedRoleId'
};
//# sourceMappingURL=index.js.map