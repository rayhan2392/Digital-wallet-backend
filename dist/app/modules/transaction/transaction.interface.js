"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["SEND_MONEY"] = "send_money";
    TransactionType["ADD_MONEY"] = "add_money";
    TransactionType["CASH_OUT"] = "cash_out";
    TransactionType["CASH_IN"] = "cash_in";
    TransactionType["REVERSAL"] = "reversal";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["REVERSED"] = "reversed";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
