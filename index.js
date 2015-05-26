/**
 * express-format-response
 * author: Vinicius Teixeira (@vinicius0026)
 * repo: https://github.com/fiddus/express-format-response.git
 * license: MIT
 */

'use strict';

/**
 * formatResponse
 * This function receives a formatting object (format) that is used
 * to format the responses. Then it returns a middleware to be used
 * as the last middleware step before sending, since it doesn't call
 * the next callback.
 * @param format Object with the desired format to the response.
 * The entries that will be substituted by others should be entered
 * as strings starting with `<%=` and ending with `=>`. Only one parameter
 * is allowed per field, unless in nested objects. See example below:
 *
 *    var format = {
 *        response: {
 *            info: '<%= res.info %>',
 *            version: '<%= res.apiVersion %>',
 *            code: '<%= res.successStatus %>',
 *            method: '<%= req.method %>',
 *            href: '<%= req.href %>'
 *        },
 *        data: '<%= res.data %>',
 *        pagination: '<%= res.pagination %>'
 *    };
 *
 * @returns {Function} Middleware that sends the response, so must be
 * the last to be called.
 */
var formatResponse = function (format) {

    var createFormattedResponse = function (format, context) {

        /**
         * @private
         * method transform
         * Wrapper over the recursive transformation functions
         * @param obj
         * @param fn
         * @param context
         * @returns {*}
         */
        var transform = function (obj, fn, context) {

            /**
             * @private
             * Method objectTransform
             * Acts recursively together with `recursiveTransform` to copy objects,
             * while transforming the object`s strings
             * @param obj Object that will have it's strings transformed
             * @returns deep copy of given object, with strings transformed
             */
            var objectTransform = function (obj) {
                var returnObj = {};
                Object.keys(obj).forEach(function (key) {
                    returnObj[key] = recursiveTransform(obj[key], fn, context);
                });
                return returnObj;
            };

            /**
             * @private
             * Recursively acts over an object, applying the provided function
             * on `string` objects. Returns a copy of the object, with strings
             * transformed.
             * @param elem
             * @param fn Function that will be applied over `string` objects
             * @param context Context object that will serve as parameter to the
             * callback function
             * @returns {*}
             */
            var recursiveTransform = function (elem, fn, context) {
                if (typeof elem === 'object' && elem !== null) {
                    return objectTransform(elem);
                }

                if (typeof elem === 'string') {
                    return fn(elem, context);
                }

                return elem;
            };

            return recursiveTransform(obj);
        };

        /**
         * @private
         * Method getNestedProperty
         * Gets a property from a context object, even if it is nested.
         * Example:
         * Given the context object
         * var context = {
         *     a: {
         *         b: 'value'
         *     }
         * };
         *
         * on can call this function as getNestedProperty(context, 'a.b')
         * and it will return 'value'.
         *
         * @param context object from which the nested property will be extracted
         * @param str string representing the nested property. Nested objects
         * are separated by a period `.`
         * @returns value of the nested property
         */
        var getNestedProperty = function (context, str) {
            var value = context,
                key = str.split(' ')[1].split('.');

            while (key.length) {
                value = value[key.shift()];
            }

            return value;
        };

        return transform(format, function (elem, context) {
            if (elem.indexOf && elem.indexOf('<%=') === 0) {
                return getNestedProperty(context, elem);
            }
            return elem;
        }, context);
    };

    return function (req, res) {
        res.json(createFormattedResponse(format, {req: req, res: res}));
    };
};

module.exports = formatResponse;