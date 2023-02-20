"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var client_s3_1 = require("@aws-sdk/client-s3");
var client_sts_1 = require("@aws-sdk/client-sts");
var middleware_retry_1 = require("@aws-sdk/middleware-retry");
/**
 *
 * @param region
 * @param clientType
 * @param sessionCredentials
 * @returns
 */
function setupClient(region, clientType, sessionCredentials) {
    var MAXIMUM_RETRY_DELAY = 30 * 1000;
    var delayDecider = function (delayBase, attempts) {
        return Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.pow(2, attempts) * delayBase));
    };
    if (sessionCredentials) {
        return new clientType({
            region: region,
            credentials: {
                accessKeyId: sessionCredentials.AccessKeyId,
                secretAccessKey: sessionCredentials.SecretAccessKey,
                sessionToken: sessionCredentials.SessionToken
            },
            retryStrategy: new middleware_retry_1.AdaptiveRetryStrategy(function () { return Promise.resolve(10); }, { delayDecider: delayDecider })
        });
    }
    else {
        return new clientType({
            region: region,
            retryStrategy: new middleware_retry_1.AdaptiveRetryStrategy(function () { return Promise.resolve(10); }, { delayDecider: delayDecider })
        });
    }
}
var S3Example = /** @class */ (function () {
    function S3Example(region, sessionCredentials) {
        this.client = setupClient(region, client_s3_1.S3Client, sessionCredentials);
    }
    S3Example.prototype.getAllBucketNames = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bucketNames, buckets, _i, buckets_1, bucket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bucketNames = [];
                        return [4 /*yield*/, this.client.send(new client_s3_1.ListBucketsCommand({}))];
                    case 1:
                        buckets = (_a.sent()).Buckets;
                        if (!buckets) {
                            return [2 /*return*/, []];
                        }
                        for (_i = 0, buckets_1 = buckets; _i < buckets_1.length; _i++) {
                            bucket = buckets_1[_i];
                            bucketNames.push(bucket.Name);
                        }
                        return [2 /*return*/, bucketNames];
                }
            });
        });
    };
    return S3Example;
}());
exports.S3Example = S3Example;
var StsExample = /** @class */ (function () {
    function StsExample(region, sessionCredentials) {
        this.client = setupClient(region, client_sts_1.STSClient, sessionCredentials);
    }
    StsExample.prototype.getSessionCredentials = function (roleName, awsAccount, sessionName) {
        return __awaiter(this, void 0, void 0, function () {
            var assumeRoleCommand, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assumeRoleCommand = new client_sts_1.AssumeRoleCommand({
                            RoleArn: "arn:aws:iam::" + awsAccount + ":role/" + roleName,
                            RoleSessionName: sessionName
                        });
                        return [4 /*yield*/, this.client.send(assumeRoleCommand)];
                    case 1:
                        session = _a.sent();
                        if (session.Credentials) {
                            return [2 /*return*/, session.Credentials];
                        }
                        else {
                            throw new Error('Error getting credentials');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return StsExample;
}());
exports.StsExample = StsExample;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXItZXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllci1leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQWlFO0FBQ2pFLGtEQUF3RztBQUN4Ryw4REFBaUU7QUFZakU7Ozs7OztHQU1HO0FBQ0gsU0FBUyxXQUFXLENBQVEsTUFBYyxFQUFFLFVBQWdELEVBQUUsa0JBQWdDO0lBRTFILElBQU0sbUJBQW1CLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQTtJQUVyQyxJQUFNLFlBQVksR0FBRyxVQUFFLFNBQWlCLEVBQUUsUUFBZ0I7UUFDdEQsT0FBQSxJQUFJLENBQUMsS0FBSyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUUsbUJBQW1CLEVBQUUsU0FBQSxDQUFDLEVBQUksUUFBUSxDQUFBLEdBQUcsU0FBUyxDQUFFLENBQUU7SUFBeEUsQ0FBd0UsQ0FBQTtJQUU1RSxJQUFLLGtCQUFrQixFQUFHO1FBQ3RCLE9BQU8sSUFBSSxVQUFVLENBQUU7WUFDbkIsTUFBTSxFQUFFLE1BQU07WUFDZCxXQUFXLEVBQUU7Z0JBQ1QsV0FBVyxFQUFFLGtCQUFrQixDQUFDLFdBQVk7Z0JBQzVDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxlQUFnQjtnQkFDcEQsWUFBWSxFQUFFLGtCQUFrQixDQUFDLFlBQWE7YUFDakQ7WUFDRCxhQUFhLEVBQUUsSUFBSSx3Q0FBcUIsQ0FBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLE9BQU8sQ0FBRSxFQUFFLENBQUUsRUFBckIsQ0FBcUIsRUFBRSxFQUFFLFlBQVksY0FBQSxFQUFFLENBQUU7U0FDNUYsQ0FBRSxDQUFBO0tBQ047U0FDSTtRQUNELE9BQU8sSUFBSSxVQUFVLENBQUU7WUFDbkIsTUFBTSxFQUFFLE1BQU07WUFDZCxhQUFhLEVBQUUsSUFBSSx3Q0FBcUIsQ0FBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLE9BQU8sQ0FBRSxFQUFFLENBQUUsRUFBckIsQ0FBcUIsRUFBRSxFQUFFLFlBQVksY0FBQSxFQUFFLENBQUU7U0FDNUYsQ0FBRSxDQUFBO0tBQ047QUFDTCxDQUFDO0FBR0Q7SUFHSSxtQkFBYyxNQUFjLEVBQUUsa0JBQWdDO1FBQzFELElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFFLE1BQU0sRUFBRSxvQkFBUSxFQUFFLGtCQUFrQixDQUFFLENBQUE7SUFDckUsQ0FBQztJQUVLLHFDQUFpQixHQUF2Qjs7Ozs7O3dCQUNVLFdBQVcsR0FBYSxFQUFFLENBQUE7d0JBQ2QscUJBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUUsSUFBSSw4QkFBa0IsQ0FBRSxFQUFFLENBQUUsQ0FBRSxFQUFBOzt3QkFBbEUsT0FBTyxHQUFHLENBQUUsU0FBc0QsQ0FBRSxDQUFDLE9BQU87d0JBRWxGLElBQUssQ0FBQyxPQUFPLEVBQUc7NEJBQ1osc0JBQU8sRUFBRSxFQUFBO3lCQUNaO3dCQUVELFdBQTJCLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU8sRUFBRzs0QkFBcEIsTUFBTTs0QkFDWixXQUFXLENBQUMsSUFBSSxDQUFFLE1BQU0sQ0FBQyxJQUFLLENBQUUsQ0FBQTt5QkFDbkM7d0JBRUQsc0JBQU8sV0FBVyxFQUFBOzs7O0tBQ3JCO0lBQ0wsZ0JBQUM7QUFBRCxDQUFDLEFBckJELElBcUJDO0FBckJZLDhCQUFTO0FBd0J0QjtJQUdJLG9CQUFjLE1BQWMsRUFBRSxrQkFBZ0M7UUFDMUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUUsTUFBTSxFQUFFLHNCQUFTLEVBQUUsa0JBQWtCLENBQUUsQ0FBQTtJQUN0RSxDQUFDO0lBRUssMENBQXFCLEdBQTNCLFVBQTZCLFFBQWdCLEVBQUUsVUFBa0IsRUFBRSxXQUFtQjs7Ozs7O3dCQUM1RSxpQkFBaUIsR0FBRyxJQUFJLDhCQUFpQixDQUFFOzRCQUM3QyxPQUFPLEVBQUUsa0JBQWdCLFVBQVUsY0FBUyxRQUFVOzRCQUN0RCxlQUFlLEVBQUUsV0FBVzt5QkFDL0IsQ0FBRSxDQUFBO3dCQUVzQyxxQkFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBRSxpQkFBaUIsQ0FBRSxFQUFBOzt3QkFBOUUsT0FBTyxHQUE0QixTQUEyQzt3QkFFcEYsSUFBSyxPQUFPLENBQUMsV0FBVyxFQUFHOzRCQUN2QixzQkFBTyxPQUFPLENBQUMsV0FBVyxFQUFBO3lCQUM3Qjs2QkFBTTs0QkFDSCxNQUFNLElBQUksS0FBSyxDQUFFLDJCQUEyQixDQUFFLENBQUE7eUJBQ2pEOzs7OztLQUNKO0lBQ0wsaUJBQUM7QUFBRCxDQUFDLEFBckJELElBcUJDO0FBckJZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGlzdEJ1Y2tldHNDb21tYW5kLCBTM0NsaWVudCB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1zMydcbmltcG9ydCB7IEFzc3VtZVJvbGVDb21tYW5kLCBBc3N1bWVSb2xlQ29tbWFuZE91dHB1dCwgQ3JlZGVudGlhbHMsIFNUU0NsaWVudCB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1zdHMnXG5pbXBvcnQgeyBBZGFwdGl2ZVJldHJ5U3RyYXRlZ3kgfSBmcm9tICdAYXdzLXNkay9taWRkbGV3YXJlLXJldHJ5J1xuXG5pbnRlcmZhY2UgQ2xpZW50UGFyYW1zIHtcbiAgICByZWdpb246IHN0cmluZyxcbiAgICBjcmVkZW50aWFscz86IHtcbiAgICAgICAgYWNjZXNzS2V5SWQ6IHN0cmluZyxcbiAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBzdHJpbmcsXG4gICAgICAgIHNlc3Npb25Ub2tlbjogc3RyaW5nXG4gICAgfSxcbiAgICByZXRyeVN0cmF0ZWd5PzogYW55XG59XG5cbi8qKlxuICogXG4gKiBAcGFyYW0gcmVnaW9uIFxuICogQHBhcmFtIGNsaWVudFR5cGUgXG4gKiBAcGFyYW0gc2Vzc2lvbkNyZWRlbnRpYWxzIFxuICogQHJldHVybnMgXG4gKi9cbmZ1bmN0aW9uIHNldHVwQ2xpZW50PFR5cGU+KCByZWdpb246IHN0cmluZywgY2xpZW50VHlwZTogbmV3ICggcGFyYW1zOiBDbGllbnRQYXJhbXMgKSA9PiBUeXBlLCBzZXNzaW9uQ3JlZGVudGlhbHM/OiBDcmVkZW50aWFscyApOiBUeXBlIHtcblxuICAgIGNvbnN0IE1BWElNVU1fUkVUUllfREVMQVkgPSAzMCAqIDEwMDBcblxuICAgIGNvbnN0IGRlbGF5RGVjaWRlciA9ICggZGVsYXlCYXNlOiBudW1iZXIsIGF0dGVtcHRzOiBudW1iZXIgKSA9PlxuICAgICAgICBNYXRoLmZsb29yKCBNYXRoLm1pbiggTUFYSU1VTV9SRVRSWV9ERUxBWSwgMiAqKiBhdHRlbXB0cyAqIGRlbGF5QmFzZSApIClcblxuICAgIGlmICggc2Vzc2lvbkNyZWRlbnRpYWxzICkge1xuICAgICAgICByZXR1cm4gbmV3IGNsaWVudFR5cGUoIHtcbiAgICAgICAgICAgIHJlZ2lvbjogcmVnaW9uLFxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NLZXlJZDogc2Vzc2lvbkNyZWRlbnRpYWxzLkFjY2Vzc0tleUlkISxcbiAgICAgICAgICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IHNlc3Npb25DcmVkZW50aWFscy5TZWNyZXRBY2Nlc3NLZXkhLFxuICAgICAgICAgICAgICAgIHNlc3Npb25Ub2tlbjogc2Vzc2lvbkNyZWRlbnRpYWxzLlNlc3Npb25Ub2tlbiFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXRyeVN0cmF0ZWd5OiBuZXcgQWRhcHRpdmVSZXRyeVN0cmF0ZWd5KCAoKSA9PiBQcm9taXNlLnJlc29sdmUoIDEwICksIHsgZGVsYXlEZWNpZGVyIH0gKVxuICAgICAgICB9IClcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgY2xpZW50VHlwZSgge1xuICAgICAgICAgICAgcmVnaW9uOiByZWdpb24sXG4gICAgICAgICAgICByZXRyeVN0cmF0ZWd5OiBuZXcgQWRhcHRpdmVSZXRyeVN0cmF0ZWd5KCAoKSA9PiBQcm9taXNlLnJlc29sdmUoIDEwICksIHsgZGVsYXlEZWNpZGVyIH0gKVxuICAgICAgICB9IClcbiAgICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFMzRXhhbXBsZSB7XG4gICAgY2xpZW50OiBTM0NsaWVudFxuXG4gICAgY29uc3RydWN0b3IgKCByZWdpb246IHN0cmluZywgc2Vzc2lvbkNyZWRlbnRpYWxzPzogQ3JlZGVudGlhbHMgKSB7XG4gICAgICAgIHRoaXMuY2xpZW50ID0gc2V0dXBDbGllbnQoIHJlZ2lvbiwgUzNDbGllbnQsIHNlc3Npb25DcmVkZW50aWFscyApXG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QWxsQnVja2V0TmFtZXMoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgICAgICBjb25zdCBidWNrZXROYW1lczogc3RyaW5nW10gPSBbXVxuICAgICAgICBjb25zdCBidWNrZXRzID0gKCBhd2FpdCB0aGlzLmNsaWVudC5zZW5kKCBuZXcgTGlzdEJ1Y2tldHNDb21tYW5kKCB7fSApICkgKS5CdWNrZXRzXG5cbiAgICAgICAgaWYgKCAhYnVja2V0cyApIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICggbGV0IGJ1Y2tldCBvZiBidWNrZXRzICkge1xuICAgICAgICAgICAgYnVja2V0TmFtZXMucHVzaCggYnVja2V0Lk5hbWUhIClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBidWNrZXROYW1lc1xuICAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgU3RzRXhhbXBsZSB7XG4gICAgY2xpZW50OiBTVFNDbGllbnRcblxuICAgIGNvbnN0cnVjdG9yICggcmVnaW9uOiBzdHJpbmcsIHNlc3Npb25DcmVkZW50aWFscz86IENyZWRlbnRpYWxzICkge1xuICAgICAgICB0aGlzLmNsaWVudCA9IHNldHVwQ2xpZW50KCByZWdpb24sIFNUU0NsaWVudCwgc2Vzc2lvbkNyZWRlbnRpYWxzIClcbiAgICB9XG5cbiAgICBhc3luYyBnZXRTZXNzaW9uQ3JlZGVudGlhbHMoIHJvbGVOYW1lOiBzdHJpbmcsIGF3c0FjY291bnQ6IHN0cmluZywgc2Vzc2lvbk5hbWU6IHN0cmluZyApOiBQcm9taXNlPENyZWRlbnRpYWxzPiB7XG4gICAgICAgIGNvbnN0IGFzc3VtZVJvbGVDb21tYW5kID0gbmV3IEFzc3VtZVJvbGVDb21tYW5kKCB7XG4gICAgICAgICAgICBSb2xlQXJuOiBgYXJuOmF3czppYW06OiR7YXdzQWNjb3VudH06cm9sZS8ke3JvbGVOYW1lfWAsXG4gICAgICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6IHNlc3Npb25OYW1lXG4gICAgICAgIH0gKVxuXG4gICAgICAgIGNvbnN0IHNlc3Npb246IEFzc3VtZVJvbGVDb21tYW5kT3V0cHV0ID0gYXdhaXQgdGhpcy5jbGllbnQuc2VuZCggYXNzdW1lUm9sZUNvbW1hbmQgKVxuXG4gICAgICAgIGlmICggc2Vzc2lvbi5DcmVkZW50aWFscyApIHtcbiAgICAgICAgICAgIHJldHVybiBzZXNzaW9uLkNyZWRlbnRpYWxzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoICdFcnJvciBnZXR0aW5nIGNyZWRlbnRpYWxzJyApXG4gICAgICAgIH1cbiAgICB9XG59Il19