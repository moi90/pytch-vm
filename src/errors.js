/*
 * The filename, line number, and column number of exceptions are
 * stored within the exception object.  Note that not all exceptions
 * clearly report the column number.  To customize the exception
 * message to use any/all of these fields, you can either modify
 * tp$str below to print the desired message, or use them in the
 * skulpt wrapper (i.e., runit) to present the exception message.
 */


/**
 * @constructor
 * @param {String|Array} args
 */
Sk.builtin.BaseException = Sk.abstr.buildNativeClass("BaseException", {
    constructor: function (args) {
        // internally args is either a string
        Sk.asserts.assert(this instanceof Sk.builtin.BaseException);
        if (typeof args === "string") {
            this.args = new Sk.builtin.tuple([new Sk.builtin.str(args)]);
        } else {
            this.args = new Sk.builtin.tuple(args);
        }
        this.traceback = [];
        // For errors occurring during normal execution, the line/col/etc
        // of the error are populated by each stack frame of the runtime code

        // note the python implementation includes a $d dict. we currently don't
    },
    slots: {
        tp$doc: "Common base class for all exceptions",
        tp$new: function (args, kwargs) {
            if (!this.hp$type) {
                // then we have a builtin constructor so just return it as new this
                return new this.constructor(args);
            } else {
                const instance = new this.constructor;
                Sk.builtin.BaseException.call(instance, args);
                return instance;
            }
        },
        tp$init: function (args, kwargs) {
            Sk.abstr.checkNoKwargs(Sk.abstr.typeName(this), kwargs);
            if (this.args.v !== args) {
                // we only initiate the args if they are not identical to the args from tp$new;
                this.args.v = args;
            }
            return Sk.builtin.none.none$;
        },
        $r: function () {
            let ret = "";

            ret += this.tp$name;
            if (this.args) {
                ret += ": " + (this.args.v.length > 0 ? this.args.v[0].v : "");
            }
            if (this.traceback.length !== 0) {
                ret += " on line " + this.traceback[0].lineno;
            } else {
                ret += " at <unknown>";
            }

            if (this.args.v.length > 4) {
                ret += "\n" + this.args.v[4].v + "\n";
                for (let i = 0; i < this.args.v[3]; ++i) {
                    ret += " ";
                }
                ret += "^\n";
            }

            /*for (i = 0; i < this.traceback.length; i++) {
                ret += "\n  at " + this.traceback[i].filename + " line " + this.traceback[i].lineno;
                if ("colno" in this.traceback[i]) {
                    ret += " column " + this.traceback[i].colno;
                }
            }*/

            return new Sk.builtin.str(ret);
        },
        tp$str: function () {
            if (this.args.v.length <= 1) {
                return new Sk.builtin.str(this.args.v[0]);
            }
            return this.args.$r();
        }
    },
    getsets: {
        args: {
            $get: function () { return this.args; }
        }
    },
    proto: {
        toString: function () { return this.$r().v; }
    }
});

Sk.exportSymbol("Sk.builtin.BaseException", Sk.builtin.BaseException);

/**
 * @constructor
 * @extends Sk.builtin.BaseException
 * @param {String|Array} args
 */
Sk.builtin.Exception = function (args) {
    Sk.builtin.BaseException.call(this, args);
};
Sk.abstr.setUpInheritance("Exception", Sk.builtin.Exception, Sk.builtin.BaseException);
Sk.exportSymbol("Sk.builtin.Exception", Sk.builtin.Exception);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {String|Array} args
 */
