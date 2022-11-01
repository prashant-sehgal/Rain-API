"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var APIFeatures = /** @class */ (function () {
    function APIFeatures(query, queryObject) {
        this.query = query;
        this.queryObject = queryObject;
    }
    APIFeatures.prototype.filter = function () {
        // converting request object to string and the adding $ sign in front of gt,gte,lte&lt and than it converted back to object to make it compatible with mongodb query string
        var queryObject = JSON.parse(JSON.stringify(this.queryObject).replace(/\b(gte|gt|lte|lt)\b/g, function (match) { return "$".concat(match); }));
        this.query = this.query.find(queryObject);
        return this;
    };
    APIFeatures.prototype.sort = function () {
        if (this.queryObject.sort) {
            var sortString = String(this.queryObject.sort).replaceAll(',', ' ');
            this.query = this.query.sort(sortString);
        }
        return this;
    };
    APIFeatures.prototype.limitFields = function () {
        if (this.queryObject.fields) {
            var fieldString = this.queryObject.fields.replaceAll(',', ' ');
            this.query = this.query.select(fieldString);
        }
        else {
            this.query = this.query.select('-__v -createdAt');
        }
        return this;
    };
    APIFeatures.prototype.pagination = function () {
        var page = this.queryObject.page * 1 || 1;
        var limit = this.queryObject.limit * 1 || 100;
        var skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    };
    return APIFeatures;
}());
exports.default = APIFeatures;
