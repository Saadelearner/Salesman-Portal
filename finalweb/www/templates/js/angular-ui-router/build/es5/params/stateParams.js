var common_1 = require("../common/common");
var StateParams = (function () {
    function StateParams(params) {
        if (params === void 0) { params = {}; }
        common_1.extend(this, params);
    }
    StateParams.prototype.$digest = function () { };
    StateParams.prototype.$inherit = function (newParams, $current, $to) { };
    StateParams.prototype.$set = function (params, url) { };
    StateParams.prototype.$sync = function () { };
    StateParams.prototype.$off = function () { };
    StateParams.prototype.$raw = function () { };
    StateParams.prototype.$localize = function (state, params) { };
    StateParams.prototype.$observe = function (key, fn) { };
    return StateParams;
})();
exports.StateParams = StateParams;
$StateParamsProvider.$inject = [];
function $StateParamsProvider() {
    function stateParamsFactory() {
        var observers = {}, current = {};
        function unhook(key, func) {
            return function () {
                common_1.forEach(key.split(" "), function (k) { return observers[k].splice(observers[k].indexOf(func), 1); });
            };
        }
        function observeChange(key, val) {
            if (!observers[key] || !observers[key].length)
                return;
            common_1.forEach(observers[key], function (func) { return func(val); });
        }
        StateParams.prototype.$digest = function () {
            var _this = this;
            common_1.forEach(this, function (val, key) {
                if (val === current[key] || !_this.hasOwnProperty(key))
                    return;
                current[key] = val;
                observeChange(key, val);
            });
        };
        StateParams.prototype.$inherit = function (newParams, $current, $to) {
            var parents = common_1.ancestors($current, $to), parentParams, inherited = {}, inheritList = [];
            for (var i in parents) {
                if (!parents[i].params)
                    continue;
                parentParams = Object.keys(parents[i].params);
                if (!parentParams.length)
                    continue;
                for (var j in parentParams) {
                    if (inheritList.indexOf(parentParams[j]) >= 0)
                        continue;
                    inheritList.push(parentParams[j]);
                    inherited[parentParams[j]] = this[parentParams[j]];
                }
            }
            return common_1.extend({}, inherited, newParams);
        };
        StateParams.prototype.$set = function (params, url) {
            var _this = this;
            var hasChanged = false, abort = false;
            if (url) {
                common_1.forEach(params, function (val, key) {
                    if ((url.parameter(key) || {}).dynamic !== true)
                        abort = true;
                });
            }
            if (abort)
                return false;
            common_1.forEach(params, function (val, key) {
                if (val !== _this[key]) {
                    _this[key] = val;
                    observeChange(key);
                    hasChanged = true;
                }
            });
            this.$sync();
            return hasChanged;
        };
        StateParams.prototype.$sync = function () {
            common_1.copy(this, current);
            return this;
        };
        StateParams.prototype.$off = function () {
            observers = {};
            return this;
        };
        StateParams.prototype.$raw = function () {
            return common_1.omit(this, Object.keys(this).filter(StateParams.prototype.hasOwnProperty.bind(StateParams.prototype)));
        };
        StateParams.prototype.$localize = function (state, params) {
            return new StateParams(common_1.pick(params || this, Object.keys(state.params)));
        };
        StateParams.prototype.$observe = function (key, fn) {
            common_1.forEach(key.split(" "), function (k) { return (observers[k] || (observers[k] = [])).push(fn); });
            return unhook(key, fn);
        };
        return new StateParams();
    }
    var global = stateParamsFactory();
    this.$get = $get;
    $get.$inject = ['$rootScope'];
    function $get($rootScope) {
        $rootScope.$watch(function () {
            global.$digest();
        });
        return global;
    }
}
angular.module('ui.router.state')
    .provider('$stateParams', $StateParamsProvider);
//# sourceMappingURL=stateParams.js.map