Sk.builtin.StandardError = function (args) {
    Sk.builtin.Exception.call(this, args);
};
Sk.abstr.setUpInheritance("StandardError", Sk.builtin.StandardError, Sk.builtin.Exception);
// error is not used in py3
Sk.builtin.StandardError.sk$abstract = true;
Sk.exportSymbol("Sk.builtin.StandardError", Sk.builtin.StandardError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.AssertionError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("AssertionError", Sk.builtin.AssertionError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.AssertionError", Sk.builtin.AssertionError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.AttributeError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("AttributeError", Sk.builtin.AttributeError, Sk.builtin.StandardError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.ImportError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("ImportError", Sk.builtin.ImportError, Sk.builtin.StandardError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.IndentationError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("IndentationError", Sk.builtin.IndentationError, Sk.builtin.StandardError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.IndexError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("IndexError", Sk.builtin.IndexError, Sk.builtin.StandardError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.KeyError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("KeyError", Sk.builtin.KeyError, Sk.builtin.StandardError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.NameError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("NameError", Sk.builtin.NameError, Sk.builtin.StandardError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.UnboundLocalError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("UnboundLocalError", Sk.builtin.UnboundLocalError, Sk.builtin.StandardError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.OverflowError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("OverflowError", Sk.builtin.OverflowError, Sk.builtin.StandardError);


/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.SyntaxError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("SyntaxError", Sk.builtin.SyntaxError, Sk.builtin.StandardError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.RuntimeError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("RuntimeError", Sk.builtin.RuntimeError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.RuntimeError", Sk.builtin.RuntimeError);


/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.SuspensionError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("SuspensionError", Sk.builtin.SuspensionError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.SuspensionError", Sk.builtin.SuspensionError);


/**
 * @constructor
 * @extends Sk.builtin.BaseException
 * @param {String|Array} args
 */
Sk.builtin.SystemExit = function (args) {
    Sk.builtin.BaseException.call(this, args);
};
Sk.abstr.setUpInheritance("SystemExit", Sk.builtin.SystemExit, Sk.builtin.BaseException);
Sk.exportSymbol("Sk.builtin.SystemExit", Sk.builtin.SystemExit);


/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.TypeError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("TypeError", Sk.builtin.TypeError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.TypeError", Sk.builtin.TypeError);
/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.ValueError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("ValueError", Sk.builtin.ValueError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.ValueError", Sk.builtin.ValueError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.ZeroDivisionError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("ZeroDivisionError", Sk.builtin.ZeroDivisionError, Sk.builtin.StandardError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.TimeLimitError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("TimeLimitError", Sk.builtin.TimeLimitError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.TimeLimitError", Sk.builtin.TimeLimitError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.IOError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("IOError", Sk.builtin.IOError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.IOError", Sk.builtin.IOError);


/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.NotImplementedError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("NotImplementedError", Sk.builtin.NotImplementedError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.NotImplementedError", Sk.builtin.NotImplementedError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.NegativePowerError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("NegativePowerError", Sk.builtin.NegativePowerError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.NegativePowerError", Sk.builtin.NegativePowerError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {*} nativeError
 * @param {String|Array} args
 */
Sk.builtin.ExternalError = function (args) {


    this.nativeError = args;
    const msg = args.toString();
    Sk.builtin.StandardError.call(this, msg);
};
Sk.abstr.setUpInheritance("ExternalError", Sk.builtin.ExternalError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.ExternalError", Sk.builtin.ExternalError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.OperationError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("OperationError", Sk.builtin.OperationError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.OperationError", Sk.builtin.OperationError);

/**
 * @constructor
 * @extends Sk.builtin.StandardError
 * @param {String|Array} args
 */
Sk.builtin.SystemError = function (args) {
    Sk.builtin.StandardError.call(this, args);
};
Sk.abstr.setUpInheritance("SystemError", Sk.builtin.SystemError, Sk.builtin.StandardError);
Sk.exportSymbol("Sk.builtin.SystemError", Sk.builtin.SystemError);

/**
 * @constructor
 * @extends Sk.builtin.Exception
 * @param {String|Array} args
 */
Sk.builtin.StopIteration = function (args) {
    Sk.builtin.Exception.call(this, args);
};
Sk.abstr.setUpInheritance("StopIteration", Sk.builtin.StopIteration, Sk.builtin.Exception);
Sk.exportSymbol("Sk.builtin.StopIteration", Sk.builtin.StopIteration);


// TODO: Extract into sys.exc_info(). Work out how the heck
// to find out what exceptions are being processed by parent stack frames...
Sk.builtin.getExcInfo = function (e) {
    var v = [e.ob$type || Sk.builtin.none.none$, e, Sk.builtin.none.none$];

    // TODO create a Traceback object for the third tuple element

    return new Sk.builtin.tuple(v);
};
// NOT exported

