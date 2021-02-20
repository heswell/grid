

export function createWorker(tableUrl){

  const blobArray = [workerCode.toString().slice(23, -1)];
  const blob = new Blob(blobArray, { type: 'text/javascript' });
  const url = URL.createObjectURL(blob) + `#?${tableUrl}`; 
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  return worker;
}
function workerCode(){

const MAX_LISTENERS = 10;

class EventEmitter {

    constructor() {
        this._events = {};
        this._maxListeners = MAX_LISTENERS;
    }

    addListener(type, listener) {
        let m;

        if (!isFunction(listener)) {
            throw TypeError('listener must be a function');
        }

        if (!this._events) {
            this._events = {};
        }

        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (this._events.newListener) {
            this.emit('newListener', type, listener);
        }

        if (!this._events[type]) {
            // Optimize the case of one listener. Don't need the extra array object.
            this._events[type] = listener;
        } else if (Array.isArray(this._events[type])) {
            // If we've already got an array, just append.
            this._events[type].push(listener);
        } else {
            // Adding the second element, need to change to array.
            this._events[type] = [this._events[type], listener];
        }

        // Check for listener leak
        if (Array.isArray(this._events[type]) && !this._events[type].warned) {
            if (!isUndefined(this._maxListeners)) {
                m = this._maxListeners;
            } else {
                m = MAX_LISTENERS;
            }

            if (m && m > 0 && this._events[type].length > m) {
                this._events[type].warned = true;
                console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                this._events[type].length);
            }
        }

        return this;

    }

    removeListener(type, listener) {
        let list, position, length, i;

        if (!isFunction(listener)) {
            throw TypeError('listener must be a function');
        }

        if (!this._events || !this._events[type]) {
            return this;
        }

        list = this._events[type];
        length = list.length;
        position = -1;

        if (list === listener ||
            (isFunction(list.listener) && list.listener === listener)) {
            delete this._events[type];
            if (this._events.removeListener) {
                this.emit('removeListener', type, listener);
            }

        } else if (Array.isArray(list)) {
            for (i = length; i-- > 0;) {
                if (list[i] === listener ||
                    (list[i].listener && list[i].listener === listener)) {
                    position = i;
                    break;
                }
            }

            if (position < 0) {
                return this;
            }

            if (list.length === 1) {
                list.length = 0;
                delete this._events[type];
            } else {
                list.splice(position, 1);
            }

            if (this._events.removeListener) {
                this.emit('removeListener', type, listener);
            }
        }

        return this;

    }

    removeAllListeners(type) {

        if (!this._events) {
            return this;
        }

        const listeners = this._events[type];

        if (isFunction(listeners)) {
            this.removeListener(type, listeners);
        } else if (listeners) {
            // LIFO order
            while (listeners.length) {
                this.removeListener(type, listeners[listeners.length - 1]);
            }
        }
        delete this._events[type];

        return this;

    }

    emit(type, ...args) {

        if (!this._events) {
            this._events = {};
        }

        // If there is no 'error' event listener then throw.
        if (type === 'error') {
            if (!this._events.error ||
                (isObject(this._events.error) && !this._events.error.length)) {
                const err = arguments[1];
                if (err instanceof Error) {
                    throw err; // Unhandled 'error' event
                } else {
                    // At least give some kind of context to the user
                    throw new Error('Uncaught, unspecified "error" event. (' + err + ')');
                }
            }
        }

        const handler = this._events[type];

        if (isUndefined(handler)) {
            return false;
        }

        if (isFunction(handler)) {
            switch (args.length) {
                // fast cases
                case 0:
                    handler.call(this);
                    break;
                case 1:
                    handler.call(this, type, args[0]);
                    break;
                case 2:
                    handler.call(this, type, args[0], args[1]);
                    break;
                // slower
                default:
                    handler.call(this, type, ...args);
            }
        } else if (Array.isArray(handler)) {
            handler.slice().forEach(listener => listener.call(this, type, ...args));
        }

        return true;

    }

    once(type, listener) {

        const handler = (evtName, message) => {
            this.removeListener(evtName, handler);
            listener(evtName, message);
        };

        this.on(type, handler);

    }

    on(type, listener) {
        return this.addListener(type, listener);
    }

}

function isFunction(arg) {
    return typeof arg === 'function';
}

function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
    return arg === void 0;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var uuid = createCommonjsModule(function (module) {
/*!
**  Pure-UUID -- Pure JavaScript Based Universally Unique Identifier (UUID)
**  Copyright (c) 2004-2020 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  Universal Module Definition (UMD)  */
(function (root, name, factory) {
    /* global define: false */
    {
        /*  CommonJS environment  */
        module.exports = factory(root);
        module.exports.default = module.exports;
    }
}(commonjsGlobal, "UUID", function (/* root */) {
    /*  array to hex-string conversion  */
    var a2hs = function (bytes, begin, end, uppercase, str, pos) {
        var mkNum = function (num, uppercase) {
            var base16 = num.toString(16);
            if (base16.length < 2)
                base16 = "0" + base16;
            if (uppercase)
                base16 = base16.toUpperCase();
            return base16;
        };
        for (var i = begin; i <= end; i++)
            str[pos++] = mkNum(bytes[i], uppercase);
        return str;
    };

    /*  hex-string to array conversion  */
    var hs2a = function (str, begin, end, bytes, pos) {
        for (var i = begin; i <= end; i += 2)
            bytes[pos++] = parseInt(str.substr(i, 2), 16);
    };

    /*  This library provides Z85: ZeroMQ's Base-85 encoding/decoding
        (see http://rfc.zeromq.org/spec:32 for details)  */

    var z85_encoder = (
        "0123456789" +
         "abcdefghijklmnopqrstuvwxyz" +
         "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
         ".-:+=^!/*?&<>()[]{}@%$#"
    ).split("");
    var z85_decoder = [
        0x00, 0x44, 0x00, 0x54, 0x53, 0x52, 0x48, 0x00,
        0x4B, 0x4C, 0x46, 0x41, 0x00, 0x3F, 0x3E, 0x45,
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x40, 0x00, 0x49, 0x42, 0x4A, 0x47,
        0x51, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A,
        0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 0x30, 0x31, 0x32,
        0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
        0x3B, 0x3C, 0x3D, 0x4D, 0x00, 0x4E, 0x43, 0x00,
        0x00, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
        0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20,
        0x21, 0x22, 0x23, 0x4F, 0x00, 0x50, 0x00, 0x00
    ];
    var z85_encode = function (data, size) {
        if ((size % 4) !== 0)
            throw new Error("z85_encode: invalid input length (multiple of 4 expected)");
        var str = "";
        var i = 0;
        var value = 0;
        while (i < size) {
            value = (value * 256) + data[i++];
            if ((i % 4) === 0) {
                var divisor = 85 * 85 * 85 * 85;
                while (divisor >= 1) {
                    var idx = Math.floor(value / divisor) % 85;
                    str += z85_encoder[idx];
                    divisor /= 85;
                }
                value = 0;
            }
        }
        return str;
    };
    var z85_decode = function (str, dest) {
        var l = str.length;
        if ((l % 5) !== 0)
            throw new Error("z85_decode: invalid input length (multiple of 5 expected)");
        if (typeof dest === "undefined")
            dest = new Array(l * 4 / 5);
        var i = 0;
        var j = 0;
        var value = 0;
        while (i < l) {
            var idx = str.charCodeAt(i++) - 32;
            if (idx < 0 || idx >= z85_decoder.length)
                break;
            value = (value * 85) + z85_decoder[idx];
            if ((i % 5) === 0) {
                var divisor = 256 * 256 * 256;
                while (divisor >= 1) {
                    dest[j++] = Math.trunc((value / divisor) % 256);
                    divisor /= 256;
                }
                value = 0;
            }
        }
        return dest;
    };

    /*  This library provides conversions between 8/16/32-bit character
        strings and 8/16/32-bit big/little-endian word arrays.  */

    /*  string to array conversion  */
    var s2a = function (s, _options) {
        /*  determine options  */
        var options = { ibits: 8, obits: 8, obigendian: true };
        for (var opt in _options)
            if (typeof options[opt] !== "undefined")
                options[opt] = _options[opt];

        /*  convert string to array  */
        var a = [];
        var i = 0;
        var c, C;
        var ck = 0;
        var w;
        var wk = 0;
        var sl = s.length;
        for (;;) {
            /*  fetch next octet from string  */
            if (ck === 0)
                C = s.charCodeAt(i++);
            c = (C >> (options.ibits - (ck + 8))) & 0xFF;
            ck = (ck + 8) % options.ibits;

            /*  place next word into array  */
            if (options.obigendian) {
                if (wk === 0) w  = (c <<  (options.obits - 8));
                else          w |= (c << ((options.obits - 8) - wk));
            }
            else {
                if (wk === 0) w  = c;
                else          w |= (c << wk);
            }
            wk = (wk + 8) % options.obits;
            if (wk === 0) {
                a.push(w);
                if (i >= sl)
                    break;
            }
        }
        return a;
    };

    /*  array to string conversion  */
    var a2s = function (a, _options) {
        /*  determine options  */
        var options = { ibits: 32, ibigendian: true };
        for (var opt in _options)
            if (typeof options[opt] !== "undefined")
                options[opt] = _options[opt];

        /* convert array to string */
        var s = "";
        var imask = 0xFFFFFFFF;
        if (options.ibits < 32)
            imask = (1 << options.ibits) - 1;
        var al = a.length;
        for (var i = 0; i < al; i++) {
            /* fetch next word from array */
            var w = a[i] & imask;

            /* place next octet into string */
            for (var j = 0; j < options.ibits; j += 8) {
                if (options.ibigendian)
                    s += String.fromCharCode((w >> ((options.ibits - 8) - j)) & 0xFF);
                else
                    s += String.fromCharCode((w >> j) & 0xFF);
            }
        }
        return s;
    };

    /*  this is just a really minimal UI64 functionality,
        just sufficient enough for the UUID v1 generator and PCG PRNG!  */

    /*  UI64 constants  */
    var UI64_DIGITS     = 8;    /* number of digits */
    var UI64_DIGIT_BITS = 8;    /* number of bits in a digit */
    var UI64_DIGIT_BASE = 256;  /* the numerical base of a digit */

    /*  convert between individual digits and the UI64 representation  */
    var ui64_d2i = function (d7, d6, d5, d4, d3, d2, d1, d0) {
        return [ d0, d1, d2, d3, d4, d5, d6, d7 ];
    };

    /*  the zero represented as an UI64  */
    var ui64_zero = function () {
        return ui64_d2i(0, 0, 0, 0, 0, 0, 0, 0);
    };

    /*  clone the UI64  */
    var ui64_clone = function (x) {
        return x.slice(0);
    };

    /*  convert between number and UI64 representation  */
    var ui64_n2i = function (n) {
        var ui64 = ui64_zero();
        for (var i = 0; i < UI64_DIGITS; i++) {
            ui64[i] = Math.floor(n % UI64_DIGIT_BASE);
            n /= UI64_DIGIT_BASE;
        }
        return ui64;
    };

    /*  convert between UI64 representation and number  */
    var ui64_i2n = function (x) {
        var n = 0;
        for (var i = UI64_DIGITS - 1; i >= 0; i--) {
            n *= UI64_DIGIT_BASE;
            n += x[i];
        }
        return Math.floor(n);
    };

    /*  add UI64 (y) to UI64 (x) and return overflow/carry as number  */
    var ui64_add = function (x, y) {
        var carry = 0;
        for (var i = 0; i < UI64_DIGITS; i++) {
            carry += x[i] + y[i];
            x[i]   = Math.floor(carry % UI64_DIGIT_BASE);
            carry  = Math.floor(carry / UI64_DIGIT_BASE);
        }
        return carry;
    };

    /*  multiply number (n) to UI64 (x) and return overflow/carry as number  */
    var ui64_muln = function (x, n) {
        var carry = 0;
        for (var i = 0; i < UI64_DIGITS; i++) {
            carry += x[i] * n;
            x[i]   = Math.floor(carry % UI64_DIGIT_BASE);
            carry  = Math.floor(carry / UI64_DIGIT_BASE);
        }
        return carry;
    };

    /*  multiply UI64 (y) to UI64 (x) and return overflow/carry as UI64  */
    var ui64_mul = function (x, y) {
        var i, j;

        /*  clear temporary result buffer zx  */
        var zx = new Array(UI64_DIGITS + UI64_DIGITS);
        for (i = 0; i < (UI64_DIGITS + UI64_DIGITS); i++)
            zx[i] = 0;

        /*  perform multiplication operation  */
        var carry;
        for (i = 0; i < UI64_DIGITS; i++) {
            /*  calculate partial product and immediately add to zx  */
            carry = 0;
            for (j = 0; j < UI64_DIGITS; j++) {
                carry += (x[i] * y[j]) + zx[i + j];
                zx[i + j] = (carry % UI64_DIGIT_BASE);
                carry /= UI64_DIGIT_BASE;
            }

            /*  add carry to remaining digits in zx  */
            for ( ; j < UI64_DIGITS + UI64_DIGITS - i; j++) {
                carry += zx[i + j];
                zx[i + j] = (carry % UI64_DIGIT_BASE);
                carry /= UI64_DIGIT_BASE;
            }
        }

        /*  provide result by splitting zx into x and ov  */
        for (i = 0; i < UI64_DIGITS; i++)
            x[i] = zx[i];
        return zx.slice(UI64_DIGITS, UI64_DIGITS);
    };

    /*  AND operation: UI64 (x) &= UI64 (y)  */
    var ui64_and = function (x, y) {
        for (var i = 0; i < UI64_DIGITS; i++)
            x[i] &= y[i];
        return x;
    };

    /*  OR operation: UI64 (x) |= UI64 (y)  */
    var ui64_or = function (x, y) {
        for (var i = 0; i < UI64_DIGITS; i++)
            x[i] |= y[i];
        return x;
    };

    /*  rotate right UI64 (x) by a "s" bits and return overflow/carry as number  */
    var ui64_rorn = function (x, s) {
        var ov = ui64_zero();
        if ((s % UI64_DIGIT_BITS) !== 0)
            throw new Error("ui64_rorn: only bit rotations supported with a multiple of digit bits");
        var k = Math.floor(s / UI64_DIGIT_BITS);
        for (var i = 0; i < k; i++) {
            for (var j = UI64_DIGITS - 1 - 1; j >= 0; j--)
                ov[j + 1] = ov[j];
            ov[0] = x[0];
            for (j = 0; j < UI64_DIGITS - 1; j++)
                x[j] = x[j + 1];
            x[j] = 0;
        }
        return ui64_i2n(ov);
    };

    /*  rotate right UI64 (x) by a "s" bits and return overflow/carry as number  */
    var ui64_ror = function (x, s) {
        /*  sanity check shifting  */
        if (s > (UI64_DIGITS * UI64_DIGIT_BITS))
            throw new Error("ui64_ror: invalid number of bits to shift");

        /*  prepare temporary buffer zx  */
        var zx = new Array(UI64_DIGITS + UI64_DIGITS);
        var i;
        for (i = 0; i < UI64_DIGITS; i++) {
            zx[i + UI64_DIGITS] = x[i];
            zx[i] = 0;
        }

        /*  shift bits inside zx  */
        var k1 = Math.floor(s / UI64_DIGIT_BITS);
        var k2 = s % UI64_DIGIT_BITS;
        for (i = k1; i < UI64_DIGITS + UI64_DIGITS - 1; i++) {
            zx[i - k1] =
                ((zx[i] >>> k2) |
                 (zx[i + 1] << (UI64_DIGIT_BITS - k2))) &
                ((1 << UI64_DIGIT_BITS) - 1);
        }
        zx[UI64_DIGITS + UI64_DIGITS - 1 - k1] =
            (zx[UI64_DIGITS + UI64_DIGITS - 1] >>> k2) &
            ((1 << UI64_DIGIT_BITS) - 1);
        for (i = UI64_DIGITS + UI64_DIGITS - 1 - k1 + 1; i < UI64_DIGITS + UI64_DIGITS; i++)
            zx[i] = 0;

        /*  provide result by splitting zx into x and ov  */
        for (i = 0; i < UI64_DIGITS; i++)
            x[i] = zx[i + UI64_DIGITS];
        return zx.slice(0, UI64_DIGITS);
    };

    /*  rotate left UI64 (x) by a "s" bits and return overflow/carry as UI64  */
    var ui64_rol = function (x, s) {
        /*  sanity check shifting  */
        if (s > (UI64_DIGITS * UI64_DIGIT_BITS))
            throw new Error("ui64_rol: invalid number of bits to shift");

        /*  prepare temporary buffer zx  */
        var zx = new Array(UI64_DIGITS + UI64_DIGITS);
        var i;
        for (i = 0; i < UI64_DIGITS; i++) {
            zx[i + UI64_DIGITS] = 0;
            zx[i] = x[i];
        }

        /*  shift bits inside zx  */
        var k1 = Math.floor(s / UI64_DIGIT_BITS);
        var k2 = s % UI64_DIGIT_BITS;
        for (i = UI64_DIGITS - 1 - k1; i > 0; i--) {
            zx[i + k1] =
                ((zx[i] << k2) |
                 (zx[i - 1] >>> (UI64_DIGIT_BITS - k2))) &
                ((1 << UI64_DIGIT_BITS) - 1);
        }
        zx[0 + k1] = (zx[0] << k2) & ((1 << UI64_DIGIT_BITS) - 1);
        for (i = 0 + k1 - 1; i >= 0; i--)
            zx[i] = 0;

        /*  provide result by splitting zx into x and ov  */
        for (i = 0; i < UI64_DIGITS; i++)
            x[i] = zx[i];
        return zx.slice(UI64_DIGITS, UI64_DIGITS);
    };

    /*  XOR UI64 (y) onto UI64 (x) and return x  */
    var ui64_xor = function (x, y) {
        for (var i = 0; i < UI64_DIGITS; i++)
            x[i] ^= y[i];
    };

    /*  this is just a really minimal UI32 functionality,
        just sufficient enough for the MD5 and SHA1 digests!  */

    /*  safely add two integers (with wrapping at 2^32)  */
    var ui32_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };

    /*  bitwise rotate 32-bit number to the left  */
    var ui32_rol = function (num, cnt) {
        return (
            ((num <<        cnt ) & 0xFFFFFFFF) |
            ((num >>> (32 - cnt)) & 0xFFFFFFFF)
        );
    };

    /*  calculate the SHA-1 of an array of big-endian words, and a bit length  */
    var sha1_core = function (x, len) {
        /*  perform the appropriate triplet combination function for the current iteration  */
        function sha1_ft (t, b, c, d) {
            if (t < 20) return (b & c) | ((~b) & d);
            if (t < 40) return b ^ c ^ d;
            if (t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        }

        /*  determine the appropriate additive constant for the current iteration  */
        function sha1_kt (t) {
            /* eslint indent: off */
            return (
                (t < 20) ?  1518500249 :
                (t < 40) ?  1859775393 :
                (t < 60) ? -1894007588 :
                            -899497514
            );
        }

        /*  append padding  */
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;

        var w = Array(80);
        var a =  1732584193;
        var b =  -271733879;
        var c = -1732584194;
        var d =   271733878;
        var e = -1009589776;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;
            for (var j = 0; j < 80; j++) {
                if (j < 16)
                    w[j] = x[i + j];
                else
                    w[j] = ui32_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
                var t = ui32_add(
                    ui32_add(ui32_rol(a, 5), sha1_ft(j, b, c, d)),
                    ui32_add(ui32_add(e, w[j]), sha1_kt(j))
                );
                e = d;
                d = c;
                c = ui32_rol(b, 30);
                b = a;
                a = t;
            }
            a = ui32_add(a, olda);
            b = ui32_add(b, oldb);
            c = ui32_add(c, oldc);
            d = ui32_add(d, oldd);
            e = ui32_add(e, olde);
        }
        return [ a, b, c, d, e ];
    };

    /*  calculate the SHA-1 of an octet string  */
    var sha1 = function (s) {
        return a2s(
            sha1_core(
                s2a(s, { ibits: 8, obits: 32, obigendian: true }),
                s.length * 8),
            { ibits: 32, ibigendian: true });
    };

    /*  calculate the MD5 of an array of little-endian words, and a bit length  */
    var md5_core = function (x, len) {
        /*  basic operations the algorithm uses  */
        function md5_cmn (q, a, b, x, s, t) {
            return ui32_add(ui32_rol(ui32_add(ui32_add(a, q), ui32_add(x, t)), s), b);
        }
        function md5_ff (a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        function md5_gg (a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        function md5_hh (a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function md5_ii (a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        /*  append padding  */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a =  1732584193;
        var b =  -271733879;
        var c = -1732584194;
        var d =   271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i+ 0],  7,  -680876936);
            d = md5_ff(d, a, b, c, x[i+ 1], 12,  -389564586);
            c = md5_ff(c, d, a, b, x[i+ 2], 17,   606105819);
            b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i+ 4],  7,  -176418897);
            d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i+ 7], 22,   -45705983);
            a = md5_ff(a, b, c, d, x[i+ 8],  7,  1770035416);
            d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i+10], 17,      -42063);
            b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i+12],  7,  1804603682);
            d = md5_ff(d, a, b, c, x[i+13], 12,   -40341101);
            c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i+ 1],  5,  -165796510);
            d = md5_gg(d, a, b, c, x[i+ 6],  9, -1069501632);
            c = md5_gg(c, d, a, b, x[i+11], 14,   643717713);
            b = md5_gg(b, c, d, a, x[i+ 0], 20,  -373897302);
            a = md5_gg(a, b, c, d, x[i+ 5],  5,  -701558691);
            d = md5_gg(d, a, b, c, x[i+10],  9,    38016083);
            c = md5_gg(c, d, a, b, x[i+15], 14,  -660478335);
            b = md5_gg(b, c, d, a, x[i+ 4], 20,  -405537848);
            a = md5_gg(a, b, c, d, x[i+ 9],  5,   568446438);
            d = md5_gg(d, a, b, c, x[i+14],  9, -1019803690);
            c = md5_gg(c, d, a, b, x[i+ 3], 14,  -187363961);
            b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i+13],  5, -1444681467);
            d = md5_gg(d, a, b, c, x[i+ 2],  9,   -51403784);
            c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i+ 5],  4,     -378558);
            d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i+14], 23,   -35309556);
            a = md5_hh(a, b, c, d, x[i+ 1],  4, -1530992060);
            d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i+ 7], 16,  -155497632);
            b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i+13],  4,   681279174);
            d = md5_hh(d, a, b, c, x[i+ 0], 11,  -358537222);
            c = md5_hh(c, d, a, b, x[i+ 3], 16,  -722521979);
            b = md5_hh(b, c, d, a, x[i+ 6], 23,    76029189);
            a = md5_hh(a, b, c, d, x[i+ 9],  4,  -640364487);
            d = md5_hh(d, a, b, c, x[i+12], 11,  -421815835);
            c = md5_hh(c, d, a, b, x[i+15], 16,   530742520);
            b = md5_hh(b, c, d, a, x[i+ 2], 23,  -995338651);

            a = md5_ii(a, b, c, d, x[i+ 0],  6,  -198630844);
            d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i+ 5], 21,   -57434055);
            a = md5_ii(a, b, c, d, x[i+12],  6,  1700485571);
            d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i+10], 15,    -1051523);
            b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i+ 8],  6,  1873313359);
            d = md5_ii(d, a, b, c, x[i+15], 10,   -30611744);
            c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i+ 4],  6,  -145523070);
            d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i+ 2], 15,   718787259);
            b = md5_ii(b, c, d, a, x[i+ 9], 21,  -343485551);

            a = ui32_add(a, olda);
            b = ui32_add(b, oldb);
            c = ui32_add(c, oldc);
            d = ui32_add(d, oldd);
        }
        return [ a, b, c, d ];
    };

    /*  calculate the MD5 of an octet string  */
    var md5 = function (s) {
        return a2s(
            md5_core(
                s2a(s, { ibits: 8, obits: 32, obigendian: false }),
                s.length * 8),
            { ibits: 32, ibigendian: false });
    };

    /*  PCG Pseudo-Random-Number-Generator (PRNG)
        http://www.pcg-random.org/pdf/hmc-cs-2014-0905.pdf
        This is the PCG-XSH-RR variant ("xorshift high (bits), random rotation"),
        based on 32-bit output, 64-bit internal state and the formulas:
        state = state * MUL + INC
        output = rotate32((state ^ (state >> 18)) >> 27, state >> 59)  */

    var PCG = function (seed) {
        /*  pre-load some "magic" constants  */
        this.mul   = ui64_d2i(0x58, 0x51, 0xf4, 0x2d, 0x4c, 0x95, 0x7f, 0x2d);
        this.inc   = ui64_d2i(0x14, 0x05, 0x7b, 0x7e, 0xf7, 0x67, 0x81, 0x4f);
        this.mask  = ui64_d2i(0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff);

        /*  generate an initial internal state  */
        this.state = ui64_clone(this.inc);
        this.next();
        ui64_and(this.state, this.mask);
        seed = ui64_n2i(seed !== undefined ?
            (seed >>> 0) : ((Math.random() * 0xffffffff) >>> 0));
        ui64_or(this.state, seed);
        this.next();
    };
    PCG.prototype.next = function () {
        /*  save current state  */
        var state = ui64_clone(this.state);

        /*  advance internal state  */
        ui64_mul(this.state, this.mul);
        ui64_add(this.state, this.inc);

        /*  calculate: (state ^ (state >> 18)) >> 27  */
        var output = ui64_clone(state);
        ui64_ror(output, 18);
        ui64_xor(output, state);
        ui64_ror(output, 27);

        /*  calculate: state >> 59  */
        var rot = ui64_clone(state);
        ui64_ror(rot, 59);

        /*  calculate: rotate32(xorshifted, rot)  */
        ui64_and(output, this.mask);
        var k = ui64_i2n(rot);
        var output2 = ui64_clone(output);
        ui64_rol(output2, 32 - k);
        ui64_ror(output, k);
        ui64_xor(output, output2);

        /*  return pseudo-random number  */
        return ui64_i2n(output);
    };
    var pcg = new PCG();

    /*  utility function: simple Pseudo Random Number Generator (PRNG)  */
    var prng = function (len, radix) {
        var bytes = [];
        for (var i = 0; i < len; i++)
            bytes[i] = (pcg.next() % radix);
        return bytes;
    };

    /*  internal state  */
    var time_last = 0;
    var time_seq  = 0;

    /*  the API constructor  */
    var UUID = function () {
        if (arguments.length === 1 && typeof arguments[0] === "string")
            this.parse.apply(this, arguments);
        else if (arguments.length >= 1 && typeof arguments[0] === "number")
            this.make.apply(this, arguments);
        else if (arguments.length >= 1)
            throw new Error("UUID: constructor: invalid arguments");
        else
            for (var i = 0; i < 16; i++)
                this[i] = 0x00;
    };

    /*  inherit from a standard class which provides the
        best UUID representation in the particular environment  */
    /* global Uint8Array: false */
    if (typeof Uint8Array !== "undefined")
        /*  HTML5 TypedArray (browser environments: IE10, FF, CH, SF, OP)
            (http://caniuse.com/#feat=typedarrays)  */
        UUID.prototype = new Uint8Array(16);
    else if (Buffer)
        /*  Node Buffer (server environments: Node.js, IO.js)  */
        UUID.prototype = Buffer.alloc(16);
    else
        /*  JavaScript (any environment)  */
        UUID.prototype = new Array(16);
    UUID.prototype.constructor = UUID;

    /*  API method: generate a particular UUID  */
    UUID.prototype.make = function (version) {
        var i;
        var uuid = this;
        if (version === 1) {
            /*  generate UUID version 1 (time and node based)  */

            /*  determine current time and time sequence counter  */
            var date = new Date();
            var time_now = date.getTime();
            if (time_now !== time_last)
                time_seq = 0;
            else
                time_seq++;
            time_last = time_now;

            /*  convert time to 100*nsec  */
            var t = ui64_n2i(time_now);
            ui64_muln(t, 1000 * 10);

            /*  adjust for offset between UUID and Unix Epoch time  */
            ui64_add(t, ui64_d2i(0x01, 0xB2, 0x1D, 0xD2, 0x13, 0x81, 0x40, 0x00));

            /*  compensate for low resolution system clock by adding
                the time/tick sequence counter  */
            if (time_seq > 0)
                ui64_add(t, ui64_n2i(time_seq));

            /*  store the 60 LSB of the time in the UUID  */
            var ov;
            ov = ui64_rorn(t, 8); uuid[3] = (ov & 0xFF);
            ov = ui64_rorn(t, 8); uuid[2] = (ov & 0xFF);
            ov = ui64_rorn(t, 8); uuid[1] = (ov & 0xFF);
            ov = ui64_rorn(t, 8); uuid[0] = (ov & 0xFF);
            ov = ui64_rorn(t, 8); uuid[5] = (ov & 0xFF);
            ov = ui64_rorn(t, 8); uuid[4] = (ov & 0xFF);
            ov = ui64_rorn(t, 8); uuid[7] = (ov & 0xFF);
            ov = ui64_rorn(t, 8); uuid[6] = (ov & 0x0F);

            /*  generate a random clock sequence  */
            var clock = prng(2, 255);
            uuid[8] = clock[0];
            uuid[9] = clock[1];

            /*  generate a random local multicast node address  */
            var node = prng(6, 255);
            node[0] |= 0x01;
            node[0] |= 0x02;
            for (i = 0; i < 6; i++)
                uuid[10 + i] = node[i];
        }
        else if (version === 4) {
            /*  generate UUID version 4 (random data based)  */
            var data = prng(16, 255);
            for (i = 0; i < 16; i++)
                 this[i] = data[i];
        }
        else if (version === 3 || version === 5) {
            /*  generate UUID version 3/5 (MD5/SHA-1 based)  */
            var input = "";
            var nsUUID = (
                typeof arguments[1] === "object" && arguments[1] instanceof UUID ?
                arguments[1] : new UUID().parse(arguments[1])
            );
            for (i = 0; i < 16; i++)
                 input += String.fromCharCode(nsUUID[i]);
            input += arguments[2];
            var s = version === 3 ? md5(input) : sha1(input);
            for (i = 0; i < 16; i++)
                 uuid[i] = s.charCodeAt(i);
        }
        else
            throw new Error("UUID: make: invalid version");

        /*  brand with particular UUID version  */
        uuid[6] &= 0x0F;
        uuid[6] |= (version << 4);

        /*  brand as UUID variant 2 (DCE 1.1)  */
        uuid[8] &= 0x3F;
        uuid[8] |= (0x02 << 6);

        return uuid;
    };

    /*  API method: format UUID into usual textual representation  */
    UUID.prototype.format = function (type) {
        var str, arr;
        if (type === "z85")
            str = z85_encode(this, 16);
        else if (type === "b16") {
            arr = Array(32);
            a2hs(this, 0, 15, true, arr, 0);
            str = arr.join("");
        }
        else if (type === undefined || type === "std") {
            arr = new Array(36);
            a2hs(this,  0,  3, false, arr,  0); arr[ 8] = "-";
            a2hs(this,  4,  5, false, arr,  9); arr[13] = "-";
            a2hs(this,  6,  7, false, arr, 14); arr[18] = "-";
            a2hs(this,  8,  9, false, arr, 19); arr[23] = "-";
            a2hs(this, 10, 15, false, arr, 24);
            str = arr.join("");
        }
        return str;
    };

    /*  API method: format UUID into usual textual representation  */
    UUID.prototype.toString = function (type) {
        return this.format(type);
    };

    /*  API method: overrides JSON serialization with usual text representation  */
    UUID.prototype.toJSON = function () {
        return this.format("std");
    };

    /*  API method: parse UUID from usual textual representation  */
    UUID.prototype.parse = function (str, type) {
        if (typeof str !== "string")
            throw new Error("UUID: parse: invalid argument (type string expected)");
        if (type === "z85")
            z85_decode(str, this);
        else if (type === "b16")
            hs2a(str, 0, 35, this, 0);
        else if (type === undefined || type === "std") {
            var map = {
                "nil":     "00000000-0000-0000-0000-000000000000",
                "ns:DNS":  "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
                "ns:URL":  "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
                "ns:OID":  "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
                "ns:X500": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
            };
            if (map[str] !== undefined)
                str = map[str];
            else if (!str.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/))
                throw new Error("UUID: parse: invalid string representation " +
                    "(expected \"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\")");
            hs2a(str,  0,  7, this,  0);
            hs2a(str,  9, 12, this,  4);
            hs2a(str, 14, 17, this,  6);
            hs2a(str, 19, 22, this,  8);
            hs2a(str, 24, 35, this, 10);
        }
        return this;
    };

    /*  API method: export UUID into standard array of numbers  */
    UUID.prototype.export = function () {
        var arr = Array(16);
        for (var i = 0; i < 16; i++)
            arr[i] = this[i];
        return arr;
    };

    /*  API method: import UUID from standard array of numbers  */
    UUID.prototype.import = function (arr) {
        if (!(typeof arr === "object" && arr instanceof Array))
            throw new Error("UUID: import: invalid argument (type Array expected)");
        if (arr.length !== 16)
            throw new Error("UUID: import: invalid argument (Array of length 16 expected)");
        for (var i = 0; i < 16; i++) {
            if (typeof arr[i] !== "number")
                throw new Error("UUID: import: invalid array element #" + i +
                    " (type Number expected)");
            if (!(isFinite(arr[i]) && Math.floor(arr[i]) === arr[i]))
                throw new Error("UUID: import: invalid array element #" + i +
                    " (Number with integer value expected)");
            if (!(arr[i] >= 0 && arr[i] <= 255))
                throw new Error("UUID: import: invalid array element #" + i +
                    " (Number with integer value in range 0...255 expected)");
            this[i] = arr[i];
        }
        return this;
    };

    /*  API method: compare UUID against another one  */
    UUID.prototype.compare = function (other) {
        if (typeof other !== "object")
            throw new Error("UUID: compare: invalid argument (type UUID expected)");
        if (!(other instanceof UUID))
            throw new Error("UUID: compare: invalid argument (type UUID expected)");
        for (var i = 0; i < 16; i++) {
            if (this[i] < other[i])
                return -1;
            else if (this[i] > other[i])
                return +1;
        }
        return 0;
    };

    /*  API method: check whether UUID is equal another one  */
    UUID.prototype.equal = function (other) {
        return this.compare(other) === 0;
    };

    /*  API method: hash UUID by XOR-folding it k times  */
    UUID.prototype.fold = function (k) {
        if (typeof k === "undefined")
            throw new Error("UUID: fold: invalid argument (number of fold operations expected)");
        if (k < 1 || k > 4)
            throw new Error("UUID: fold: invalid argument (1-4 fold operations expected)");
        var n = 16 / Math.pow(2, k);
        var hash = new Array(n);
        for (var i = 0; i < n; i++) {
            var h = 0;
            for (var j = 0; i + j < 16; j += n)
                h ^= this[i + j];
            hash[i] = h;
        }
        return hash;
    };

    UUID.PCG = PCG;

    /*  export API  */
    return UUID;
}));
});

function arrayOfIndices(length){
  // not the neatest, but far and away the fastest way to do this ...
  const result = Array(length);
  for (let i=0;i<length;i++){
      result[i] = i;
  }
  return result;
}

const DataTypes = {
  ROW_DATA: 'rowData',
  FILTER_DATA: 'filterData',
  FILTER_BINS: 'filterBins'
};

const ASC = 'asc';
const DSC = 'dsc';

const AND = 'AND';
const EQUALS = 'EQ';
const GREATER_THAN = 'GT';
const GREATER_EQ = 'GE';
const IN = 'IN';
const LESS_EQ = 'LE';
const LESS_THAN = 'LT';
const NOT_IN = 'NOT_IN';
const NOT_STARTS_WITH = 'NOT_SW';
const OR = 'OR';
const STARTS_WITH = 'SW';

const SET_FILTER_DATA_COLUMNS = [
    {name: 'name'},
    {name: 'count', width: 40, type: 'number'}, 
    {name: 'totalCount', width: 40, type: 'number'}
];

const BIN_FILTER_DATA_COLUMNS = [
    {name: 'bin'}, 
    {name: 'count'}, 
    {name: 'bin-lo'},
    {name: 'bin-hi'}
];

function addFilter(existingFilter, filter) {

    if (includesNoValues(filter)){
        const {colName} = filter;
        existingFilter = removeFilterForColumn(existingFilter, {name:colName});
    } else if (includesAllValues(filter)){
        // A filter that returns all values is a way to remove filtering for this column 
        return removeFilterForColumn(existingFilter, {name: filter.colName});
    }

    if (!existingFilter) {
        return filter;
    } else if (!filter) {
        return existingFilter;
    }
   
    if (existingFilter.type === AND && filter.type === AND) {
        return { type: 'AND', filters: combine(existingFilter.filters, filter.filters) };
    } else if (existingFilter.type === 'AND') {
        const filters = replaceOrInsert(existingFilter.filters, filter);
        return filters.length > 1
            ? { type: 'AND', filters  }
            : filters[0];
    } else if (filter.type === 'AND') {
        return { type: 'AND', filters: filter.filters.concat(existingFilter) };
    } else if (filterEquals(existingFilter, filter, true)) {
        return filter;
    } else if (sameColumn(existingFilter, filter)){
        return merge(existingFilter, filter);
    } else {
        return { type: 'AND', filters: [existingFilter, filter] };
    }
}

function includesNoValues(filter) {
    // TODO make sure we catch all cases...
    if (!filter){
        return false;
    } else if (filter.type === IN && filter.values.length === 0) {
        return true;
    } else if (filter.type === AND && filter.filters.some(f => includesNoValues(f))){
        return true;
    } else {
        return false;
    }
}
function functor(columnMap, filter) {
    //TODO convert filter to include colIdx ratherthan colName, so we don't have to pass cols
    switch (filter.type) {
    case IN: return testInclude(columnMap, filter);
    case NOT_IN: return testExclude(columnMap, filter);
    case EQUALS: return testEQ(columnMap, filter);
    case GREATER_THAN: return testGT(columnMap, filter);
    case GREATER_EQ: return testGE(columnMap, filter);
    case LESS_THAN: return testLT(columnMap, filter);
    case LESS_EQ: return testLE(columnMap, filter);
    case STARTS_WITH: return testSW(columnMap, filter);
    case NOT_STARTS_WITH: return testSW(columnMap, filter, true);
    case AND: return testAND(columnMap, filter);
    case OR: return testOR(columnMap, filter);
    default:
        console.log(`unrecognized filter type ${filter.type}`);
        return () => true;
    }
}

function testAND(cols, f) {
    const filters = f.filters.map(f1 => functor(cols, f1));
    return row => filters.every(fn => fn(row));
}

function testOR(cols, f) {
    const filters = f.filters.map(f1 => functor(cols, f1));
    return row => filters.some(fn => fn(row));
}

function testSW(cols, f, inversed = false) {
    const value = f.value.toLowerCase();
    return inversed
        ? row => row[cols[f.colName]].toLowerCase().indexOf(value) !== 0
        : row => row[cols[f.colName]].toLowerCase().indexOf(value) === 0;
   
}

function testGT(cols, f) {
    return row => row[cols[f.colName]] > f.value;
}

function testGE(cols, f) {
    return row => row[cols[f.colName]] >= f.value;
}

function testLT(cols, f) {
    return row => row[cols[f.colName]] < f.value;
}

function testLE(cols, f) {
    return row => row[cols[f.colName]] <= f.value;
}

function testInclude(cols, f) {
    // eslint-disable-next-line eqeqeq 
    return row => f.values.findIndex(val => val == row[cols[f.colName]]) !== -1;
}

// faster to convert values to a keyed map
function testExclude(cols, f) {
    // eslint-disable-next-line eqeqeq 
    return row => f.values.findIndex(val => val == row[cols[f.colName]]) === -1;
}

function testEQ(cols, f) {
    return row => row[cols[f.colName]] === f.value;
}

function includesAllValues(filter) {
    if (!filter){
        return false;
    } else if (filter.type === NOT_IN && filter.values.length === 0) {
        return true;
    } else if (filter.type === STARTS_WITH && filter.value === ''){
        return true;
    } else {
        return false;
    }
}

// does f2 only narrow the resultset from f1
function extendsFilter(f1=null, f2=null) {
    // ignore filters which are identical
    // include or exclude filters which add values
    if (f2 === null){
        return false
    } else if (f1 === null) {
        return true;
    }
    if (f1.colName && f1.colName === f2.colName) {
        if (f1.type === f2.type) {
            switch (f1.type) {
            case IN:
                return f2.values.length < f1.values.length && containsAll(f1.values, f2.values);
            case NOT_IN: 
                return f2.values.length > f1.values.length && containsAll(f2.values, f1.values);
            case STARTS_WITH: return f2.value.length > f1.value.length && f2.value.indexOf(f1.value) === 0;
            }
        }

    } else if (f1.colname && f2.colName) {
        // different columns,always false
        return false;
    } else if (f2.type === AND && extendsFilters(f1, f2)) {
        return true;
    }

    // safe option is to assume false, causing filter to be re-applied to base data
    return false;
}

const byColName = (a, b) => a.colName === b.colName ? 0 : a.colName < b.colName ? -1 : 1;

function extendsFilters(f1, f2) {
    if (f1.colName) {
        const matchingFilter = f2.filters.find(f => f.colName === f1.colName);
        return filterEquals(matchingFilter, f1, true);
    } else if (f1.filters.length === f2.filters.length) {
        // if the only differences are extra values in an excludes filter or fewer values in an includes filter
        // then we are still extending the filter (i.e. narrowing the resultset)
        const a = f1.filters.sort(byColName);
        const b = f2.filters.slice().sort(byColName);

        for (let i = 0; i < a.length; i++) {
            if (!filterEquals(a[i], b[i], true) && !filterExtends(a[i], b[i])) {
                return false;
            }
        }
        return true;
    } else if (f2.filters.length > f1.filters.length){
        return f1.filters.every(filter1 => {
            const filter2 = f2.filters.find(f => f.colName === filter1.colName);
            return filterEquals(filter1, filter2, true); // could also allow f2 extends f1
        });
    }
}

// If we add an IN filter and there is an existing NOT_IN, we would always expect the IN
// values to exist in the NOT_IN set (as long as user interaction is driving the filtering)
function replaceOrInsert(filters, filter) {
    const {type, colName, values} = filter;
    if (type === IN || type === NOT_IN) {
        const otherType = type === IN ? NOT_IN : IN; 
        // see if we have an 'other' entry
        let idx = filters.findIndex(f => f.type === otherType && f.colName === colName);
        if (idx !== -1){
            const {values: existingValues} = filters[idx];
            if (values.every(value => existingValues.indexOf(value) !== -1)){
                if (values.length === existingValues.length){
                    // we simply remove the existing 'other' filter ...
                    return filters.filter((f, i) => i !== idx);
                } else {
                    // ... or strip the matching values from the 'other' filter values
                    let newValues = existingValues.filter(value => !values.includes(value));
                    return filters.map((filter,i) => i === idx ? {...filter, values: newValues}: filter)

                }
            }
            else if (values.some(value => existingValues.indexOf(value) !== -1)){
                console.log(`partial overlap between IN and NOT_IN`);

            }
        } else {
            idx = filters.findIndex(f => f.type === type && f.colName === filter.colName);
            if (idx !== -1) {
                return filters.map((f, i) => i === idx ? merge(f, filter) : f);
            }    
        }
    }

    return filters.concat(filter);
}

function merge(f1, f2){
    const {type: t1} = f1;
    const {type: t2} = f2;      
    const sameType = t1 === t2 ? t1 : '';

    if (includesNoValues(f2)){
        return f2;
    } else if ((t1 === IN && t2 === NOT_IN) || (t1 === NOT_IN && t2 === IN)){
        // do the two sets cancel each other out ?
        if (f1.values.length === f2.values.length && f1.values.every(v => f2.values.includes(v))){  
            if (t1 === IN && t2 === NOT_IN){
                return {
                    colName: f1.colName,
                    type: IN,
                    values: []
                }
            } else {
                return null;
            }
        } else if (f1.values.length > f2.values.length){
            if (f2.values.every(v => f1.values.includes(v))){
                return {
                    ...f1,
                    values: f1.values.filter(v => !f2.values.includes(v))
                }
            }
        }
        
    } else if (sameType === IN || sameType === NOT_IN){
        return {
            ...f1,
            values: f1.values.concat(f2.values.filter(v => !f1.values.includes(v)))
        }
    } else if (sameType === STARTS_WITH){
        return {
            type: OR,
            filters: [f1, f2]
        }
    } else if (sameType === NOT_STARTS_WITH){
        return {
            type: AND,
            filters: [f1, f2]
        }

    }

    return f2;

}

function combine(existingFilters, replacementFilters) {

    // TODO need a safer REGEX here
    function equivalentType({ type: t1 }, { type: t2 }) {
        return (t1 === t2) || (t1[0] === t2[0]);
    }

    const replaces = (existingFilter, replacementFilter) => {
        return existingFilter.colName === replacementFilter.colName &&
            equivalentType(existingFilter, replacementFilter);
    };

    const stillApplicable = existingFilter => replacementFilters.some(
        replacementFilter => replaces(existingFilter, replacementFilter)) === false;

    return existingFilters.filter(stillApplicable).concat(replacementFilters);
}

function splitFilterOnColumn(filter, columnName) {
    if (!filter){
        return [null,null];
    } else if (filter.colName === columnName) {
        return [filter,null];
    } else if (filter.type !== 'AND') {
        return [null, filter];
    } else {
        const [[columnFilter=null], filters] = partition(filter.filters, f => f.colName === columnName);
        return filters.length === 1
            ? [columnFilter,filters[0]]
            : [columnFilter, { type: 'AND', filters }];
    }
}

const overrideColName = (filter, colName) => {
    const {type} = filter;
    if (type === AND || type === OR){
        return {
            type,
            filters: filter.filters.map(f => overrideColName(f, colName))
        }
    } else {
        return {...filter, colName}
    }
};

function extractFilterForColumn(filter, columnName) {
    if (!filter) {
        return null;
    }
    const { type, colName } = filter;
    switch (type) {
        case AND: 
        case OR: 
            return collectFiltersForColumn(type, filter.filters, columnName);

        default:
            return colName === columnName ? filter : null;
    }
}

function collectFiltersForColumn(type, filters, columName){
    const results = [];
    filters.forEach(filter => {
        const ffc = extractFilterForColumn(filter, columName);
        if (ffc !== null){
            results.push(ffc);
        }
    });
    if (results.length === 1){
        return results[0];
    } else {
        return {
            type,
            filters: results
        }
    }
}

function removeFilterForColumn(sourceFilter, column) {
    const colName = column.name;
    if (!sourceFilter){
        return null;
    } else if (sourceFilter.colName === colName) {
        return null;
    } else if (sourceFilter.type === AND || sourceFilter.type === OR) {
        const {type, filters} = sourceFilter;
        const otherColFilters = filters.filter(f => f.colName !== colName);
        switch(otherColFilters.length){
            case 0: return null;
            case 1: return otherColFilters[0];
            default: return { type, otherColFilters } 
        }
    } else {
        return sourceFilter;
    }
}

const sameColumn = (f1, f2) => f1.colName === f2.colName;

function filterEquals(f1, f2, strict = false) {
    if (f1 && f1){
        const isSameColumn = sameColumn(f1,f2);
        if (!strict) {
            return isSameColumn;
        } else {
            return isSameColumn &&
                f1.type === f2.type && 
                f1.mode === f2.mode &&
                f1.value === f2.value &&
                sameValues(f1.values, f2.values);
        }
    } else {
        return false;
    }
}

// does f2 extend f1 ?
function filterExtends(f1, f2) {
    if (f1.type === IN && f2.type === IN) {
        return f2.values.length < f1.values.length && containsAll(f1.values, f2.values);
    } else if (f1.type === NOT_IN && f2.type === NOT_IN) {
        return f2.values.length > f1.values.length && containsAll(f2.values, f1.values);
    } else {
        return false;
    }
}

// The folowing are array utilities but they are defined here as they are not suitable for large arrays, so we'll
// keep them local to filters
function containsAll(superList, subList) {
    for (let i = 0, len = subList.length; i < len; i++) {
        if (superList.indexOf(subList[i]) === -1) {
            return false;
        }
    }
    return true;
}

// only suitable for small arrays of simple types (e.g. filter values)
function sameValues(arr1, arr2) {
    if (arr1 === arr2) {
        return true;
    } else if (arr1.length === arr2.length) {
        const a = arr1.slice().sort();
        const b = arr2.slice().sort();
        return a.join('|') === b.join('|');
    }
    return false;
}

function partition(list, test1, test2=null) {
    const results1 = [];
    const misses = [];
    const results2 = test2===null ? null : [];

    for (let i = 0; i < list.length; i++) {
        if (test1(list[i])) {
            results1.push(list[i]);
        } else if (test2 !== null && test2(list[i])) {
            results2.push(list[i]);
        } else {
            misses.push(list[i]);
        }
    }

    return test2 === null
        ? [results1, misses]
        : [results1, results2, misses];
}

const SORT_ASC = 'asc';

function mapSortCriteria(sortCriteria, columnMap, metadataOffset=0) {
  return sortCriteria.map(s => {
      if (typeof s === 'string') {
          return [columnMap[s] + metadataOffset, 'asc'];
      } else if (Array.isArray(s)) {
          const [columnName, sortDir] = s;
          return [columnMap[columnName] + metadataOffset, sortDir || SORT_ASC];
      } else {
          throw Error('columnUtils.mapSortCriteria invalid input');
      }

  });
}

const toColumn = column =>
  typeof column === 'string'
      ? { name: column }
      : column;

function buildColumnMap(columns){
  const start = metadataKeys.count;  
  if (columns){
      return columns.reduce((map, column, i) => {
          if (typeof column === 'string'){
              map[column] = start + i;
          } else if (typeof column.key === 'number') {
              map[column.name] = column.key;
          } else {
              map[column.name] = start + i;
          }
          return map;
      },{})
  } else {
      return null;
  }
}

function projectUpdates(updates){
    const results = [];
    const metadataOffset = metadataKeys.count - 2;
    for (let i=0;i<updates.length; i+=3){
        results[i] = updates[i] + metadataOffset;
        results[i+1] = updates[i+1];
        results[i + 2] = updates[i+2];
    }
    return results;
}

function projectColumns(map, columns){
  const length = columns.length;
  const {IDX, RENDER_IDX, DEPTH, COUNT, KEY, SELECTED, count} = metadataKeys;
  return (startIdx, offset, selectedRows=[]) => (row,i) => {
      // selectedRows are indices of rows within underlying dataset (not sorted or filtered)
      // row is the original row from this set, with original index in IDX pos, which might
      // be overwritten with a different value below if rows are sorted/filtered 
      const baseRowIdx = row[IDX];
      const out = [];
      for (let i=0; i < length;i++){
          const colIdx = map[columns[i].name];
          out[count+i] = row[colIdx];
      }

      out[IDX] = startIdx + i + offset;
      out[RENDER_IDX] = 0;
      out[DEPTH] = 0;
      out[COUNT] = 0;
      // assume row[0] is key for now
      out[KEY] = row[map.KEY]; /// How do we identify, can it be done in table ?
      out[SELECTED] = selectedRows.includes(baseRowIdx) ? 1 : 0;
      return out;
  }
}

function getFilterType(column){
  return column.filter || getDataType(column);
}

// {name: 'Price', 'type': {name: 'price'}, 'aggregate': 'avg'},
// {name: 'MarketCap', 'type': {name: 'number','format': 'currency'}, 'aggregate': 'sum'},

function getDataType({type=null}){
  if (type === null){
      return 'set';
  } else if (typeof type === 'string'){
      return type;
  } else {
      switch(type.name){
          case 'price':
              return 'number';
          default:
              return type.name;
      }
  }

}

const metadataKeys = {
    IDX: 0,
    RENDER_IDX: 1,
    DEPTH: 2,
    COUNT: 3,
    KEY: 4,
    SELECTED: 5,
    PARENT_IDX: 6,
    IDX_POINTER: 7,
    FILTER_COUNT: 8,
    NEXT_FILTER_IDX: 9,
    count: 10
};

function getFullRange({lo,hi,bufferSize=0}){
  return {
      lo: Math.max(0, lo - bufferSize),
      hi: hi + bufferSize
  };
}

function indexOfCol(key, cols = null) {
  if (cols !== null) {
      for (let i = 0; i < cols.length; i++) {
          // check both while we transition from groupBy to extendedGroupby
          // groupBy = [colName, dir] extendedGroupby = [colIdx, dir,colName]
          const [col1, , col2] = cols[i];
          if (col1 === key || col2 === key) {
              return i;
          }
      }
  }
  return -1;
}

function addRowsToIndex(rows, index, indexField){
  for (let idx = 0, len=rows.length; idx < len; idx++) {
      index[rows[idx][indexField]] = idx;
  }
  return index;
}

/*global fetch */

const defaultUpdateConfig = {
    applyUpdates: false,
    applyInserts: false,
    interval: 500
};

function buildColumnMap$1(columns){
    if (columns){
        const map = {IDX: 0, KEY: 1};
        for (let i=0;i<columns.length;i++){
            map[columns[i].name] = i+2;
        }
        return map;
    } else {
        return null;
    }
  }
  
class Table extends EventEmitter {

    constructor(config){
        super();
        const {name, columns=null, primaryKey, dataPath, data, updates = {}} = config;
        this.name = name;
        this.primaryKey = primaryKey;
        this.columns = columns;
        this.keys = {};
        this.index = {};
        this.indices = [];
        this.rows = [];
        this.updateConfig = {
            ...defaultUpdateConfig,
            ...updates
        };
        this.inputColumnMap = undefined;
        this.columnMap = buildColumnMap$1(columns);
        this.columnCount = 0;
        this.status = null;

        if (data){
            this.load(data);
        } else if (dataPath){
            this.fetchData(dataPath);
        }

        this.installDataGenerators(config);
    }

    update(rowIdx, ...updates){
        const results = [];
        let row = this.rows[rowIdx];
        for (let i=0;i<updates.length;i+=2){
            const colIdx = updates[i];
            const value = updates[i+1];
            results.push(colIdx, row[colIdx], value);
            row[colIdx] = value;
        }
        this.emit('rowUpdated', rowIdx, results);
    }

    bulkUpdate(updates, doNotPublish){
        const results = [];
        for (let rowUpdate of updates){
            const [idx] = rowUpdate;
            const row = this.rows[idx];
            const rowResult = [idx];
            for (let i=1;i<rowUpdate.length;i+=2){
                const colIdx = rowUpdate[i];
                const value = rowUpdate[i+1];
                rowResult.push(colIdx, row[colIdx], value);
                row[colIdx] = value;
            }
            results.push(rowResult);
        }
        this.emit('rowsUpdated', results, doNotPublish);
    }

    // Don't think this is worth the overhead
    // bulkUpdate(updates){
        // const map = new Map();
    // const results = [];
    // let rowResult;
    // for (let rowUpdate of updates){
    //     const [idx] = rowUpdate;
    //     const row = this.rows[idx];

    //     if (map.has(idx)){
    //         rowResult = map.get(idx);
    //     } else {
    //         results.push(rowResult = [idx]);
    //         map.set(idx, rowResult)
    //     }

    //     for (let i=1;i<rowUpdate.length;i+=2){
    //         const colIdx = rowUpdate[i];
    //         const value = rowUpdate[i+1];
    //         const pos = rowResult.indexOf(colIdx);
    //         if (pos === -1 || (pos-1)%3){ // don't mistake a value for a column Index
    //             rowResult.push(colIdx, row[colIdx], value);
    //         } else {
    //             // updates are in sequence so later update for same column replaces earlier value
    //             rowResult.splice(pos+1, 2, row[colIdx], value);
    //         }
    //         row[colIdx] = value;
    //     }
    // }
    // console.log(results)
    // this.emit('rowsUpdated', results);
    // }

    insert(data){
        let columnnameList = this.columns ? this.columns.map(c => c.name): null;
        const idx = this.rows.length;
        let row = this.rowFromData(idx, data, columnnameList);
        this.rows.push(row);
        this.emit('rowInserted', idx, row);
    }

    remove(key){
        if (this.keys[key]){
            const index = this.indices[key];
            delete this.keys[key];
            delete this.indices[key];
            this.rows.splice(index,1);

            for (let k in this.indices){
                if (this.indices[k] > index){
                    this.indices[k] -= 1;
                }
            }

            this.emit('rowRemoved', this.name, key);

        }
    }

    clear(){

    }

    toString(){
        const out = ['\n' + this.name];
        out.splice.apply(out, [1,0].concat(this.rows.map(function(row){return row.toString();})));
        return out.join('\n');
    }

    async fetchData(url){
        fetch(url,{

        })
            .then(data => data.json())
            .then(json => {
                console.log(`Table.loadData: got ${json.length} rows`);
                this.load(json);
            })
            .catch(err => {
                console.error(err);
            });

    }

    load(data){
        let columnnameList = this.columns ? this.columns.map(c => c.name): null;
        const rows = [];
        for (let i=0;i<data.length;i++){
            let row = this.rowFromData(i, data[i], columnnameList);
            rows.push(row);
        }
        this.rows = rows;

        if (this.columns === null){
            this.columns = columnsFromColumnMap(this.inputColumnMap);
            this.columnMap = buildColumnMap$1(this.columns);
        }
        this.status = 'ready';
        this.emit('ready');
        if (this.updateConfig && this.updateConfig.applyUpdates !== false){
            setTimeout(() => {
                this.applyUpdates();
            },1000);
        }
        // move this
        if (this.updateConfig && this.updateConfig.applyInserts !== false){
            setTimeout(() => {
                this.applyInserts();
            },10000);
        }
    }

    // Build a row [idx, primaryKey, ...data values]
    rowFromData(idx, data, columnnameList){
        // 2 metadata items for each row, the idx and unique key
        const {index, primaryKey=null, columnMap: map} = this;

        if (Array.isArray(data)){
            const key = data[map[this.primaryKey] - 2];
            index[key] = idx;
            return [idx, key, ...data];
        } else {
            // This allows us to load data from objects as rows, without predefined columns, where
            // not every row may have every column. How would we handle primary key ?
            const columnMap = map || (this.columnMap = {IDX:0, KEY:1});
            const colnames = columnnameList || Object.getOwnPropertyNames(data);
            // why start with idx in 0 ?
            const row = [idx];
            let colIdx;

            for (let i=0; i<colnames.length; i++){
                const name = colnames[i];
                const value = data[name];
                if ((colIdx = columnMap[name]) === undefined){
                    colIdx = columnMap[name] = 2 + this.columnCount++;
                }
                row[colIdx] = value;
                // If we don't know the primary key, assume it is the first column for now
                if ((name === primaryKey) || (primaryKey === null && i === 0)){
                    index[value] = idx;
                    row[map.KEY] = value;
                }
            }
            return row;
        }
    }

    //TODO move all these methods into an external helper
    applyInserts(){

        const idx = this.rows.length;
        const newRow = this.createRow(idx);
        if (newRow){
            this.insert(newRow);
        } else {
            console.log(`createRow did not return a new row`);
        }

        setTimeout(() => this.applyInserts(),this.updateConfig.insertInterval | 100);

    }

    applyUpdates(){
        const {rows, columnMap} = this;
        // const count = Math.round(rows.length / 50);
        const count = 100;

        for (let i=0; i<count; i++){
            const rowIdx = getRandomInt(rows.length - 1);
            const update = this.updateRow(rowIdx, rows[rowIdx], columnMap);
            if (update){
                this.update(rowIdx, ...update);
            }
        }

        setTimeout(() => this.applyUpdates(),this.updateConfig.interval);

    }

    createRow(idx){
        console.warn(`createRow ${idx} must be implemented as a plugin`);
        return null;
    }

    updateRow(idx, row, columnMap){
        return null;
    }

    async installDataGenerators(config){
        //console.warn(`installDataGenerators must be implemented by a more specific subclass`);
    }

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function columnsFromColumnMap(columnMap){

    const columnNames = Object.getOwnPropertyNames(columnMap);

    return columnNames
        .map(name => ({name, key: columnMap[name]}))
        .sort(byKey)
        .map(({name}) => ({name}));

}

function byKey(col1, col2){
    return col1.key - col2.key;
}

const NULL_RANGE = {lo: 0,hi: 0};

// If the requested range overlaps the last sent range, we only need send the
// newly exposed section of the range. The client will manage dropping off
// the expired section.
//
// |----------------------------------| _range
//  ++++++|----------------------------------| prevRange
//  
//
//
//  |------------------------------------| _range
//  |----------------------------------|+  prevRange

/** @type {import('./range-utils').getDeltaRange} */
function getDeltaRange(oldRange, newRange){
    //TODO do we still need these calls to getFullRange ?
    const {lo: oldLo, hi: oldHi} = oldRange /*getFullRange(oldRange)*/;
    const {lo: newLo, hi: newHi} = newRange /*getFullRange(newRange)*/;

    if (newLo >= oldLo && newHi <= oldHi){
        // reduced range, no delta
        return {lo: newHi, hi: newHi};

    } else if (newLo >= oldHi || newHi < oldLo){
        return {lo: newLo, hi: newHi};
    } else if (newLo === oldLo && newHi === oldHi){
        return {lo: oldHi,hi: oldHi};
    } else {
        return {
            lo: newLo < oldLo ? newLo: oldHi,
            hi: newHi > oldHi ? newHi: oldLo
        };
    }
}

/**
 * 
 * @type {import('./range-utils').resetRange}
 */
function resetRange({lo,hi,bufferSize=0}){
    return {
        lo: 0,
        hi: hi-lo,
        bufferSize,
        reset: true
    };
}

const SAME = 0;
const FWD = 2;
const BWD = 4;
const CONTIGUOUS = 8;
const OVERLAP = 16;
const REDUCE = 32;
const EXPAND = 64;
const NULL = 128;

const RangeFlags = {
    SAME,
    FWD,
    BWD,
    CONTIGUOUS,
    OVERLAP,
    REDUCE,
    EXPAND,
    NULL
};

RangeFlags.GAP = ~(CONTIGUOUS | OVERLAP | REDUCE);

/** @type {import('./range-utils').compareRanges} */
function compareRanges(range1, range2){
    if (range2.lo === 0 && range2.hi === 0){
        return NULL;
    } else if (range1.lo === range2.lo && range1.hi === range2.hi){
        return SAME;
    } else if (range2.hi > range1.hi){
        if (range2.lo > range1.hi){
            return FWD;
        } else if (range2.lo === range1.hi){
            return FWD + CONTIGUOUS;
        } else if (range2.lo >= range1.lo){
            return FWD + OVERLAP;
        } else {
            return EXPAND;
        }
    } else if (range2.lo < range1.lo){
        if (range2.hi < range1.lo){
            return BWD;
        } else if (range2.hi === range1.lo){
            return BWD + CONTIGUOUS;
        } else if (range2.hi > range1.lo){
            return BWD + OVERLAP;
        } else {
            return EXPAND;
        }
    } else if (range2.lo > range1.lo) {
        return REDUCE + FWD;
    } else {
        return REDUCE + BWD
    }
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function bisector(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    },
    right: function(a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;
      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;
        else lo = mid + 1;
      }
      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function(d, x) {
    return ascending(f(d), x);
  };
}

var ascendingBisect = bisector(ascending);
var bisectRight = ascendingBisect.right;

function count(values, valueof) {
  let count = 0;
  if (valueof === undefined) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        ++count;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
        ++count;
      }
    }
  }
  return count;
}

function extent(values, valueof) {
  let min;
  let max;
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null) {
        if (min === undefined) {
          if (value >= value) min = max = value;
        } else {
          if (min > value) min = value;
          if (max < value) max = value;
        }
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null) {
        if (min === undefined) {
          if (value >= value) min = max = value;
        } else {
          if (min > value) min = value;
          if (max < value) max = value;
        }
      }
    }
  }
  return [min, max];
}

function identity(x) {
  return x;
}

var array = Array.prototype;

var slice = array.slice;

function constant(x) {
  return function() {
    return x;
  };
}

function range(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}

var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

function sturges(values) {
  return Math.ceil(Math.log(count(values)) / Math.LN2) + 1;
}

function bin() {
  var value = identity,
      domain = extent,
      threshold = sturges;

  function histogram(data) {
    if (!Array.isArray(data)) data = Array.from(data);

    var i,
        n = data.length,
        x,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1);

    // Convert number of thresholds into uniform thresholds.
    if (!Array.isArray(tz)) {
      tz = tickStep(x0, x1, tz);
      tz = range(Math.ceil(x0 / tz) * tz, x1, tz); // exclusive
    }

    // Remove any thresholds outside the domain.
    var m = tz.length;
    while (tz[0] <= x0) tz.shift(), --m;
    while (tz[m - 1] > x1) tz.pop(), --m;

    var bins = new Array(m + 1),
        bin;

    // Initialize bins.
    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    }

    // Assign data to bins by value, ignoring any outside the domain.
    for (i = 0; i < n; ++i) {
      x = values[i];
      if (x0 <= x && x <= x1) {
        bins[bisectRight(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  histogram.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
  };

  histogram.domain = function(_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
  };

  histogram.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
  };

  return histogram;
}

const CHECKBOX = 'checkbox';
const SINGLE_ROW = 'single-row';
const MULTIPLE_ROW = 'multiple-row';

const SelectionModelType = {
  Checkbox: CHECKBOX,
  SingleRow: SINGLE_ROW,
  MultipleRow: MULTIPLE_ROW
};

const {Checkbox, SingleRow, MultipleRow} = SelectionModelType;

const EMPTY = [];

class SelectionModel {

    constructor(selectionModelType=MultipleRow){
      this.modelType = selectionModelType;
    }

    select({rows:selection, lastTouchIdx}, idx, rangeSelect, keepExistingSelection){
        
        let selected, deselected;

        if (this.modelType === SingleRow){
            [selection, selected, deselected] = this.handleRegularSelection(selection, idx);
            lastTouchIdx = idx;
        } else if (rangeSelect){
            [selection, selected, deselected] = this.handleRangeSelection(selection, lastTouchIdx, idx);
        } else if (keepExistingSelection || this.modelType === Checkbox){
            [selection, selected, deselected] = this.handleIncrementalSelection(selection, idx);
            lastTouchIdx = idx;
        } else {
            [selection, selected, deselected] = this.handleRegularSelection(selection, idx);
            lastTouchIdx = idx;
        }

        return {
          focusedIdx: idx,
          lastTouchIdx,
          rows: selection,
          selected,
          deselected
        };

    }

    handleRegularSelection(selected, idx){
        const pos = selected.indexOf(idx);
        if (pos === -1){
            const selection = [idx];
            return [selection, selection, selected];
        } else if (selected.length === 1){
            return [EMPTY, EMPTY, selected];
        } else {
          return [EMPTY, EMPTY, remove(selected,idx)];
        }
    }

    handleIncrementalSelection(selected, idx){
        const pos = selected.indexOf(idx);
        const len = selected.length;
        const selection = [idx];

        if (pos === -1){
          if (len === 0){
              return [selection, selection,EMPTY];
            } else {
                return [insert(selected,idx), selection, EMPTY];
            }
        } else {
            if (len === 1){
                return [EMPTY, EMPTY, selected];
            } else {
                return [remove(selected,idx), EMPTY, selection];
            }
        }		
    }

    handleRangeSelection(selected, lastTouchIdx, idx){

        const pos = selected.indexOf(idx);
        const len = selected.length;

        if (pos === -1){

            if (len === 0){
                const selection = makeRange(0,idx);
                return [selection, selection, EMPTY];
            } else if (len === 1){
                const selection = makeRange(selected[0],idx);
                selected = selected[0] < idx
                  ? selection.slice(1)
                  : selection.slice(0,-1);
                return [selection, selected, EMPTY];
            } else {
                const selection = applyRange(selected,lastTouchIdx,idx);
                return [selection, selection.filter(i => !selected.includes(i)), EMPTY];
            }
        }
    }

}
function applyRange(arr, lo, hi){

    if (lo > hi) {[lo, hi] = [hi, lo];}

    const ranges = getRanges(arr);
    const newRange = new Range(lo,hi);
    let newRangeAdded = false;
    const ret = [];

    for (let i=0;i<ranges.length;i++){
        const range = ranges[i];

        if (!range.overlaps(newRange)){
            if (range.start < newRange.start){
                for (let idx=range.start;idx<=range.end;idx++){
                    ret.push(idx);
                }
            } else {
                for (let idx=newRange.start;idx<=newRange.end;idx++){
                    ret.push(idx);
                }
                newRangeAdded = true;
                for (let idx=range.start;idx<=range.end;idx++){
                    ret.push(idx);
                }
            }
        } else if (!newRangeAdded){
            for (let idx=newRange.start;idx<=newRange.end;idx++){
                ret.push(idx);
            }
            newRangeAdded = true;
        }
    }

    if (!newRangeAdded){
        for (let idx=newRange.start;idx<=newRange.end;idx++){
            ret.push(idx);
        }
    }

    return ret;
}

function getRanges(arr){

    const ranges = [];
    let range;

    for (let i=0;i<arr.length;i++){
        if (range && range.touches(arr[i])){
            range.extend(arr[i]);
        } else {
            ranges.push(range = new Range(arr[i]));
        }
    }

    return ranges;

}

class Range {

    constructor(start, end=start){
        this.start = start;
        this.end = end;
    }

    extend(idx){
        if (idx >= this.start && idx > this.end){
            this.end = idx;
        }
    }

    touches(idx){
        return this.end === idx-1;
    }

    overlaps(that){
        return !(this.end < that.start || this.start > that.end);
    }

    contains(idx){
        return this.start <= idx && this.end >= idx;
    }

    toString(){
        return `[${this.start}:${this.end}]`;
    }
}

function makeRange(lo, hi){
    if (lo > hi) {[lo, hi] = [hi, lo];}

    const range = [];
    for (let idx=lo;idx<=hi;idx++){
        range.push(idx);
    }
    return range;
}

function remove(arr, idx){
    const ret = [];
    for (let i=0;i<arr.length;i++){
        if (idx !== arr[i]){
            ret.push(arr[i]);
        }
    }
    return ret;
}

function insert(arr, idx){
    const ret = [];
    for (let i=0;i<arr.length;i++){
        if (idx !== null && idx < arr[i]){
            ret.push(idx);
            idx = null;
        }
        ret.push(arr[i]);
    }
    if (idx !== null){
        ret.push(idx);
    }
    return ret;

}

function sortableFilterSet(filterSet){
    if (filterSet.length === 0){
        return filterSet;
    } else if (Array.isArray(filterSet[0])){
        return filterSet;
    } else {
        return filterSet.map(idx => [idx,null]);
    }
}

function sortExtend(sortSet, rows, newSortCols, columnMap){
    sort2ColsAdd1(sortSet, rows, newSortCols, columnMap);
}

function sort(sortSet,rows,sortCols,columnMap){
    const sortCriteria = mapSortCriteria(sortCols, columnMap);
    const count = sortCriteria.length;
    const sortFn = count === 1 ? sort1 : count === 2 ? sort2 : count === 3 ? sort3 : sortAll;
    sortFn(sortSet,rows,sortCriteria);
}

function sort2ColsAdd1(sortSet, rows, sortCols, columnMap){
    const len = sortSet.length;
    const sortCriteria = mapSortCriteria(sortCols, columnMap);
    const [colIdx2] = sortCriteria[1];
    for (let i=0;i<len;i++){
        sortSet[i][2] = rows[sortSet[i][0]][colIdx2];
    }
    // This does not take direction into account
    sortSet.sort((a,b) => {
        return a[1] > b[1] ? 1 : b[1] > a[1] ? -1
            : a[2] > b[2] ? 1 : b[2] > a[2] ? -1 : 0;
    });
}

function sort1(sortSet,rows,[[colIdx, direction]]){
    const len = sortSet.length;
    for (let i=0;i<len;i++){
        const idx = sortSet[i][0];
        sortSet[i][1] = rows[idx][colIdx];
    }
    if (direction === ASC){
        sortSet.sort((a,b) => {
            return a[1] > b[1] ? 1 : b[1] > a[1] ? -1 : 0;
        });
    } else {
        sortSet.sort((a,b) => {
            return a[1] > b[1] ? -1 : b[1] > a[1] ? 1 : 0;
        });
    }
}

function sort2(sortSet,rows,sortCriteria){
    const len = rows.length;
    const [colIdx1] = sortCriteria[0];
    const [colIdx2] = sortCriteria[1];
    for (let i=0;i<len;i++){
        sortSet[i][0] = i;
        sortSet[i][1] = rows[i][colIdx1];
        sortSet[i][2] = rows[i][colIdx2];
    }
    sortSet.sort((a,b) => {
        return a[1] > b[1] ? 1 : b[1] > a[1] ? -1
            : a[2] > b[2] ? 1 : b[2] > a[2] ? -1 : 0;
    });
}

function sort3(/*sortSet,rows,sortCriteria*/){

}
function sortAll(/*sortSet,rows,sortCriteria*/){

}

function sortReversed(cols1, cols2, colCount=cols1.length){
    if (cols1 && cols2 && cols1.length > 0 && cols2.length === colCount){
        for (let i=0;i<cols1.length; i++){
            let [col1, direction1=ASC] = cols1[i];
            let [col2, direction2=ASC] = cols2[i];
            if (col1 !== col2 || direction1 === direction2){
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}


function GROUP_ROW_TEST(group, row, [colIdx, direction]) {
    if (group === row) {
        return 0;
    } else {
        let a1 = direction === DSC ? row[colIdx] : group[colIdx];
        let b1 = direction === DSC ? group[colIdx] : row[colIdx];
        if (b1 === null || a1 > b1) {
            return 1;
        } else if (a1 == null || a1 < b1) {
            return -1;
        }
    }
}

function ROW_SORT_TEST(a, b, [colIdx, direction]) {
    if (a === b) {
        return 0;
    } else {
        let a1 = direction === DSC ? b[colIdx] : a[colIdx];
        let b1 = direction === DSC ? a[colIdx] : b[colIdx];
        if (b1 === null || a1 > b1) {
            return 1;
        } else if (a1 == null || a1 < b1) {
            return -1;
        }
    }
}

// sort null as low. not high
function sortBy(cols, test=ROW_SORT_TEST) {
    return function (a, b) {
        for (let i = 0, result = 0, len=cols.length; i < len; i++) {
            if (result = test(a, b, cols[i])) {
                return result;
            }
        }
        return 0;
    };
}

// sorter is the sort comparator used to sort rows, we want to know
// where row would be positioned in this sorted array. Return the
// last valid position.
function sortPosition(rows, sorter, row, positionWithinRange = 'last-available') {

    function selectFromRange(pos) {

        const len = rows.length;
        const matches = p => sorter(rows[p], row) === 0;

        //TODO this will depend on the sort direction
        if (positionWithinRange === 'last-available') {
            while (pos < len && matches(pos)) {
                pos += 1;
            }
        } else if (positionWithinRange === 'first-available') {
            while (pos > 0 && matches(pos - 1)) {
                pos -= 1;
            }
        }

        return pos;

    }

    function find(lo, hi) {

        let mid = lo + Math.floor((hi - lo) / 2);
        let pos = sorter(rows[mid], row);

        if (lo === mid) {
            return selectFromRange(pos >= 0 ? lo : hi);
        }
        if (pos >= 0) {
            hi = mid;
        } else {
            lo = mid;
        }
        return find(lo, hi);
    }

    if (rows.length === 0){
        return 0;
    } else {
        return find(0, rows.length);
    }

}

const DEFAULT_OPTIONS = {
    startIdx: 0,
    rootIdx: null,
    baseGroupby: []
};

/** @type {import('./group-utils').lowestIdxPointerFunc} */
function lowestIdxPointer(groups, IDX, DEPTH, start, depth){
    let result = Number.MAX_SAFE_INTEGER;
    for (let i=start; i<groups.length; i++){
        const group = groups[i];
        const absDepth = Math.abs(group[DEPTH]);

        if (absDepth > depth){
            break;
        } else if (absDepth === depth) {
            const idx = group[IDX];
            if (typeof idx === 'number' && idx < result){
                result = idx;
            }
        }
    }

    return result === Number.MAX_SAFE_INTEGER ? undefined : result;

}

/** @type {import('./group-utils').getCountFunc} */
function getCount(groupRow, PRIMARY_COUNT, FALLBACK_COUNT){
    return typeof groupRow[PRIMARY_COUNT] === 'number'
        ? groupRow[PRIMARY_COUNT]
        : groupRow[FALLBACK_COUNT];
}

class SimpleTracker {
    constructor(levels){
        this.levels = Array(levels).fill(0).reduce((acc,el,i) => {
            acc[i+1] = {key: null, pos: null, pPos: null};
            return acc;
        },{});
    }
    set(depth,pos,groupKey){
        if (this.levels){
            const level = this.levels[Math.abs(depth)];
            if (level && level.key !== groupKey){
                if (level.key !== null){
                    level.pPos = level.pos;
                }
                level.key = groupKey;
                level.pos = pos;
            }
        }
    }
    
    hasParentPos(level){
        return this.levels[level+1] && this.levels[level+1].pos !== null
    }
    
    parentPos(level){
        return this.levels[level+1].pos
    }
    
    hasPreviousPos(level){
        return this.levels[level] && this.levels[level].pPos !== null
    }
    
    previousPos(level){
        return this.levels[level].pPos;
    }
}

class GroupIdxTracker {
    constructor(levels){
        this.idxAdjustment = 0;
        this.maxLevel = levels+1;
        this.levels = levels > 0
            ? Array(levels).fill(0).reduce((acc,el,i) => {
                acc[i+2] = {key: null, current: 0, previous: 0};
                return acc;
            },{})
            : null;
    }

    increment(count){
        this.idxAdjustment += count;
        if (this.levels){
            for (let i=2; i<this.maxLevel+1;i++){
                this.levels[i].current += count;
            }
        }
    }

    previous(level){
        return (this.levels && this.levels[level] && this.levels[level].previous) || 0
    }

    hasPrevious(level){
        return this.previous(level) > 0;
    }

    get(idx){
        return this.levels === null ? null: this.levels[idx]
    }

    set(depth,groupKey){
        if (this.levels){
            const level = this.levels[depth];
            if (level && level.key !== groupKey){
                if (level.key !== null){
                    level.previous += level.current;
                    level.current = 0;
                }
                level.key = groupKey;
            }
        }
    }
}

const itemIsNumeric = item => !isNaN(parseInt(item,10));
const numerically = (a,b) => parseInt(a)-parseInt(b);

function sortKeys(o){
    const keys = Object.keys(o);
    if (keys.every(itemIsNumeric)){
        return keys.sort(numerically)
    } else {
        return keys.sort()
    }
}

function fillNavSetsFromGroups(groups, sortSet, sortIdx=0, filterSet=null, filterIdx, filterLen){
    const keys = sortKeys(groups);
    const filtered = filterSet !== null;
    const filterIndices = filtered ? filterSet.slice(filterIdx,filterLen) : null;
    for (let i = 0 ; i<keys.length;i++){
        const groupedRows = groups[keys[i]];
        if (Array.isArray(groupedRows)){
            for (let j=0,len=groupedRows.length;j<len;j++){
                const rowIdx = groupedRows[j];
                sortSet[sortIdx] = rowIdx;
                sortIdx += 1;
                // this could be prohibitively slow (the includes test) ...
                if (filtered && filterIndices.includes(rowIdx)){
                    filterSet[filterIdx] = rowIdx;
                    filterIdx += 1;
                }
            }
        } else {
            sortIdx = fillNavSetsFromGroups(groupedRows, sortSet, sortIdx);
        }
    }
    return sortIdx;
}

// WHY is param order different from groupLeafRows
/** @type {import('./group-utils').groupRowsFunc} */
function groupRows(rows, sortSet, columns, columnMap, groupby, options = DEFAULT_OPTIONS) {
    const { startIdx = 0, length=rows.length, rootIdx = null, baseGroupby = [], groups=[], rowParents=null,
        filterLength, filterSet, filterFn: filter } = options;
    let {groupIdx=-1, filterIdx} = options;
    const aggregations = findAggregatedColumns(columns, columnMap, groupby);
    const groupedLeafRows = groupLeafRows(sortSet, rows, groupby, startIdx, length);
    fillNavSetsFromGroups(groupedLeafRows, sortSet, startIdx, filterSet, filterIdx, filterLength);

    const levels = groupby.length;
    const currentGroups = Array(levels).fill(null);
    const { IDX, DEPTH, FILTER_COUNT, NEXT_FILTER_IDX, count: metadataOffset } = metadataKeys;
    let parentIdx = rootIdx;
    let leafCount = 0;
    for (let i = startIdx, len=startIdx+length; i < len; i++){
        const rowIdx = sortSet[i];
        const row = rows[rowIdx];

        for (let level = 0; level < levels; level++) {
            const [columnIdx] = groupby[level];
            const currentGroup = currentGroups[level];
            const groupValue = row[columnIdx];
            // as soon as we identify a group change, each group at that level and below
            // is then aggregated and new group(s) initiated. 
            // TODO how do we map from table idx (with 2 x metadata)
            if (currentGroup === null || currentGroup[metadataOffset + columnIdx - 2/* !!!!!!! */] !== groupValue) {
                if (currentGroup !== null) {
                    // as soon as we know we're regrouping, aggregate the open groups, in reverse order
                    for (let ii = levels - 1; ii >= level; ii--) {
                        const group = currentGroups[ii];
                        aggregate(group, groups, sortSet, rows, columns, aggregations, leafCount, filter);
                        if (filterSet && Math.abs(group[DEPTH]) === 1 && group[FILTER_COUNT] > 0){
                            group[NEXT_FILTER_IDX] = filterIdx;
                            filterIdx += group[FILTER_COUNT];
                        }
                    }

                    leafCount = 0;
                }
                for (let ii = level; ii < levels; ii++) {
                    groupIdx += 1;
                    parentIdx = ii === 0 ? rootIdx : currentGroups[ii - 1][IDX];
                    const depth = levels - ii;
                    // for first-level groups, row pointer is a pointer into the sortSet
                    const childIdx = depth === 1
                        ? i
                        : groupIdx+1;

                    const groupRow = currentGroups[ii] = GroupRow(row, depth, groupIdx, childIdx, parentIdx, groupby, columns, columnMap, baseGroupby);
                    groups.push(groupRow);
                }
                break; // do not continue looping once we identify the change point
            }
        }
        rowParents && (rowParents[rowIdx] = groupIdx);
        leafCount += 1;
    }

    for (let i = levels - 1; i >= 0; i--) {
        if (currentGroups[i] !== null){
            const group = currentGroups[i];
            aggregate(group, groups, sortSet, rows, columns, aggregations, leafCount, filter);
            if (filterSet && Math.abs(group[DEPTH]) === 1 && group[FILTER_COUNT] > 0){
                group[NEXT_FILTER_IDX] = filterIdx;
            }
        }
    }
    return groups;

}

// Checks very specifically for new cols added at end 
/** @type {import('./group-utils').groupbyExtendsExistingGroupby} */
function groupbyExtendsExistingGroupby(groupBy, existingGroupBy) {
    return (groupBy.length > existingGroupBy.length &&
        existingGroupBy.every((g, i) => g[0] === groupBy[i][0]));
}

// doesn't care from which position col is removed, as long as it is not the first
/** @type {import('./group-utils').groupbyReducesExistingGroupby} */
function groupbyReducesExistingGroupby(groupby, existingGroupby) {
    return (existingGroupby.length > groupby.length &&
        groupby[0][0] === existingGroupby[0][0] &&
        groupby.every(([key]) => existingGroupby.find(([key2]) => key2 === key)));
}

/** @type {import('./group-utils').groupbySortReversed} */
function groupbySortReversed(groupBy, existingGroupBy) {
    const [col] = findSortedCol(groupBy, existingGroupBy);
    return col !== null;
}

/** @type {import('./group-utils').findDoomedColumnDepths} */
function findDoomedColumnDepths(groupby, existingGroupby) {
    const count = existingGroupby.length;
    return existingGroupby.reduce(
        (results, [colIdx], idx) => {
            if (!groupby.some(group => group[0] === colIdx)) {
                results.push(count - idx);
            }
            return results;
        }, []);
}

/** @type {import('./group-utils').groupbyExtendsExistingGroupby} */
function findSortedCol(groupby, existingGroupby) {
    let results = [null];
    let len1 = groupby && groupby.length;
    let len2 = existingGroupby && existingGroupby.length;
    if (len1 && len2 && len1 === len2) {

        for (let i = 0; i < len1; i++) {
            if (groupby[i][0] !== existingGroupby[i][0]) {
                return results;
            } else if (groupby[i][1] !== existingGroupby[i][1]) {
                results[0] = i;
                results[1] = len1 - i;
            }
        }
    }
    return results;
}

function byKey$1([key1], [key2]) {
    return key1 > key2 ? 1 : key2 > key1 ? -1 : 0;
}

const EMPTY$1 = {};
/** @type {import('./group-utils').getGroupStateChanges} */
function getGroupStateChanges(groupState, existingGroupState = null, baseKey = '', groupIdx = 0) {
    const results = [];
    const entries = Object.entries(groupState);

    entries.forEach(([key, value]) => {
        if (value && (existingGroupState === null || !existingGroupState[key])) {
            results.push([baseKey + key, groupIdx, true]);
            if (value !== null && typeof value === 'object' && Object.keys(value).length > 0) {
                const diff = getGroupStateChanges(value, EMPTY$1, baseKey + key + '/', groupIdx + 1);
                if (diff.length) {
                    results.push(...diff);
                }
            }
        } else if (value) {
            const diff = getGroupStateChanges(value, existingGroupState[key], baseKey + key + '/', groupIdx + 1);
            if (diff.length) {
                results.push(...diff);
            }
        }
    });

    if (existingGroupState !== null && typeof existingGroupState === 'object') {
        Object.entries(existingGroupState).forEach(([key, value]) => {
            if (value && !groupState[key]) {
                results.push([baseKey + key, groupIdx, false]);
            }
        });
    }

    return results.sort(byKey$1);
}

/** @type {import('./group-utils').allGroupsExpanded} */
function allGroupsExpanded(groups, group ){
    const {DEPTH, PARENT_IDX} = metadataKeys;
    do {
        if (group[DEPTH] < 0){
            return false;
        }
        group = groups[group[PARENT_IDX]];

    } while (group)
    
    return true;
}

/** @type {import('./group-utils').adjustGroupIndices} */
function adjustGroupIndices(groups, grpIdx, adjustment=1){
    const {IDX, DEPTH, IDX_POINTER, PARENT_IDX} = metadataKeys;
    for (let i=0;i<groups.length;i++){
        if (groups[i][IDX] >= grpIdx){
            groups[i][IDX] += adjustment;
            if (Math.abs(groups[i][DEPTH]) > 1){
                groups[i][IDX_POINTER] += adjustment;
            }
            let parentIdx = groups[i][PARENT_IDX];
            if (parentIdx !== null && parentIdx >= grpIdx){
                groups[i][PARENT_IDX] += adjustment;
            }
        }
    }
}

/** @type {import('./group-utils').adjustLeafIdxPointers} */
function adjustLeafIdxPointers(groups, insertionPoint, adjustment=1){
    const {DEPTH, IDX_POINTER} = metadataKeys;
    for (let i=0;i<groups.length;i++){
        if (Math.abs(groups[i][DEPTH]) === 1 && groups[i][IDX_POINTER] >= insertionPoint){
            groups[i][IDX_POINTER] += adjustment;
        }
    }
}

/** 
 * Find the groups that will be affectes by an inserted row.
 * 
 * @type {import('./group-utils').findGroupPositions} */
function findGroupPositions(groups, groupby, dataRow) {

    const positions = [];

    out: for (let i = 0; i < groupby.length; i++) {
        const sorter = sortBy(groupby.slice(0, i + 1), GROUP_ROW_TEST);
        const position = sortPosition(groups, sorter, dataRow, 'first-available');
        const group = groups[position];
        // if all groups are missing and insert position is end of list ...
        if (group === undefined) {
            break;
        }
        // position is confirmed if all groupCol values in this comparison match values of row 
        // and other groupCol values  are null
        for (let j = 0; j < groupby.length; j++) {
            const colIdx = groupby[j][0];
            const colValue = group[colIdx];
            if (j > i) {
                if (colValue !== null) {
                    break out;
                }
            } else if (colValue !== dataRow[colIdx]) {
                break out;
            }

        }
        positions.push(position);
    }

    return positions;

}

/** @type {import('./group-utils').expandRow} */
const expandRow = (groupCols, row, meta) => {
    const r = row.slice();
    r[meta.IDX] = 0;
    r[meta.DEPTH] = 0; 
    r[meta.COUNT] = 0;
    r[meta.KEY] = buildGroupKey(groupCols, row);
    r[meta.SELECTED] = 0;
    return r;
};

function buildGroupKey(groupby, row){
    const extractKey = ([idx]) => row[idx];
    return groupby.map(extractKey).join('/');
}

// Do we have to take columnMap out again ?
function GroupRow(row, depth, idx, childIdx, parentIdx, groupby, columns, columnMap, baseGroupby = []) {
    const { IDX, RENDER_IDX, DEPTH, COUNT, KEY, SELECTED, PARENT_IDX, IDX_POINTER, count: metadataOffset } = metadataKeys;
    // The group is a set of metadata values plus data values
    const group = Array(metadataOffset + columns.length);
    const groupIdx = groupby.length - depth;
    let colIdx;

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        const key = columnMap[column.name];
        // careful here, key maps to the table row (includes 2 metadata slots), groupBy has also been translated to table keys
        // the group represents a full projection, metadata + columns
        const groupKey = metadataOffset + i;
        if (column.aggregate) { // implies we can't group on aggregate columns, does the UI know that ?
            group[groupKey] = 0;
        } else if ((colIdx = indexOfCol(key, groupby)) !== -1 && colIdx <= groupIdx) {
            group[groupKey] = row[key];
        } else {
            group[groupKey] = null;
        }
    }
    for (let i = 0; i < baseGroupby.length; i++) {
        // baseGroupBy offsets are tableRow offsets, with 2 slots of metadata
        const [colIdx] = baseGroupby[i];
        // TODO need to convert colIdx to columns ref
        group[metadataOffset + colIdx - 2] = row[colIdx];
    }

    const extractKey = ([idx]) => row[idx];
    const buildKey = groupby => groupby.map(extractKey).join('/');
    //TODO build the composite key for the grouprow
    const baseKey = baseGroupby.length > 0
        ? buildKey(baseGroupby) + '/'
        : '';
    const groupKey = buildKey(groupby.slice(0, groupIdx + 1));

    group[IDX] = idx;
    group[RENDER_IDX] = 0;
    group[DEPTH] = -depth;
    group[COUNT] = 0;
    group[KEY] = baseKey + groupKey;
    group[SELECTED] = 0;
    group[PARENT_IDX] = parentIdx;
    group[IDX_POINTER] = childIdx;

    return group;

}

function groupLeafRows(sortSet, leafRows, groupby, startIdx=0, length=sortSet.length) {
    const groups = {};
    const levels = groupby.length;
    const lastLevel = levels - 1;
    for (let i=startIdx, len=startIdx+length; i < len; i++) {
        const idx = sortSet[i];
        const leafRow = leafRows[idx];
        let target = groups;
        let targetKey;
        let key;
        for (let level = 0; level < levels; level++) {
            const [colIdx] = groupby[level];
            key = leafRow[colIdx];
            targetKey = target[key];
            if (targetKey && level === lastLevel) {
                targetKey.push(idx);
            } else if (targetKey) {
                target = targetKey;
            } else if (!targetKey && level < lastLevel) {
                target = (target[key] = {});
            } else if (!targetKey) {
                target[key] = [idx];
            }
        }
    }
    return groups;
}

/** @type {import('./group-utils').splitGroupsAroundDoomedGroup} */
function splitGroupsAroundDoomedGroup(groupby, doomed) {
    const lastGroupIsDoomed = doomed === 1;
    const doomedIdx = groupby.length - doomed;
    const preDoomedGroupby = [];
    const postDoomedGroupby = [];

    groupby.forEach((col, i) => {
        if (i < doomedIdx) {
            preDoomedGroupby.push(col);
        } else if (i > doomedIdx) {
            postDoomedGroupby.push(col);
        }
    });

    return [lastGroupIsDoomed, preDoomedGroupby, postDoomedGroupby];
}

/** @type {import('./group-utils').decrementDepth} */
function decrementDepth(depth) {
    return (Math.abs(depth) - 1) * (depth < 0 ? -1 : 1);
}

/** @type {import('./group-utils').incrementDepth} */
function incrementDepth(depth) {
    return (Math.abs(depth) + 1) * (depth < 0 ? -1 : 1);
}

/** @type {import('./group-utils').findAggregatedColumns} */
function findAggregatedColumns(columns, columnMap, groupby) {
    return columns.reduce((aggregations, column) => {
        if (column.aggregate && indexOfCol(column.name, groupby) === -1) {
            const key = columnMap[column.name];
            aggregations.push([key, column.aggregate]);
        }
        return aggregations;
    }, []);
}

/** 
 * Called when we clear a filter
 * 
 * @type {import('./group-utils').aggregateGroup} */
function aggregateGroup(groups, grpIdx, sortSet, rows, columns, aggregations) {

    const {DEPTH, COUNT} = metadataKeys;
    const groupRow = groups[grpIdx];
    let depth = groupRow[DEPTH];
    let absDepth = Math.abs(depth);
    let count = 0;
    let idx = grpIdx;

    // find the last nested group and work back - first build aggregates for level 1 groups,
    // then use those to aggregate to level 2 etc.
    while (idx < groups.length - 1 && Math.abs(groups[idx+1][DEPTH]) < absDepth){
        idx += 1;
        count += 1;
    }

    for (let i=grpIdx+count; i >= grpIdx; i--){
        for (let aggIdx = 0; aggIdx < aggregations.length; aggIdx++) {
            const [colIdx] = aggregations[aggIdx];
            const dataIdx =colIdx +  metadataKeys.count - 2; // <<<<<<<<<<<
            groups[i][dataIdx] = 0;
        }
        aggregate(groups[i], groups, sortSet, rows, columns, aggregations, groups[i][COUNT]);
    }

}

function aggregate(groupRow, groupRows, sortSet, rows, columns, aggregations, leafCount, filter=null) {
    const {DEPTH, COUNT, FILTER_COUNT, IDX_POINTER, count: metadataOffset} = metadataKeys;
    let absDepth = Math.abs(groupRow[DEPTH]);
    let count = 0;
    let filteredCount = filter === null ? undefined : 0;

    if (absDepth === 1) {
        // The first group accumulates aggregates from the raw data...
        let start = groupRow[IDX_POINTER];
        let end = start + leafCount;
        count = leafCount;
        for (let i = start; i < end; i++) {
            const row = rows[sortSet[i]];
            const included = filter === null || filter(row);
            if (filter && included){
                filteredCount += 1;
            }
            if (filter === null || included){
                for (let aggIdx = 0; aggIdx < aggregations.length; aggIdx++) {
                    const [colIdx] = aggregations[aggIdx];
                    groupRow[metadataOffset + colIdx - 2/* !!!!!!! */] += row[colIdx];
                }
            }
        }
    } else {
        // higher-level groups aggregate from child-groups ...
        // we cannot blindly use the grpIndex of the groupRow, as we may be dealing with a smaller subset
        // of groupRows, e,g, when inserting a new row and creating the missing groups
        const startIdx = groupRows.indexOf(groupRow) + 1;
        for (let i=startIdx;i<groupRows.length;i++){
            const nestedGroupRow = groupRows[i];
            const nestedRowDepth = nestedGroupRow[DEPTH];
            const nestedRowCount = nestedGroupRow[COUNT];
            const absNestedRowDepth = Math.abs(nestedRowDepth);
            if (absNestedRowDepth >= absDepth){
                break;
            } else if (absNestedRowDepth === absDepth - 1) {
                for (let aggIdx = 0; aggIdx < aggregations.length; aggIdx++) {
                    const [colIdx, method] = aggregations[aggIdx];
                    if (method === 'avg') {
                        groupRow[metadataOffset + colIdx - 2] += nestedGroupRow[metadataOffset + colIdx - 2] * nestedRowCount;
                    } else {
                        groupRow[metadataOffset + colIdx - 2] += nestedGroupRow[metadataOffset + colIdx - 2];
                    }
                }
                count += nestedRowCount;
            }
        }
    }

    for (let aggIdx = 0; aggIdx < aggregations.length; aggIdx++) {
        const [colIdx, method] = aggregations[aggIdx];
        if (method === 'avg') {
            groupRow[metadataOffset + colIdx - 2] = groupRow[metadataOffset + colIdx - 2] / count;
        }
    }

    groupRow[COUNT] = count;
    groupRow[FILTER_COUNT] = filteredCount;

}

function leafRow([idx,key, ...data]){
    // TODO find fastest way to do this
    const row = Array(metadataKeys.count).fill(0).concat(data);
    row[metadataKeys.IDX] = idx;
    row[metadataKeys.KEY] = key;
    return row;
}

/**
 * Keep all except for groupRowset in this file to avoid circular reference warnings
 */

const SINGLE_COLUMN = 1;

const NO_OPTIONS = {
    filter: null
};

class BaseRowSet {

    constructor(table, columns, offset = 0) {
        this.table = table;
        this.offset = offset;
        this.baseOffset = offset;
        this.range = NULL_RANGE;
        this.columns = columns;
        this.currentFilter = null;
        this.filterSet = null;
        this.sortSet = undefined;
        this.data = table.rows;
        this.selected = {rows: [], focusedIdx: -1, lastTouchIdx: -1};
        this.type = undefined;
        this.index = undefined;
        /**
         * data IDX of selected rows 
         */
        this.selectedRowsIDX = [];
        this.selectionModel = this.createSelectionModel();

    }

    get size(){
        console.error("size must be implemented by concrete Rowset");
        return 0;
    }

    slice(lo, hi){
        throw new Error("slice must be implemented by concrete Rowset")
    }

    createSelectionModel(){
        return new SelectionModel();
    }

    // used by binned rowset
    get filteredData() {
        if (this.filterSet) {
            return this.filterSet;
        } else {
            const { IDX } = metadataKeys;
            return this.data.map(row => row[IDX])
        }
    }

    get stats(){
        // TODO cache the stats and invalidate them in the event of any op that might change them 
        const {totalRowCount, filteredRowCount, selected, selectedRowsIDX} = this;
        const totalSelected = selectedRowsIDX.length;
        const filteredSelected = selected.rows.length;

        return {
            totalRowCount,
            totalSelected,
            filteredRowCount,
            filteredSelected
        }
    }

    get totalRowCount(){
        return this.data.length;
    } 

    get filteredRowCount(){
        return this.filterSet === null
            ? this.data.length
            : this.filterSet.length
    }


    get selectedRowCount(){
        return this.selected.rows.length;
    }

    setRange(range=this.range, useDelta = true, includeStats=false) {

        const { lo, hi } = useDelta ? getDeltaRange(this.range, range) : getFullRange(range);
        const resultset = this.slice(lo, hi);
        this.range = range;
        const length = this.size;
        return {
            dataType: this.type,
            rows: resultset,
            range,
            size: length,
            offset: this.offset,
            stats: includeStats ? this.stats : undefined
        };
    }

    currentRange() {
        const { lo, hi } = this.range;
        const resultset = this.slice(lo, hi);
        return {
            dataType: this.type,
            rows: resultset,
            range: this.range,
            size: this.size,
            offset: this.offset,
            stats: undefined
        };
    }

    select(idx, rangeSelect, keepExistingSelection){

        const { selectionModel, range: {lo, hi}, filterSet, sortSet, offset} = this;
        const { SELECTED } = metadataKeys;
        const {selected, deselected, ...selectionState} = selectionModel.select(
            this.selected,
            idx,
            rangeSelect,
            keepExistingSelection
        );
        
        this.selected = selectionState;

        if (filterSet){
            if (selected.length){
                this.selectedRowsIDX.push(...selected.map(i => filterSet[i]));
            }
            if (deselected.length){
                const deselectedRowIDX = deselected.map(i => filterSet[i]);
                this.selectedRowsIDX = this.selectedRowsIDX.filter(rowIdx => !deselectedRowIDX.includes(rowIdx));
            }
        } else {
            const idxToIDX = idx => sortSet[idx][0];
            this.selectedRowsIDX = this.selected.rows.map(idxToIDX);
        } 

        const updates = [];
        for (let i=0;i<selected.length;i++){
            const idx = selected[i];
            if (idx >= lo && idx < hi){
                updates.push([idx+offset,SELECTED, 1]);
            }
        }
        for (let i=0;i<deselected.length;i++){
            const idx = deselected[i];
            if (idx >= lo && idx < hi){
                updates.push([idx+offset,SELECTED, 0]);
            }
        }
        
        return updates;
    }

    selectAll(){
        const {data, selected, selectedRowsIDX, range: {lo, hi}, filterSet, offset} = this;
        const { SELECTED } = metadataKeys;
        const previouslySelectedRows = [...this.selected.rows];
        if (filterSet){
            // selection of a filtered subset is added to existing selection 
            for (let i =0; i< filterSet.length; i++){
                const rowIDX = filterSet[i];
                if (!selectedRowsIDX.includes(rowIDX)){
                    selected.rows.push(i); // does it matter if thes eend up out of sequence ?
                    selectedRowsIDX.push(rowIDX);
                }
            }

        } else {
            // Step 1: brute force approach, actually create list of selected indices
            // need to replace this with a structure that tracks ranges
            this.selected = {rows: arrayOfIndices(data.length), focusedIdx: -1, lastTouchIdx: -1};
            this.selectedRowsIDX = [...this.selected.rows];
        }   

        const updates = [];
        const max = Math.min(hi, (filterSet || data).length);
        for (let i=lo;i<max;i++){
            if (this.selected.rows.includes(i) && !previouslySelectedRows.includes(i)){ 
                updates.push([i+offset,SELECTED, 1]);
            }
        }
        
        return updates;

    }

    selectNone(){

        const {range: {lo, hi}, filterSet, offset} = this;
        const {SELECTED} = metadataKeys;
        const previouslySelectedRows = this.selectedRowsIDX;
        if (filterSet){
            this.selected = {rows: [], focusedIdx: -1, lastTouchIdx: -1};
            this.selectedRowsIDX = this.selectedRowsIDX.filter(idx => !filterSet.includes(idx));
        } else {
            this.selected = {rows: [], focusedIdx: -1, lastTouchIdx: -1};
            this.selectedRowsIDX = [];
        }
        const updates = [];
        for (let i=lo;i<hi;i++){
            const idx = filterSet ? filterSet[i] : i;
            if (previouslySelectedRows.includes(idx)){
                updates.push([i+offset,SELECTED, 0]);
            }
        }
        return updates;
    }

    selectNavigationSet(useFilter) {
        const { COUNT, IDX_POINTER, FILTER_COUNT, NEXT_FILTER_IDX } = metadataKeys;
        return useFilter
            ? [this.filterSet, NEXT_FILTER_IDX, FILTER_COUNT]
            : [this.sortSet, IDX_POINTER, COUNT];
    }

    //TODO cnahge to return a rowSet, same as getDistinctValuesForColumn
    getBinnedValuesForColumn(column) {
        const key = this.table.columnMap[column.name];
        const { data: rows, filteredData } = this;
        const numbers = filteredData.map(rowIdx => rows[rowIdx][key]);
        const data = bin().thresholds(20)(numbers).map((arr, i) => [i + 1, arr.length, arr.x0, arr.x1]);

        const table = new Table({ data, primaryKey: 'bin', columns: BIN_FILTER_DATA_COLUMNS });
        const filterRowset = new BinFilterRowSet(table, BIN_FILTER_DATA_COLUMNS, column.name);
        return filterRowset;
    }

    getDistinctValuesForColumn(column) {
        const { data: rows, currentFilter } = this;
        const colIdx = this.table.columnMap[column.name];
        const resultMap = {};
        const data = [];
        const dataRowCount = rows.length;
        const [/*columnFilter*/, otherFilters] = splitFilterOnColumn(currentFilter, column);
        // this filter for column that we remove will provide our selected values   
        let dataRowAllFilters = 0;

        if (otherFilters === null) {
            let result;
            for (let i = 0; i < dataRowCount; i++) {
                const val = rows[i][colIdx];
                if (result = resultMap[val]) {
                    result[2] = ++result[1];
                } else {
                    result = [val, 1, 1];
                    resultMap[val] = result;
                    data.push(result);
                }
            }
            dataRowAllFilters = dataRowCount;
        } else {

            const fn = functor(this.table.columnMap, otherFilters);
            let result;

            for (let i = 0; i < dataRowCount; i++) {
                const row = rows[i];
                const val = row[colIdx];
                const isIncluded = fn(row) ? 1 : 0;
                if (result = resultMap[val]) {
                    result[1] += isIncluded;
                    result[2]++;
                } else {
                    result = [val, isIncluded, 1];
                    resultMap[val] = result;
                    data.push(result);
                }
                dataRowAllFilters += isIncluded;
            }
        }

        //TODO primary key should be indicated in columns
        const table = new Table({ data, primaryKey: 'name', columns: SET_FILTER_DATA_COLUMNS });
        return new SetFilterRowSet(table, SET_FILTER_DATA_COLUMNS, column.name, dataRowAllFilters, dataRowCount);

    }
}

//TODO should range be baked into the concept of RowSet ?
class RowSet extends BaseRowSet {

    // TODO stream as above
    static fromGroupRowSet({ table, columns, offset, currentFilter: filter }) {
        return new RowSet(table, columns, offset, {
            filter
        });
    }
    //TODO consolidate API of rowSet, groupRowset
    constructor(table, columns, offset = 0, { filter = null } = NO_OPTIONS) {
        super(table, columns, offset);
        this.type = "rowData";
        this.project = projectColumns(table.columnMap, columns);
        this.sortCols = null;
        this.sortReverse = false;
        this.sortSet = this.buildSortSet();
        this.filterSet = null;
        this.sortRequired = false;
        if (filter) {
            this.currentFilter = filter;
            this.filter(filter);
        }

    }

    buildSortSet() {
        const len = this.data.length;
        const arr = Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = [i, null, null]; // so we're allowing max of 2 sort criteria ?
        }
        return arr;
    }

    slice(lo, hi) {
        const {data, selectedRowsIDX, filterSet, offset, sortCols, sortSet, sortReverse} = this;
        if (filterSet) {
            const filterMapper = typeof filterSet[0] === 'number'
                ? idx => data[idx]
                : ([idx]) => data[idx];

            const results = [];
            for (let i = lo, len = filterSet.length; i < len && i < hi; i++) {
                const row = sortReverse
                    ? filterMapper(filterSet[len - i - 1])
                    : filterMapper(filterSet[i]);
                results.push(row);
            }
            return results.map(this.project(lo, offset, selectedRowsIDX));

        } else if (sortCols) {
            const results = [];
            for (let i = lo, len = data.length; i < len && i < hi; i++) {
                const idx = sortReverse
                    ? sortSet[len - i - 1][0]
                    : sortSet[i][0];
                const row = data[idx];
                results.push(row);
            }
            return results.map(this.project(lo, offset, selectedRowsIDX));
        } else {
            return this.data.slice(lo, hi).map(this.project(lo, offset, selectedRowsIDX));
        }
    }

    // deprecated ?
    get size() {
        return this.filterSet === null
            ? this.data.length
            : this.filterSet.length
    }

    get first() {
        return this.data[0];
    }
    get last() {
        return this.data[this.data.length - 1];
    }
    get rawData() {
        return this.data;
    }

    setStatus(status) {
        this.status = status;
    }

    addRows(rows) {
        // TODO where is this.index ever created ?
        addRowsToIndex(rows, this.index, metadataKeys.IDX);
        this.data = this.data.concat(rows);
    }

    sort(sortCols) {

        const sortSet = this.currentFilter === null
            ? this.sortSet
            : this.filterSet = sortableFilterSet(this.filterSet);

        this.sortRequired = this.currentFilter !== null;

        if (sortReversed(this.sortCols, sortCols, SINGLE_COLUMN)) {
            this.sortReverse = !this.sortReverse;
        } else if (this.sortCols !== null && groupbyExtendsExistingGroupby(sortCols, this.sortCols)) {
            this.sortReverse = false;
            sortExtend(sortSet, this.data, sortCols, this.table.columnMap);
        } else {
            this.sortReverse = false;
            sort(sortSet, this.data, sortCols, this.table.columnMap);
        }

        this.sortCols = sortCols;

    }

    clearFilter() {
        this.currentFilter = null;
        this.filterSet = null;
        if (this.sortRequired) {
            this.sort(this.sortCols);
        }
    }

    filter(filter) {
        const extendsCurrentFilter = extendsFilter(this.currentFilter, filter);
        const fn = filter && functor(this.table.columnMap, filter);
        const { data: rows } = this;
        let [navSet] = this.selectNavigationSet(extendsCurrentFilter && this.filterSet);
        const newFilterSet = [];

        for (let i = 0; i < navSet.length; i++) {
            const rowIdx = navSet === this.filterSet ? navSet[i] : navSet[i][0];
            const row = rows[rowIdx];
            if (fn(row)) {
                newFilterSet.push(rowIdx);
            }
        }

        // recompute selected.rows from selectedRowIDX
        if (this.selectedRowsIDX.length){
            const {selectedRowsIDX, selected} = this;
            selected.rows.length = 0;
            for (let i=0;i<newFilterSet.length;i++){
                const rowIDX = newFilterSet[i];
                if (selectedRowsIDX.includes(rowIDX)){
                    selected.rows.push(i);
                }
            }
        }

        this.filterSet = newFilterSet;
        this.currentFilter = filter;
        if (!extendsCurrentFilter && this.sortRequired) {
            // TODO this might be very expensive for large dataset
            // WHEN DO WE DO THIS - IS THIS CORRECT !!!!!
            this.sort(this.sortCols);
        }
        return newFilterSet.length;

    }

    update(idx, updates) {
        if (this.currentFilter === null && this.sortCols === null) {
            if (idx >= this.range.lo && idx < this.range.hi) {
                return [idx + this.offset, ...projectUpdates(updates)];
            }
        } else if (this.currentFilter === null) {
            const { sortSet } = this;
            for (let i = this.range.lo; i < this.range.hi; i++) {
                const [rowIdx] = sortSet[i];
                if (rowIdx === idx) {
                    return [i + this.offset, ...projectUpdates(updates)];
                }
            }
        } else {
            // sorted AND/OR filtered
            const { filterSet } = this;
            for (let i = this.range.lo; i < this.range.hi; i++) {
                const rowIdx = Array.isArray(filterSet[i]) ? filterSet[i][0] : filterSet[i];
                if (rowIdx === idx) {
                    return [i + this.offset, ...projectUpdates(updates)];
                }
            }
        }
    }

    insert(idx, row) {
        // TODO multi colun sort sort DSC 
        if (this.sortCols === null && this.currentFilter === null) {
            // simplest scenario, row will be at end of sortset ...
            this.sortSet.push([idx, null, null]);
            if (idx >= this.range.hi) {
                // ... row is beyond viewport
                return {
                    size: this.size
                }
            } else {
                // ... row is within viewport
                return {
                    size: this.size,
                    replace: true
                }
            }
        } else if (this.currentFilter === null) {
            // sort only - currently only support single column sorting
            const sortCols = mapSortCriteria(this.sortCols, this.table.columnMap);
            const [[colIdx]] = sortCols;
            const sortRow = [idx, row[colIdx]];
            const sorter = sortBy([[1, 'asc']]); // the sortSet is always ascending
            const sortPos = sortPosition(this.sortSet, sorter, sortRow, 'last-available');
            this.sortSet.splice(sortPos, 0, sortRow);

            // we need to know whether it is an ASC or DSC sort to determine whether row is in viewport
            const viewportPos = this.sortReverse
                ? this.size - sortPos
                : sortPos;

            if (viewportPos >= this.range.hi) {
                return {
                    size: this.size
                }
            } else if (viewportPos >= this.range.lo) {
                return {
                    size: this.size,
                    replace: true
                }
            } else {
                return {
                    size: this.size,
                    offset: this.offset - 1
                }
            }

        } else if (this.sortCols === null) {
            // filter only
            const fn = functor(this.table.columnMap, this.currentFilter);
            if (fn(row)) {
                const navIdx = this.filterSet.length;
                this.filterSet.push(idx);
                if (navIdx >= this.range.hi) {
                    // ... row is beyond viewport
                    return {
                        size: this.size
                    }
                } else if (navIdx >= this.range.lo) {
                    // ... row is within viewport
                    return {
                        size: this.size,
                        replace: true
                    }
                } else {
                    return {
                        size: this.size,
                        offset: this.offset - 1
                    }
                }

            } else {
                return {}
            }
        } else {
            // sort AND filter
            const fn = functor(this.table.columnMap, this.currentFilter);
            if (fn(row)) {
                // TODO what about totalCOunt

                const sortCols = mapSortCriteria(this.sortCols, this.table.columnMap);
                const [[colIdx, direction]] = sortCols; // TODO multi-colun sort
                const sortRow = [idx, row[colIdx]];
                const sorter = sortBy([[1, direction]]); // TODO DSC
                const navIdx = sortPosition(this.filterSet, sorter, sortRow, 'last-available');
                this.filterSet.splice(navIdx, 0, sortRow);

                if (navIdx >= this.range.hi) {
                    // ... row is beyond viewport
                    return {
                        size: this.size
                    }
                } else if (navIdx >= this.range.lo) {
                    // ... row is within viewport
                    return {
                        size: this.size,
                        replace: true
                    }
                } else {
                    return {
                        size: this.size,
                        offset: this.offset - 1
                    }
                }

            } else {
                return {}
            }

        }
    }
}

// TODO need to retain and return any searchText
class SetFilterRowSet extends RowSet {
    constructor(table, columns, columnName, dataRowAllFilters, dataRowTotal) {
        super(table, columns);       
        this.type = DataTypes.FILTER_DATA; 
        this.columnName = columnName;
        this._searchText = null;
        this.dataRowFilter = null;
        this.dataCounts = {
            dataRowTotal,
            dataRowAllFilters,
            dataRowCurrentFilter : 0,
            filterRowTotal : this.data.length,
            filterRowSelected : this.data.length,
            filterRowHidden : 0
        };
        this.sort([['name', 'asc']]);
    }

    createSelectionModel(){
        return new SelectionModel(SelectionModelType.Checkbox);
    }


    clearRange(){
        this.range = {lo:0, hi: 0};
    }
    
    get values() {
        const key = this.table.columnMap['name'];
        return this.filterSet.map(idx => this.data[idx][key])
    }

    // will we ever need this on base rowset ?
    getSelectedValue(idx){
        const {data, sortSet, filterSet} = this;
        if (filterSet){
           const filterEntry= filterSet[idx];
           const rowIDX = typeof filterEntry === 'number'
             ? filterEntry
             : filterEntry[0];
           return data[rowIDX][0];  
           
        } else {
            return sortSet[idx][1];
        }
    }

    setSelectedFromFilter(dataRowFilter) {

        const columnFilter = extractFilterForColumn(dataRowFilter, this.columnName);
        const columnMap = this.table.columnMap;
        const { data, filterSet, sortSet} = this;

        this.dataRowFilter = dataRowFilter;
        
        if (columnFilter){

            const fn = functor(columnMap, overrideColName(columnFilter, 'name'));
            const selectedRows = [];
            const selectedRowsIDX = [];

            if (filterSet){
                for (let i=0;i<filterSet.length;i++){
                    const rowIDX = filterSet[i];
                    if (fn(data[rowIDX])){
                        selectedRows.push(i);
                        selectedRowsIDX.push(rowIDX);
                    }
                }
            } else {
                for (let i=0;i<data.length;i++){
                    const rowIDX = sortSet[i][0];
                    if (fn(data[rowIDX])){
                        selectedRows.push(i);
                        selectedRowsIDX.push(rowIDX);
                    }
                }

            }
          
            this.selected = {rows: selectedRows, focusedIdx: -1, lastTouchIdx: -1 };
            this.selectedRowsIDX = selectedRowsIDX;

        
        } else {

            this.selectAll();    

        }

        return this.currentRange();

    }
}

class BinFilterRowSet extends RowSet {
    constructor(table, columns, columnName) {
        super(table, columns);
        this.type = DataTypes.FILTER_BINS;
        this.columnName = columnName;
    }

    setSelectedFromFilter(filter){
        console.log(`need to apply filter to selected BinRowset`, filter);
    }
    // we don't currently have a concept of range here, but it will
    // be used in the future
    // Note: currently no projection here, we don't currently need metadata
    setRange() {
        const length = this.size;
        return {
            dataType: this.type,
            rows: this.data,
            range: null,
            size: length,
            offset: 0,
            stats: undefined
        };
    }

}

const RANGE_POS_TUPLE_SIZE = 4;
const NO_RESULT = [null,null,null];

const FORWARDS = 0;
const BACKWARDS = 1;

function GroupIterator(groups, navSet, data, NAV_IDX, NAV_COUNT) {
    let _idx = 0;
    let _grpIdx = null;
    let _rowIdx = null;
    let _direction = FORWARDS;
    let _range = NULL_RANGE;
    let _range_position_lo = [0, null, null];
    let _range_positions = [];
    let _range_position_hi = [null, null, null];

    return {
        get direction(){ return _direction },
        get rangePositions(){ return _range_positions }, // do we ever use these ?
        setRange,
        currentRange,
        getRangeIndexOfGroup,
        getRangeIndexOfRow,
        setNavSet,
        refresh: currentRange,
        clear
    };

    function getRangeIndexOfGroup(grpIdx){
        const list = _range_positions;
        for (let i=0; i< list.length; i += RANGE_POS_TUPLE_SIZE){
            if (list[i+1] === grpIdx) {
                if (list[i+2] === null){
                    return i/RANGE_POS_TUPLE_SIZE;
                } else {
                    // first row encountere should be the group, if it
                    // isn't it means it is crolled out of viewport
                    return -1;
                }
            }
        }
        return -1;
    }

    function getRangeIndexOfRow(idx){
        const list = _range_positions;
        for (let i=0; i< list.length; i += RANGE_POS_TUPLE_SIZE){
            if (list[i+3] === idx) {
                return i/RANGE_POS_TUPLE_SIZE;
            }
        }
        return -1
    }

    function clear(){
        _idx = 0;
        _grpIdx = null;
        _rowIdx = null;
        _direction = FORWARDS;
        _range = NULL_RANGE;
        _range_position_lo = [0, null, null];
        _range_positions = [];
        _range_position_hi = [null, null, null];
    }

    function setNavSet([newNavSet, navIdx, navCount]){
        navSet = newNavSet;
        NAV_IDX = navIdx;
        NAV_COUNT = navCount;
    }

    function currentRange(){
        /** @type {import('./group-iterator').RowsIndexTuple} */
        const result = [[], null];
        const [rows] = result;

        const {IDX} = metadataKeys;
        ([_idx, _grpIdx, _rowIdx] = _range_position_lo);
        if (_idx === 0 && _grpIdx === null && _rowIdx === null){
            _idx = -1;
        }
        _range_positions.length = 0;

        let startIdx = _idx;
        let row;
        let i = _range.lo;
        do {
            _direction = FORWARDS;
            ([row, _grpIdx, _rowIdx] = next(groups, data, _grpIdx, _rowIdx, navSet, NAV_IDX, NAV_COUNT));
            if (row){
                rows.push(row);
                _idx += 1;
                const absRowIdx = _rowIdx === null ? null : row[IDX];
                _range_positions.push(_idx, _grpIdx, _rowIdx, absRowIdx);
                i += 1;
            }
        } while (row && i < _range.hi)
        if (row){
            _direction = FORWARDS;
            const [grpIdx, rowIdx] = [_grpIdx, _rowIdx];
            [row, _grpIdx, _rowIdx] = next(groups, data, _grpIdx, _rowIdx, navSet, NAV_IDX, NAV_COUNT);
            _idx += 1;
            _range_position_hi = [row ? _idx : null, _grpIdx, _rowIdx];
            ([_grpIdx, _rowIdx] = [grpIdx, rowIdx]);
        } else {
            _range_position_hi = [null,null,null];
        }

        result[1] = startIdx+1;
        return result;

    }

    function setRange(range, useDelta=true){
        const rangeDiff = compareRanges(_range, range);
        const { lo: resultLo, hi: resultHi } = useDelta ? getDeltaRange(_range, range) : getFullRange(range);
        const {IDX} = metadataKeys;

        /** @type {import('./group-iterator').RowsIndexTuple} */
        const result = [[], null];
        const [rows] = result;
        
        if (rangeDiff === RangeFlags.NULL){
            _range_position_lo = [0,null,null];
            _range_position_hi = [null,null,null];
            _range_positions.length = 0;
            return result;
            
        } else if (range.lo === _range.lo && useDelta === false){
            // when we're asked for the same range again, rebuild the range
            ([_idx, _grpIdx, _rowIdx] = _range_position_lo);
            _range_positions.length = 0;
        } else {

            if (_direction === FORWARDS && (rangeDiff & RangeFlags.BWD)){
                ([_idx, _grpIdx, _rowIdx] = _range_positions);
            } else if (_direction === BACKWARDS && (rangeDiff & RangeFlags.FWD)){
                ([_idx, _grpIdx, _rowIdx] = _range_positions.slice(-RANGE_POS_TUPLE_SIZE));
                _idx += 1;
            }

            if (rangeDiff === RangeFlags.FWD){
                skip(range.lo - _range.hi, next);
                _range_positions.length = 0;
            } else if (rangeDiff === RangeFlags.BWD){
                skip(_range.lo - range.hi, previous);
                _range_positions.length = 0;
            }

            const loDiff = range.lo - _range.lo;
            const hiDiff = _range.hi - range.hi;
            // allow for a range that overshoots data
            const missingQuota = (_range.hi - _range.lo) - _range_positions.length/RANGE_POS_TUPLE_SIZE;

            if (loDiff > 0){
                const removed = _range_positions.splice(0,loDiff*RANGE_POS_TUPLE_SIZE);
                if (removed.length){
                    _range_position_lo = removed.slice(-RANGE_POS_TUPLE_SIZE);

                    // experiment - is this A) always correct B) enough
                    if (useDelta === false){
                        [_idx, _grpIdx, _rowIdx] = _range_position_lo;
                    }

                }
            }
            if (hiDiff > 0){
                //TODO allow for scenatio where both lo and HI have changed
                if (hiDiff > missingQuota){
                    const absDiff = hiDiff - missingQuota;
                    const removed = _range_positions.splice(-absDiff*RANGE_POS_TUPLE_SIZE,absDiff*RANGE_POS_TUPLE_SIZE);
                    if (removed.length){
                        _range_position_hi = removed.slice(0,RANGE_POS_TUPLE_SIZE);
                    }
                }
            }

        }

        let row;
        let startIdx = null;

        if ((rangeDiff & RangeFlags.REDUCE) === 0){
            if ((rangeDiff & RangeFlags.FWD) || (rangeDiff === RangeFlags.SAME)){
                let i = resultLo;
                startIdx = _idx;
                do {
                    _direction = FORWARDS;
                    ([row, _grpIdx, _rowIdx] = next(groups, data, _grpIdx, _rowIdx, navSet, NAV_IDX, NAV_COUNT));
                    if (row){
                        rows.push(row);
                        const absRowIdx = _rowIdx === null ? null : row[IDX];
                        _range_positions.push(_idx, _grpIdx, _rowIdx, absRowIdx);
                        i += 1;
                        _idx += 1;
                    }
                } while (row && i < resultHi)
                if (row){
                    _direction = FORWARDS;
                    const [grpIdx, rowIdx] = [_grpIdx, _rowIdx];
                    ([row, _grpIdx, _rowIdx] = next(groups, data ,_grpIdx, _rowIdx, navSet, NAV_IDX, NAV_COUNT));
                    _range_position_hi = [row ? _idx : null, _grpIdx, _rowIdx];
                    ([_grpIdx, _rowIdx] = [grpIdx, rowIdx]);
                } else {
                    _range_position_hi = [null,null,null];
                }

            } else {
                let i = resultHi - 1;
                do {
                    _direction = BACKWARDS;
                    ([row, _grpIdx, _rowIdx] = previous(groups, data, _grpIdx, _rowIdx, navSet, NAV_IDX, NAV_COUNT));
                    if (row){
                        _idx -= 1;
                        rows.unshift(row);
                        const absRowIdx = _rowIdx === null ? null : row[IDX];
                        _range_positions.unshift(_idx, _grpIdx, _rowIdx, absRowIdx);
                        i -= 1;
                    }
                } while (row && i >= resultLo)
                startIdx = _idx;
                if (row){
                    const [grpIdx, rowIdx] = [_grpIdx, _rowIdx];
                    _direction = BACKWARDS;
                    [row, _grpIdx, _rowIdx] = previous(groups, data, _grpIdx, _rowIdx, navSet, NAV_IDX, NAV_COUNT);
                    _range_position_lo = [row ? _idx-1 : 0, _grpIdx, _rowIdx];
                    ([_grpIdx, _rowIdx] = [grpIdx, rowIdx]);
                } else {
                    _range_position_lo = [0,null,null];
                }

            }

        } else {
            // does startIdx remain as null ?
            // reduced range, adjust the current pos. DIrection can only be a guess, but if it's wrong
            // the appropriate adjustment will be made nest time range is set
            if (rangeDiff & RangeFlags.FWD){
                console.log(`adjust thye idx`);
                ([_idx, _grpIdx, _rowIdx] = _range_positions.slice(-RANGE_POS_TUPLE_SIZE));
                _idx += 1;
            } else {
                ([_idx, _grpIdx, _rowIdx] = _range_positions);
            }
        }

        _range = range;
        result[1] = startIdx;
        return result;
        // return [rows, startIdx];
    }

    function skip(n, fn){

        let i=0;
        let row;

        do {
            [row, _grpIdx, _rowIdx] = fn(groups, data, _grpIdx, _rowIdx, navSet, NAV_IDX, NAV_COUNT);
            if (fn === next){
                _idx += 1;
            } else {
                _idx -= 1;
            }
            i += 1;

        } while (row && i < n)
        if (fn === next){
            _range_position_lo = [_idx-1, _grpIdx, _rowIdx];
        } else {
            _range_position_hi = [_idx, _grpIdx, _rowIdx];
        }
    }

}

function getAbsRowIdx(group, relRowIdx, navSet, NAV_IDX){
    return navSet[group[NAV_IDX] + relRowIdx];
}

function next(groups, rows, grpIdx, rowIdx, navSet, NAV_IDX, NAV_COUNT){
    if (grpIdx === null){
        grpIdx = -1;
        do {
            grpIdx += 1;
        } while (grpIdx < groups.length && (
            (getCount(groups[grpIdx],NAV_COUNT) === 0)
        ));

        if (grpIdx >= groups.length){
            return NO_RESULT;
        } else {
            return [groups[grpIdx], grpIdx, null];
        }
    } else if (grpIdx >= groups.length){
        return NO_RESULT;
    } else {
        let groupRow = groups[grpIdx];
        const depth = groupRow[metadataKeys.DEPTH];
        const count = getCount(groupRow,NAV_COUNT);
        // Note: we're unlikely to be passed the row if row count is zero
        if (depth === 1 && count !== 0 && (rowIdx === null || rowIdx < count - 1)){
            rowIdx = rowIdx === null ? 0 : rowIdx + 1;
            const absRowIdx = getAbsRowIdx(groupRow, rowIdx, navSet, NAV_IDX);
            const row = leafRow(rows[absRowIdx]);
            return [row, grpIdx, rowIdx === null ? 0 : rowIdx];
        } else if (depth > 0){

            do {
                grpIdx += 1;
            } while (grpIdx < groups.length && (
                (getCount(groups[grpIdx],NAV_COUNT) === 0)
            ));
            if (grpIdx >= groups.length){
                return NO_RESULT;
            } else {
                return [groups[grpIdx], grpIdx, null];
            }
        } else {
            const absDepth = Math.abs(depth);
            do {
                grpIdx += 1;
            } while (grpIdx < groups.length && (
                (Math.abs(groups[grpIdx][metadataKeys.DEPTH]) < absDepth) ||
                (getCount(groups[grpIdx],NAV_COUNT) === 0)
            ));
            if (grpIdx >= groups.length){
                return NO_RESULT;
            } else {
                return [groups[grpIdx], grpIdx, null];
            }
        }
    }
}

function previous(groups, data, grpIdx, rowIdx, navSet, NAV_IDX, NAV_COUNT){
    if (grpIdx !== null && groups[grpIdx][metadataKeys.DEPTH] === 1 && typeof rowIdx === 'number'){
        let lastGroup = groups[grpIdx];
        if (rowIdx === 0){
            return [lastGroup, grpIdx, null];
        } else {
            rowIdx -= 1;
            const absRowIdx = getAbsRowIdx(lastGroup, rowIdx, navSet, NAV_IDX);
            const row = leafRow(data[absRowIdx]);
            return [row, grpIdx, rowIdx];
        }
    } else {
        if (grpIdx === null){
            grpIdx = groups.length-1;
        } else if (grpIdx === 0) {
            return NO_RESULT;
        } else {
            grpIdx -= 1;
        }
        let lastGroup = groups[grpIdx];
        if (lastGroup[metadataKeys.DEPTH] === 1){
            rowIdx = getCount(lastGroup, NAV_COUNT) - 1;
            const absRowIdx = getAbsRowIdx(lastGroup, rowIdx, navSet, NAV_IDX);
            const row = leafRow(data[absRowIdx]);
            return [row, grpIdx, rowIdx];
        }
        while (lastGroup[metadataKeys.PARENT_IDX] !== null && groups[lastGroup[metadataKeys.PARENT_IDX]][metadataKeys.DEPTH] < 0){
            grpIdx = lastGroup[metadataKeys.PARENT_IDX];
            lastGroup = groups[grpIdx];
        }
        return [lastGroup, grpIdx, null];
    }
}

const EMPTY_ARRAY = [];

class GroupRowSet extends BaseRowSet {

    constructor(rowSet, columns, groupby, groupState, sortCriteria = null, filter=rowSet.currentFilter) {
        super(rowSet.table, columns, rowSet.baseOffset);
        this.groupby = groupby;
        this.groupState = groupState;
        this.aggregations = [];
        this.currentLength = 0; // TODO
        this.groupRows = [];
        this.aggregatedColumn = {};

        this.collapseChildGroups = this.collapseChildGroups.bind(this);
        this.countChildGroups = this.countChildGroups.bind(this);

        columns.forEach(column => {
            if (column.aggregate) {
                const key = rowSet.table.columnMap[column.name];
                this.aggregations.push([key, column.aggregate]); // why ?
                this.aggregatedColumn[key] = column.aggregate;
            }
        });
        this.expandedByDefault = false;
        this.sortCriteria = Array.isArray(sortCriteria) && sortCriteria.length
            ? sortCriteria
            : null;

        // can we lazily build the sortSet as we fetch data for the first time ?
        this.sortSet = rowSet.data.map((d,i) => i);
        // we will store an array of pointers to parent Groups.mirroring sequence of leaf rows
        this.rowParents = Array(rowSet.data.length);

        this.applyGroupby(groupby);


        const [navSet, IDX, COUNT] = this.selectNavigationSet(false);
        // TODO roll the IDX and COUNT overrides into meta
        this.iter = GroupIterator(this.groupRows, navSet, this.data, IDX, COUNT);

        if (filter){
            this.filter(filter);
        }

    }

    get length() {
        return this.currentLength;
    }
    get first() {
        return this.data[0];
    }
    get last(){
        return this.data[this.data.length - 1];
    }

    currentRange(){
        return this.setRange(this.range, false);
    }

    clearRange(){
        this.iter.clear();
        this.range = NULL_RANGE;
    }

    setRange(range, useDelta=true){
        // A common scenario, eg after groupBy or sort, reposition range at top of viewport
        if (useDelta === false && range.lo === 0){
            this.clearRange();
        }

        const [rowsInRange, idx] = !useDelta && range.lo === this.range.lo && range.hi === this.range.hi
            ? this.iter.currentRange()
            : this.iter.setRange(range, useDelta);

        const filterCount = this.filterSet && metadataKeys.FILTER_COUNT;
        const rows = rowsInRange.map((row,i) => this.cloneRow(row, idx+i, filterCount));
        this.range = range;
        const length = this.length || 0;
        return {
            dataType: this.type,
            rows,
            range,
            size: length,
            offset: this.offset,
            stats: undefined
        };
    }

    cloneRow(row, idx, FILTER_COUNT){
        const {IDX, DEPTH, COUNT} = metadataKeys;
        const dolly = row.slice();
        dolly[IDX] = idx + this.offset;

        if (FILTER_COUNT && dolly[DEPTH] !== 0 && typeof dolly[FILTER_COUNT] === 'number'){
            dolly[COUNT] = dolly[FILTER_COUNT];
        }
        return dolly;
    }

    applyGroupby(groupby, rows=this.data){
        const { columns } = this;
        this.groupRows.length = 0;
        const groupCols = mapSortCriteria(groupby, this.table.columnMap);
        this.groupRows = groupRows(rows, this.sortSet, columns, this.table.columnMap, groupCols, {
            groups: this.groupRows, rowParents: this.rowParents
        });
        this.currentLength = this.countVisibleRows(this.groupRows);
    }

    groupBy(groupby) {

        if (groupbySortReversed(groupby, this.groupby)) {
            this.sortGroupby(groupby);
        } else if (groupbyExtendsExistingGroupby(groupby, this.groupby)) {
            this.extendGroupby(groupby);
            this.currentLength = this.countVisibleRows(this.groupRows, this.filterSet !== null);
        } else if (groupbyReducesExistingGroupby(groupby, this.groupby)) {
            this.reduceGroupby(groupby);
            this.range = NULL_RANGE;
            this.iter.clear();
            this.currentLength = this.countVisibleRows(this.groupRows, this.filterSet !== null);
        } else {
            this.applyGroupby(groupby);
        }
        this.groupby = groupby;

    }

    // User interaction will never produce more than one change, but programatic change might !
    //TODO if we have sortCriteria, apply to leaf rows as we expand
    setGroupState(groupState) {
        // onsole.log(`[groupRowSet.setGroupState] ${JSON.stringify(groupState,null,2)}`)
        const changes = getGroupStateChanges(groupState, this.groupState);
        changes.forEach(([key, ,isExpanded]) => {
            const {groupRows} = this;
            if (key === '*') {
                this.toggleAll(isExpanded);
                this.currentLength = this.countVisibleRows(groupRows, false);
            } else {
                const groupIdx= this.findGroupIdx(key);
                if (groupIdx !== -1){
                    if (isExpanded){
                        this.currentLength += this.expandGroup(groupIdx, groupRows);
                    } else {
                        this.currentLength -= this.collapseGroup(groupIdx, groupRows);
                    }
                } else {
                    console.warn(`setGroupState could not find row to toggle`);
                }
            }
        });
        this.groupState = groupState;
    }

    expandGroup(idx, groups){
        return this.toggleGroup(idx, groups, this.countChildGroups);
    }

    collapseGroup(idx, groups){
        return this.toggleGroup(idx, groups, this.collapseChildGroups);
    }

    toggleGroup(groupIdx, groupRows, processChildGroups){
        const {DEPTH, COUNT, FILTER_COUNT} = metadataKeys;
        let adjustment = 0;
        const groupRow = groupRows[groupIdx];
        const depth = groupRow[DEPTH];
        const useFilter = this.filterSet !== null;
        groupRow[DEPTH] = -depth;
        if (Math.abs(depth) === 1){
            const COUNT_IDX = useFilter ? FILTER_COUNT : COUNT;
            adjustment = groupRow[COUNT_IDX];
        } else {
            adjustment = processChildGroups(Math.abs(depth)-1, groupIdx+1, groupRows, useFilter);
        }
        return adjustment;
    }

    countChildGroups(childDepth, startIdx, groupRows, useFilter){
        const {DEPTH, FILTER_COUNT} = metadataKeys;
        let adjustment = 0;
        for (let i=startIdx; i<groupRows.length; i++){
            const nextDepth = groupRows[i][DEPTH];
            if (Math.abs(nextDepth) === childDepth){
                if (!useFilter || groupRows[i][FILTER_COUNT] > 0){
                    adjustment += 1;
                }
            } else if (Math.abs(nextDepth) > childDepth){
                break;
            }
        }
        return adjustment;
    }

    collapseChildGroups(childDepth, startIdx, groupRows, useFilter){
        const {DEPTH, FILTER_COUNT} = metadataKeys;
        let adjustment = 0;
        for (let i=startIdx; i<groupRows.length; i++){
            const nextDepth = groupRows[i][DEPTH];
            if (Math.abs(nextDepth) === childDepth){
                if (!useFilter || groupRows[i][FILTER_COUNT] > 0){
                    adjustment += 1;
                    if (nextDepth > 0){
                        adjustment += this.collapseGroup(i, groupRows);
                    }
                }
            } else if (Math.abs(nextDepth) > childDepth){
                break;
            }
        }
        return adjustment;
    }

    sort(sortCriteria) {
        const {groupRows: groups} = this;
        const { IDX, DEPTH, COUNT, IDX_POINTER } = metadataKeys;
        this.sortCriteria = Array.isArray(sortCriteria) && sortCriteria.length
            ? sortCriteria
            : null;

        const sortCols = mapSortCriteria(sortCriteria, this.table.columnMap);
        //TODO only need to handle visible rows
        for (let i=0;i<groups.length;i++){
            const groupRow = groups[i];
            const depth = groupRow[DEPTH];
            const count = groupRow[COUNT];
            const absDepth = Math.abs(depth);
            const sortIdx = groupRow[IDX_POINTER];
            if (absDepth === 1){
                this.sortDataSubset(sortIdx, count, sortCols, IDX);

            }
        }
    }

    sortDataSubset(startIdx, length, sortCriteria, IDX){
        const rows = [];
        for (let i=startIdx;i<startIdx+length;i++){
            const rowIdx = this.sortSet[i];
            rows.push(this.data[rowIdx]);
        }
        rows.sort(sortBy(sortCriteria));
        for (let i=0;i<rows.length;i++){
            this.sortSet[i+startIdx] = rows[i][IDX];
        }
    }

    clearFilter(/*cloneChanges*/) {
        this.currentFilter = null;
        this.filterSet = null;
        // rebuild agregations for groups where filter count is less than count, remove filter count
        const { data: rows, groupRows, sortSet, columns } = this;
        const { COUNT, FILTER_COUNT, NEXT_FILTER_IDX } = metadataKeys;
        const aggregations = findAggregatedColumns(columns, this.table.columnMap, this.groupby);

        for (let i=0;i<groupRows.length; i++){
            let groupRow = groupRows[i];
            if (typeof groupRow[FILTER_COUNT] === 'number' && groupRow[COUNT] > groupRow[FILTER_COUNT]){
                aggregateGroup(groupRows, i, sortSet, rows, columns, aggregations);
                groupRow[FILTER_COUNT] = null;
                groupRow[NEXT_FILTER_IDX] = null;
            }
        }

        this.iter.setNavSet(this.selectNavigationSet(false));
        this.currentLength = this.countVisibleRows(groupRows, false);
    }

    filter(filter){
        const extendsCurrentFilter = extendsFilter(this.currentFilter, filter);
        const fn = filter && functor(this.table.columnMap, filter);
        const { COUNT, DEPTH, PARENT_IDX, FILTER_COUNT, NEXT_FILTER_IDX } = metadataKeys;
        const { data: rows, groupRows: groups } = this;
        let [navSet, NAV_IDX, NAV_COUNT] = this.selectNavigationSet(extendsCurrentFilter && this.filterSet);
        const newFilterSet= [];

        for (let i=0;i<groups.length; i++){
            let groupRow = groups[i];
            const depth = groupRow[DEPTH];
            const count = getCount(groupRow,NAV_COUNT, COUNT);
            const absDepth = Math.abs(depth);

            if (absDepth === 1){
                const sortIdx = groupRow[NAV_IDX];
                let rowCount = 0;

                for (let ii=sortIdx; ii<sortIdx+count; ii++){
                    const rowIdx = navSet[ii];
                    const row = rows[rowIdx];
                    const includerow = fn(row);
                    if (includerow) {
                        rowCount += 1;
                        if (rowCount === 1){
                            groupRow[NEXT_FILTER_IDX] = newFilterSet.length;
                        }
                        newFilterSet.push(rowIdx);
                    }
                }

                groupRow[FILTER_COUNT] = rowCount;
                let aggregations = EMPTY_ARRAY;
                // we cannot be sure what filter changes have taken effect, so we must recalculate aggregations
                if (this.aggregations.length){
                    aggregations = this.aggregations.map(([i, a]) => [i,a,0]);
                    const len = newFilterSet.length;
                    for (let ii=len-rowCount;ii<len;ii++){
                        const rowIdx = newFilterSet[ii];
                        const row = rows[rowIdx];
                        for (let j = 0; j < aggregations.length; j++) {
                            let [colIdx] = aggregations[j];
                            aggregations[j][2] += row[colIdx];
                        }
                    }
                    
                    // 2) store aggregates at lowest level of the group hierarchy
                    aggregations.forEach(aggregation => {
                        const [colIdx, type, sum] = aggregation;
                        const dataIdx =colIdx +  metadataKeys.count - 2; // <<<<<<<<<<<
                        if (type === 'sum') {
                            groupRow[dataIdx] = sum;
                        } else if (type === 'avg') {
                            groupRow[dataIdx] = sum / rowCount;
                        }
                    });
                }

                // update parent counts
                if (rowCount > 0){
                    while (groupRow[PARENT_IDX] !== null){
                        groupRow = groups[groupRow[PARENT_IDX]];

                        aggregations.forEach(aggregation => {
                            const [colIdx, type, sum] = aggregation;
                            const dataIdx =colIdx +  metadataKeys.count - 2; // <<<<<<<<<<<
                            if (type === 'sum') {
                                groupRow[dataIdx] += sum;
                            } else if (type === 'avg') {
                                const originalCount = groupRow[FILTER_COUNT];
                                const originalSum = originalCount * groupRow[dataIdx];
                                groupRow[dataIdx] = (originalSum + sum) / (originalCount + rowCount);
                            }
                        });
                        groupRow[FILTER_COUNT] += rowCount;
                    }
                }

            } else {
                // Higher-level group aggregations are calculated from lower level groups
                // initialize aggregated columns
                groupRow[FILTER_COUNT] = 0;
                this.aggregations.forEach(aggregation => {
                    const [colIdx] = aggregation;
                    const dataIdx =colIdx +  metadataKeys.count - 2; // <<<<<<<<<<<
                    groupRow[dataIdx] = 0;
                });
            }
        }
        this.filterSet = newFilterSet;
        this.currentFilter = filter;
        this.currentLength = this.countVisibleRows(this.groupRows, true);

        this.iter.setNavSet(this.selectNavigationSet(true));

    }

    update(rowIdx, updates){
        const {groupRows: groups, offset, rowParents, range: {lo}} = this;
        const { COUNT, FILTER_COUNT, PARENT_IDX } = metadataKeys;

        let groupUpdates;
        const rowUpdates = [];

        for (let i = 0; i < updates.length; i += 3) {
            // the col mappings in updates refer to base column definitions
            const colIdx = updates[i];
            const dataIdx =colIdx +  metadataKeys.count - 2; // <<<<<<<<<<<

            const originalValue = updates[i + 1];
            const value = updates[i + 2];
            rowUpdates.push(dataIdx,originalValue,value);

            let grpIdx = rowParents[rowIdx];
            // this seems to return 0 an awful lot
            let ii = 0;
            
            // If this column is being aggregated
            if (this.aggregatedColumn[colIdx]){

                groupUpdates = groupUpdates || [];
                // collect adjusted aggregations for each group level
                do {
                    let groupRow = groups[grpIdx];
                    let originalGroupValue = groupRow[dataIdx];
                    const diff = value - originalValue;
                    const type = this.aggregatedColumn[colIdx];
                    if (type === 'sum'){
                        // ... wnd in the groupRow we have a further offset of 2 ...
                        groupRow[dataIdx] += diff;// again with the +2
                    } else if (type === 'avg'){
                        const count = getCount(groupRow, FILTER_COUNT, COUNT);
                        groupRow[dataIdx] = ((groupRow[dataIdx] * count) + diff) / count;
                    }

                    (groupUpdates[ii] || (groupUpdates[ii]=[grpIdx])).push(dataIdx, originalGroupValue, groupRow[dataIdx]);

                    grpIdx = groupRow[PARENT_IDX];
                    ii += 1;

                } while (grpIdx !== null)

            }
        }

        const outgoingUpdates = [];
        // check rangeIdx for both row and group updates, if they are not in range, they have not been
        // sent to client and do not need to be added to outgoing updates
        if (groupUpdates){
            // the groups are currently in reverse order, lets send them out outermost group first
            for (let i=groupUpdates.length-1; i >=0; i--){
                const [grpIdx, ...updates] = groupUpdates[i];
                // won't work - need to chnage groupIterator
                const rangeIdx = this.iter.getRangeIndexOfGroup(grpIdx);
                if (rangeIdx !== -1){
                    outgoingUpdates.push([lo+rangeIdx+offset, ...updates]);
                }
            }
        }
        const rangeIdx = this.iter.getRangeIndexOfRow(rowIdx);
        if (rangeIdx !== -1){
            // onsole.log(`[GroupRowSet.update] updates for row idx ${idx} ${rangeIdx+offset} ${JSON.stringify(rowUpdates)}`)
            outgoingUpdates.push([lo+rangeIdx+offset, ...rowUpdates]);
        }
        
        return outgoingUpdates;
    }

    insert(newRowIdx, row){
        // TODO look at append and idx manipulation for insertion at head.
        const { groupRows: groups, groupby, data: rows, sortSet, columns, iter: iterator } = this;

        let dataGroupCols = mapSortCriteria(groupby, this.table.columnMap, metadataKeys.count - 2); // <<<<<<<<<
        const groupPositions = findGroupPositions(groups, dataGroupCols, leafRow(row));

        const {IDX, COUNT, KEY, IDX_POINTER} = metadataKeys;
        const GROUP_KEY_SORT = [[KEY, 'asc']];
        const allGroupsExist = groupPositions.length === groupby.length;
        const noGroupsExist = groupPositions.length === 0;
        const someGroupsExist = !noGroupsExist && !allGroupsExist;
        let result;
        let newGroupIdx = null;

        if (allGroupsExist){
            // all necessary groups are already in place, we will just insert a row and update counts/aggregates
            let grpIdx = groupPositions[groupPositions.length-1];
            const groupRow = groups[grpIdx];
            this.rowParents[newRowIdx] = grpIdx;
            let count = groupRow[COUNT];

            const insertionPoint = groupRow[IDX_POINTER] + count;
            // all existing pointers from the insertionPoint forward are going to be displaced by +1
            adjustLeafIdxPointers(groups, insertionPoint);
            sortSet.splice(insertionPoint,0,row[IDX]);
            if (allGroupsExpanded(groups, groupRow)){
                this.currentLength += 1;
            }
            
        } else {
            let groupCols = mapSortCriteria(groupby, this.table.columnMap);
            newGroupIdx = sortPosition(groups, sortBy(GROUP_KEY_SORT), expandRow(groupCols, row, metadataKeys), 'last-available');
            sortSet.push(newRowIdx);
            let nestedGroups, baseGroupby, rootIdx;

            if (someGroupsExist){
                baseGroupby = groupCols.slice(0,groupPositions.length);
                rootIdx = groups[groupPositions[groupPositions.length-1]][IDX];
                groupCols = groupCols.slice(groupPositions.length);
            }

            nestedGroups = groupRows(rows, sortSet, columns, this.table.columnMap, groupCols, {
                startIdx: sortSet.length - 1, length: 1, groupIdx: newGroupIdx-1,
                baseGroupby, rootIdx
            });

            adjustGroupIndices(groups, newGroupIdx, nestedGroups.length);
            groups.splice.apply(groups,[newGroupIdx,0].concat(nestedGroups));
        }

        // Note: we update the aggregates 
        this.updateAggregatedValues(groupPositions, row);
        this.incrementGroupCounts(groupPositions);

        iterator.refresh(); // force iterator to rebuild rangePositions
        let rangeIdx = allGroupsExist
            ? iterator.getRangeIndexOfRow(newRowIdx)
            : iterator.getRangeIndexOfGroup(newGroupIdx);
        
        if (rangeIdx !== -1){
            // New row is visible within viewport so we will force render all rows
            result = {replace: true};
            if (newGroupIdx !== null){
                this.currentLength += 1;
            }
        } else if (noGroupsExist === false){
            // new row is not visible as group is collapsed, but we need to update groiup row(s)
            result = {updates: this.collectGroupUpdates(groupPositions)};
        }

        return result;
    }

    incrementGroupCounts(groupPositions){
        const {groupRows} = this;
        const {COUNT} = metadataKeys;
        groupPositions.forEach(grpIdx => {
            const group = groupRows[grpIdx];
            group[COUNT] += 1;
        });
    }

    updateAggregatedValues(groupPositions, row){
        const { groupRows } = this;

        groupPositions.forEach(grpIdx => {
            const groupRow = groupRows[grpIdx];
            for (let [colIdx, type] of this.aggregations){
                const value = row[colIdx];
                const dataIdx =colIdx +  metadataKeys.count - 2; // <<<<<<<<<<<
                const groupValue = groupRow[dataIdx];
                if (type === 'sum'){
                    groupRow[dataIdx] = groupValue + value;
                } else if (type === 'avg'){
                    const originalCount = groupRow[metadataKeys.COUNT]; // do we need to consider the FILTER_COUNT ?
                    const originalSum = originalCount * groupRow[dataIdx];
                    groupRow[dataIdx] = (originalSum + value) / (originalCount + 1);

                }
            }
        });

    }

    collectGroupUpdates(groupPositions){
        const {aggregations, groupRows: groups, offset} = this;
        const {COUNT} = metadataKeys;
        const updates = [];
        for (let grpIdx of groupPositions){
            const rangeIdx = this.iter.getRangeIndexOfGroup(grpIdx);
            if (rangeIdx !== -1){
                const group = groups[grpIdx];
                const update = [rangeIdx+offset, COUNT, group[COUNT]];
                for (let [colIdx] of aggregations){
                    const dataIdx =colIdx +  metadataKeys.count - 2; // <<<<<<<<<<<
                    update.push(dataIdx, group[dataIdx]);
                }
                updates.push(update);
            }
        }
        return updates;
    }



    // start with a simplesequential search
    findGroupIdx(groupKey){
        const {groupRows} = this;
        for (let i=0;i<groupRows.length;i++){
            if (groupRows[i][metadataKeys.KEY] === groupKey){
                return i;
            }
        }
        return -1;
    }

    //TODO simple implementation first
    toggleAll(isExpanded) {
        const sign = isExpanded ? 1 : -1;
        // iterate groupedRows and make every group row depth positive,
        // Then visible rows is not going to be different from grouped rows
        const {DEPTH} = metadataKeys;
        const { groupRows: groups } = this;
        this.expandedByDefault = isExpanded;
        for (let i = 0, len = groups.length; i < len; i++) {
            const depth = groups[i][DEPTH];
            // if (depth !== 0) {
            groups[i][DEPTH] = Math.abs(depth) * sign;
            // }
        }
    }

    sortGroupby(groupby){
        const { IDX, KEY, DEPTH, IDX_POINTER, PARENT_IDX } = metadataKeys;
        const {groupRows} = this;
        const groupCols = mapSortCriteria(groupby, this.table.columnMap, metadataKeys.count - 2);
        const [colIdx, depth] = findSortedCol(groupby, this.groupby);
        let count = 0;
        let i=0;
        for (;i<groupRows.length;i++){
            if (Math.abs(groupRows[i][DEPTH]) > depth){
                if (count > 0){
                    this.sortGroupRowsSubset(groupCols, colIdx, i-count, count);
                    count = 0;
                }
            } else {
                count += 1;
            }
        }

        this.sortGroupRowsSubset(groupCols, colIdx, i-count, count);

        const tracker = new SimpleTracker(groupby.length);
        this.groupRows.forEach((groupRow,i) => {
            const depth = groupRow[DEPTH];
            const groupKey = groupRow[KEY];
            const absDepth = Math.abs(depth);
            tracker.set(absDepth, i, groupKey);
            groupRow[IDX] = i;
            if (absDepth > 1){
                groupRow[IDX_POINTER] = i+1;
            }
            if (tracker.hasParentPos(absDepth)){
                groupRow[PARENT_IDX] = tracker.parentPos(absDepth);
            }
        });
    }

    sortGroupRowsSubset(groupby, colIdx, startPos=0, length=this.groupRows.length){
        const {groupRows} = this;
        let insertPos = startPos + length;
        const [groupColIdx, direction] = groupby[colIdx];
        const before = (k1, k2) => direction === ASC ? k2 > k1 : k1 > k2;
        const after = (k1, k2) => direction === ASC ? k2 < k1 : k1 < k2;
        let currentKey = null;
        for (let i=startPos;i<startPos+length;i++){
            const key = groupRows[i][groupColIdx];
            if (currentKey === null){
                currentKey = key;
            } else if (before(key,currentKey)){
                const splicedRows = groupRows.splice(startPos,i-startPos);
                insertPos -= splicedRows.length;
                groupRows.splice.apply(groupRows, [insertPos,0].concat(splicedRows));
                currentKey = key;
                i = startPos-1;
            } else if (after(key,currentKey)){
                break;
            }
        }
    }

    // there is a current assumption here that new col(s) are always added at the end of existing cols in the groupBy
    // Need to think about a new col inserted at start or in between existing cols 
    //TODO we might want to do this on expanded nodes only and repat in a lazy fashion as more nodes are revealed
    extendGroupby(groupby) {
        const groupCols = mapSortCriteria(groupby, this.table.columnMap);
        const baseGroupCols = groupCols.slice(0, this.groupby.length);
        const newGroupbyClause = groupCols.slice(this.groupby.length);
        const {groupRows: groups, groupby: baseGroupby, data: rows, columns, sortSet, filterSet} = this;
        const { IDX_POINTER, PARENT_IDX, NEXT_FILTER_IDX } = metadataKeys;
        const baseLevels = baseGroupby.length;
        const tracker = new GroupIdxTracker(baseLevels-1);
        const filterFn = this.currentFilter
            ? functor(this.table.columnMap, this.currentFilter)
            : null;

        // we are going to insert new rows into groupRows and update the PARENT_IDX pointers in data rows
        for (let i=0;i<groups.length;i++){
            const groupRow = groups[i];
            if (tracker.idxAdjustment){
                groupRow[metadataKeys.IDX] += tracker.idxAdjustment;
            }

            const rootIdx = groupRow[metadataKeys.IDX];
            const depth = groupRow[metadataKeys.DEPTH];
            const length = groupRow[metadataKeys.COUNT];
            const groupKey = groupRow[metadataKeys.KEY];

            const absDepth = Math.abs(depth);
            groupRow[metadataKeys.DEPTH] = incrementDepth(depth);
            const filterLength = groupRow[metadataKeys.FILTER_COUNT];
            const filterIdx = groupRow[NEXT_FILTER_IDX];
            groupRow[metadataKeys.NEXT_FILTER_IDX] = undefined;

            if (tracker.hasPrevious(absDepth+1)){
                groupRow[PARENT_IDX] += tracker.previous(absDepth+1);
            }

            if (absDepth === 1){
                const startIdx = groupRow[IDX_POINTER];
                const nestedGroupRows = groupRows(rows, sortSet, columns, this.table.columnMap, newGroupbyClause, {
                    startIdx,
                    length,
                    rootIdx,
                    baseGroupby: baseGroupCols,
                    groupIdx: rootIdx,
                    filterIdx,
                    filterLength,
                    filterSet,
                    filterFn,
                    rowParents: this.rowParents
                });
                const nestedGroupCount = nestedGroupRows.length;
                // this might be a performance problem for large arrays, might need to concat
                groups.splice(i+1,0, ...nestedGroupRows);
                i += nestedGroupCount;
                tracker.increment(nestedGroupCount);
            } else {
                tracker.set(absDepth, groupKey);
            }
            // This has to be a pointer into sortSet NOT rows
            groupRow[IDX_POINTER] = rootIdx+1;
        }
    }

    reduceGroupby(groupby) {
        const { groupRows: groups, filterSet } = this;
        const [doomed] = findDoomedColumnDepths(groupby, this.groupby);
        const groupCols = mapSortCriteria(this.groupby, this.table.columnMap);
        const [lastGroupIsDoomed, baseGroupby, addGroupby] = splitGroupsAroundDoomedGroup(groupCols, doomed);
        const { IDX, DEPTH, KEY, IDX_POINTER, PARENT_IDX, NEXT_FILTER_IDX } = metadataKeys;
        const tracker = new GroupIdxTracker(groupby.length);
        const useFilter = filterSet !== null;
        let currentGroupIdx = null;
        let i = 0;
        for (let len=groups.length;i<len;i++){
            const groupRow = groups[i];
            const depth = groupRow[DEPTH];
            const groupKey = groupRow[KEY];
            const absDepth = Math.abs(depth);

            if (absDepth === doomed){
                this.reParentLeafRows(i, currentGroupIdx);
                groups.splice(i,1);
                i -= 1;
                len -= 1;
                tracker.increment(1);
            } else {
                if (absDepth > doomed){
                    tracker.set(absDepth,groupKey);
                    if (absDepth === doomed + 1){
                        if (lastGroupIsDoomed){
                            // our pointer will no longer be to a child group but (via the sortSet) to the data.
                            // This can be taken from the first child group (which will be removed)
                            groupRow[IDX_POINTER] = lowestIdxPointer(groups, IDX_POINTER, DEPTH, i+1, absDepth-1);
                            groupRow[NEXT_FILTER_IDX] = useFilter ? lowestIdxPointer(groups, NEXT_FILTER_IDX, DEPTH, i+1, absDepth-1) : undefined;
                        } else if (currentGroupIdx !== null){
                            const diff = this.regroupChildGroups(currentGroupIdx, i, baseGroupby, addGroupby);
                            i -= diff;
                            len -= diff;
                            tracker.increment(diff);
                        }
                    }
                    currentGroupIdx = i;
                    if (tracker.hasPrevious(absDepth+1)){
                        groupRow[PARENT_IDX] -= tracker.previous(absDepth+1);
                    }
                    groupRow[DEPTH] = decrementDepth(depth);
                }
                if (tracker.idxAdjustment > 0){
                    groupRow[IDX] -= tracker.idxAdjustment;
                    if (Math.abs(groupRow[DEPTH]) > 1){
                        groupRow[IDX_POINTER] -= tracker.idxAdjustment;
                    }
                }
            }
        }
        if (!lastGroupIsDoomed){
            // don't forget the final group ...
            this.regroupChildGroups(currentGroupIdx, i, baseGroupby, addGroupby);
        }
    }

    reParentLeafRows(groupIdx, newParentGroupIdx){
        // TODO what about filterSet ?
        const {groupRows: groups, rowParents, sortSet} = this;
        const {IDX_POINTER, COUNT} = metadataKeys;
        const group = groups[groupIdx];
        const idx = group[IDX_POINTER];
        const count = group[COUNT];

        for (let i=idx; i< idx+count; i++){
            const rowIdx = sortSet[i];
            rowParents[rowIdx] = newParentGroupIdx; 
        }

    }

    regroupChildGroups(currentGroupIdx, nextGroupIdx, baseGroupby, addGroupby){
        const { groupRows: groups, data: rows, columns } = this;
        const { COUNT, IDX_POINTER } = metadataKeys;
        const group = groups[currentGroupIdx];
        const length = group[COUNT];
        const startIdx = groups[currentGroupIdx+1][IDX_POINTER];
        // We don't really need to go back to rows to regroup, we have partially grouped data already
        // we could perform the whole operation within groupRows
        const nestedGroupRows = groupRows(rows, this.sortSet, columns, this.table.columnMap, addGroupby, {
            startIdx,
            length,
            rootIdx: currentGroupIdx,
            baseGroupby,
            groupIdx: currentGroupIdx,
            rowParents: this.rowParents
        });
        const existingChildNodeCount = nextGroupIdx - currentGroupIdx - 1;
        groups.splice(currentGroupIdx+1,existingChildNodeCount,...nestedGroupRows);
        group[IDX_POINTER] = currentGroupIdx+1;
        return existingChildNodeCount - nestedGroupRows.length;

    }

    // Note: this assumes no leaf rows visible. Is that always valid ?
    // NOt after removing a groupBy ! Not after a filter
    countVisibleRows(groupRows, usingFilter=false){
        const {DEPTH, COUNT, FILTER_COUNT} = metadataKeys;
        let count = 0;
        for (let i=0, len=groupRows.length;i<len;i++){
            const zeroCount = usingFilter && groupRows[i][FILTER_COUNT] === 0;
            if (!zeroCount){
                count += 1;
            }
            const depth = groupRows[i][DEPTH];
            if (depth < 0 || zeroCount){
                while (i<len-1 && Math.abs(groupRows[i+1][DEPTH]) < -depth){
                    i += 1;
                }
            } else if (depth === 1){
                count += (usingFilter ? groupRows[i][FILTER_COUNT] : groupRows[i][COUNT]);
            }
        }
        return count;
    }

}

/*
    Inserts (and size records) and updates must be batched separately. Because updates are 
    keyed by index position and index positions may be affected by an insert operation, the
    timeline must be preserved. Updates can be coalesced until an insert is received. Then
    the update batch must be closed, to be followed by the insert(s). Similarly, multiple
    inserts, with no interleaved updates, can be batched (with a single size record). The batch
    will be closed as soon as the next update is received. So we alternate between update and
    insert processing, with each transition athe preceeding batch is closed off.
    An append is a simple insert that has no re-indexing implications.  

*/
class UpdateQueue {

    constructor(){
        this._queue = [];
    }

      get length() { return this._queue.length; }

      update(update) {
          //TODO we could also coalesce updates into an insert or rowset, if present
          const batch = this.getCurrentBatch('update');

          const [rowIdx] = update;
          const {updates} = batch;

          for (let i = 0, len = updates.length; i < len; i++) {
              if (updates[i][0] === rowIdx) {
                  // we already have an update for this item, update the update...
                  let d = updates[i];
                  for (let colIdx = 1; colIdx < update.length; colIdx += 2) {
                      const pos = d.indexOf(update[colIdx]);
                      if (pos === -1) {// should check that it is really a colIdx,not a value
                          d.push(update[colIdx], update[colIdx + 1]);
                      } else {
                          d[pos + 1] = update[colIdx + 1];
                      }
                  }

                  return;
              }
          }
          updates.push(update);
      }

      resize(size) {
          const batch = this.getCurrentBatch('size');
          batch.size = size;
      }

      append(row, offset) {
          const batch = this.getCurrentBatch('insert');
          //onsole.log(`UpdateQueue append ${row[0]}`);
          batch.rows.push(row);
          batch.offset = offset;
      }

      replace({rows, filter, size, range, offset}) {
          const batch = this.getCurrentBatch('rowset');
          batch.rows = rows;
          batch.size = size;
          batch.range = range;
          batch.offset = offset;
          // HM, think we should fire an immediate response for filter change
          batch.filter = filter;
      }

      popAll() {
          const results = this._queue;
          this._queue = [];
          return results;
      }

      getCurrentBatch(type) {

          const q = this._queue;
          const len = q.length;

          let batch = len === 0 || type === 'rowset'
              ? (q[0] = createBatch(type))
              : q[len - 1];

          if (batch.type !== type) {
              // roll size recored into subsequent insert 
              if (type === 'insert' && batch.type === 'size') {
                  batch.type = 'insert';
                  batch.rows = [];
              } else if (type === 'size' && batch.type === 'insert') ; else {
                  batch = (q[len] = createBatch(type));
              }
          }

          return batch;

      }
  }

function createBatch(type) {
    switch (type) {
    case 'rowset': return { type, rows: [] };
    case 'update': return { type, updates: [] };
    case 'insert': return { type, rows: [] };
    case 'size': return { type };
    default: throw Error('Unknown batch type');
    }
}

const DEFAULT_INDEX_OFFSET = 100;
const WITH_STATS = true;
class DataStore {

    constructor(table, { columns = [], sortCriteria = null, groupBy = null, filter = null }, updateQueue = new UpdateQueue()) {
        this._table = table;
        this._index_offset = DEFAULT_INDEX_OFFSET;
        this._filter = filter;
        this._groupState = null;
        this._sortCriteria = sortCriteria;

        this._columns = null;
        this._columnMap = null;
        // column defs come from client, this is where we assign column keys
        this.columns = columns;

        this._groupby = groupBy;
        this._update_queue = updateQueue;

        this.reset = this.reset.bind(this);
        this.rowUpdated = this.rowUpdated.bind(this);
        this.rowsUpdated = this.rowsUpdated.bind(this);
        this.rowInserted = this.rowInserted.bind(this);

        this.reset();

        table.on('ready', this.reset);
        table.on('rowUpdated', this.rowUpdated);
        table.on('rowsUpdated', this.rowsUpdated);
        table.on('rowInserted', this.rowInserted);

    }

    // Set the columns from client
    set columns(columns) {
        this._columns = columns.map(toColumn);
        this._columnMap = buildColumnMap(this._columns);
    }

    destroy() {
        this._table.removeListener('rowUpdated', this.rowUpdated);
        this._table.removeListener('rowInserted', this.rowInserted);
        this._table = null;
        this.rowSet = null;
        this.filterRowSet = null;
        this._update_queue = null;
    }

    get status() {
        return this._table.status;
    }

    reset(){
        const {_table: table, _groupby: groupBy, rowSet} = this;

        let range = rowSet ? rowSet.range : null;

        // TODO we should pass columns into the rowset as it will be needed for computed columns
        this.rowSet = new RowSet(table, this._columns, this._index_offset);
        // Is one filterRowset enough, or should we manage one for each column ?
        this.filterRowSet = null;

        // What if data is BOTH grouped and sorted ...
        if (groupBy !== null) {
            // more efficient to compute this directly from the table projection
            this.rowSet = new GroupRowSet(this.rowSet, this._columns, this._groupby, this._groupState);
        } else if (this._sortCriteria !== null) {
            this.rowSet.sort(this._sortCriteria);
        }

        if (range){
            const result = this.setRange(range, false);
            console.log(result);
            this._update_queue.replace(result);

        }

    }

    rowInserted(event, idx, row) {
        const { _update_queue, rowSet } = this;
        const { size = null, replace, updates } = rowSet.insert(idx, row);
        if (size !== null) {
            _update_queue.resize(size);
        }
        if (replace) {
            const { rows, size, offset } = rowSet.currentRange();
            _update_queue.replace({rows, size, offset, filter: undefined, range:undefined});
        } else if (updates) {
            updates.forEach(update => {
                _update_queue.update(update);
            });

        }
        // what about offset change only ?
    }

    rowUpdated(event, idx, updates) {
        const { rowSet, _update_queue } = this;
        const result = rowSet.update(idx, updates);

        if (result) {
            if (rowSet instanceof RowSet) {
                _update_queue.update(result);
            } else {
                result.forEach(rowUpdate => {
                    _update_queue.update(rowUpdate);
                });
            }
        }
    }

    rowsUpdated(event, updates, doNotPublish) {
        const { rowSet, _update_queue } = this;
        const results = [];
        for (let i=0;i<updates.length; i++){
            const [idx, ...updatedValues] = updates[i];
            const result = rowSet.update(idx, updatedValues);
            if (result) {
                if (rowSet instanceof RowSet) {
                    results.push(result);
                } else {
                    result.forEach(rowUpdate => {
                        results.push(rowUpdate);
                    });
                }
            }
        }

        if (results.length > 0 && doNotPublish !== true){
            _update_queue.update(results);
        }

    }

    getData(dataType) {
        return dataType === DataTypes.ROW_DATA
            ? this.rowSet
            : dataType === DataTypes.FILTER_DATA
                ? this.filterRowSet
                : null;
    }

    //TODO we seem to get a setRange when we reverse sort order, is that correct ?
    setRange(range, useDelta = true, dataType = DataTypes.ROW_DATA) {
        return this.getData(dataType).setRange(range, useDelta);
    }

    select(idx, rangeSelect, keepExistingSelection, dataType=DataTypes.ROW_DATA){
        const rowset = this.getData(dataType);
        const updates = rowset.select(idx, rangeSelect, keepExistingSelection);
        if (dataType === DataTypes.ROW_DATA){
            return this.selectResponse(updates, dataType, rowset);
        } else {
            console.log(`[dataView] select on filterSet (range ${JSON.stringify(rowset.range)})`);
            // we need to handle this case here, as the filter we construct depends on the selection details
            // TODO we shouldn't be using the sortSet here, need an API method
            const value = rowset.getSelectedValue(idx);
            const isSelected = rowset.selected.rows.includes(idx);
            const filter = {
                type: isSelected ? IN : NOT_IN,
                colName: rowset.columnName,
                values: [value]
            };
            this.applyFilterSetChangeToFilter(filter);

            if (updates.length > 0){
                return {
                    dataType,
                    updates,
                    stats: rowset.stats
                }
            }
        }
    }

    selectAll(dataType=DataTypes.ROW_DATA){
        const rowset = this.getData(dataType);
        return this.selectResponse(rowset.selectAll(), dataType, rowset, true);
    }

    selectNone(dataType=DataTypes.ROW_DATA){
        const rowset = this.getData(dataType);
        return this.selectResponse(rowset.selectNone(), dataType, rowset, false);
    }

    // Handle response to a selecAll / selectNode operation. This may be operating on
    // the entire resultset, or a filtered subset
    selectResponse(updates, dataType, rowset, allSelected){
        const updatesInViewport = updates.length > 0;
        const {stats} = rowset;
        if (dataType === DataTypes.ROW_DATA){
            if (updatesInViewport){
                return {updates};
            }
        } else {
            const {totalRowCount, totalSelected} = stats;

            // Maybe defer the filter operation ?
            if (totalSelected === 0){
                this.applyFilterSetChangeToFilter({colName: rowset.columnName, type: IN, values: []});
            } else if (totalSelected === totalRowCount){
                this.applyFilterSetChangeToFilter({colName: rowset.columnName, type: NOT_IN, values: []});
            } else {
                // we are not operating on the whole dataset, therefore it is a filtered subset
                if (allSelected){
                    this.applyFilterSetChangeToFilter({colName: rowset.columnName, type: IN, values: rowset.values});
                } else {
                    this.applyFilterSetChangeToFilter({colName: rowset.columnName, type: NOT_IN, values: rowset.values});
                }
            }

            // always return, as the stats might be needed
            // if (updatesInViewport){
                return {
                    dataType,
                    updates,
                    stats: rowset.stats
                }
            // }
        }
    }
    
    sort(sortCriteria) {
        this._sortCriteria = sortCriteria;
        this.rowSet.sort(sortCriteria);
        // assuming the only time we would not useDelta is when we want to reset ?
        return this.setRange(resetRange(this.rowSet.range), false);
    }

    // filter may be called directly from client, in which case changes should be propagated, where
    // appropriate, to any active filterSet(s). However, if the filterset has been changed, e.g. selection
    // within a set, then filter applied here in consequence must not attempt to reset the same filterSet
    // that originates the change. 
    filter(filter, dataType="rowData", incremental=false, ignoreFilterRowset=false) {
        if (dataType === DataTypes.FILTER_DATA){

            return [undefined,this.filterFilterData(filter)];
        
        } else {
            if (incremental){
                filter = addFilter(this._filter, filter);
            }
            const { rowSet, _filter, filterRowSet } = this;
            const { range } = rowSet;
            this._filter = filter;
            let filterResultset;
    
            if (filter === null && _filter) {
                rowSet.clearFilter();
            } else if (filter){
                this.rowSet.filter(filter);
            } else {
                throw Error(`InMemoryView.filter setting null filter when we had no filter anyway`);
            }
    
            if (filterRowSet && dataType === DataTypes.ROW_DATA && !ignoreFilterRowset) {
                if (filter){
                    if (filterRowSet.type === DataTypes.FILTER_DATA){
                        filterResultset = filterRowSet.setSelectedFromFilter(filter);
                    } else if (filterRowSet.type === DataTypes.FILTER_BINS){
                        this.filterRowSet = rowSet.getBinnedValuesForColumn({name:this.filterRowSet.columnName});
                        filterResultset = this.filterRowSet.setRange();
                    }
                } else {
                    // TODO examine this. Must be a more efficient way to reset counts in filterRowSet
                    const {columnName, range} = filterRowSet;
                    this.filterRowSet = rowSet.getDistinctValuesForColumn({name:columnName});
                    filterResultset = this.filterRowSet.setRange(range, false);
                }
            }
    
            const resultSet = {
                ...(this.rowSet.setRange(resetRange(range), false)),
                filter
            };
    
            return filterResultset
                ? [resultSet, filterResultset]
                : [resultSet];
        }

    }

    //TODO merge with method above
    filterFilterData(filter){
        const {filterRowSet} = this;
        if (filterRowSet){

            if (filter === null) {
                filterRowSet.clearFilter();
            } else if (filter){
                filterRowSet.filter(filter);
            }

            return filterRowSet.setRange(resetRange(filterRowSet.range), false, WITH_STATS);
    
        } else {
            console.error(`[InMemoryView] filterfilterRowSet no filterRowSet`);
        }

    }

    applyFilterSetChangeToFilter(partialFilter){
        const [result] = this.filter(partialFilter, DataTypes.ROW_DATA, true, true);
        this._update_queue.replace(result);
    }

    applyFilter(){

    }

    groupBy(groupby) {
        const { rowSet, _columns, _groupState, _sortCriteria, _groupby } = this;
        const { range: _range } = rowSet;
        this._groupby = groupby;
        if (groupby === null) {
            this.rowSet = RowSet.fromGroupRowSet(this.rowSet);
        } else {
            if (_groupby === null) {
                this.rowSet = new GroupRowSet(rowSet, _columns, groupby, _groupState, _sortCriteria);
            } else {
                rowSet.groupBy(groupby);
            }
        }

        return this.rowSet.setRange(resetRange(_range), false);
    }

    setGroupState(groupState) {
        this._groupState = groupState;
        const { rowSet } = this;
        rowSet.setGroupState(groupState);

        return rowSet.setRange(rowSet.range, false);
    }

    get updates() {
        const { _update_queue, rowSet: { range } } = this;
        let results = {
            updates: _update_queue.popAll(),
            range: {
                lo: range.lo,
                hi: range.hi
            }
        };
        return results;
    }

    getFilterData(column, range) {
        const { rowSet, filterRowSet, _filter: filter, _columnMap } = this;
        // If our own dataset has been filtered by the column we want values for, we cannot use it, we have
        // to go back to the source, using a filter which excludes the one in place on the target column. 
        const columnName = column.name;
        const colDef = this._columns.find(col => col.name === columnName);
        // No this should be decided beforehand (on client) 
        const type = getFilterType(colDef);

        if (type === 'number') {
            // // we need a notification from server to tell us when this is closed.
            // we should assign to filterRowset
            this.filterRowSet = rowSet.getBinnedValuesForColumn(column);

        } else if (!filterRowSet || filterRowSet.columnName !== column.name) {
            this.filterRowSet = rowSet.getDistinctValuesForColumn(column);

        } else if (filterRowSet && filterRowSet.columnName === column.name) {
            // if we already have the data for this filter, nothing further to do except reset the filterdata range
            // so next request will return full dataset.
            filterRowSet.setRange({ lo: 0, hi: 0 });
        }
        // If we already have a filterRowset for this column, but a filter on another column has changed, we need to
        // recreate the filterRowset: SHould this happen when filter happens ?

        if (filter) {
            this.filterRowSet.setSelectedFromFilter(filter);
        } else {
            this.filterRowSet.selectAll();
        }

        // do we need to returtn searchText ? If so, it should
        // be returned by the rowSet

        // TODO wrap this, we use it  alot
        return this.filterRowSet.setRange(range, false, WITH_STATS);


    }

}

class Table$1 extends Table {

    constructor({valueColumns, ...config}){
      super(config);
      this.valueColumns = valueColumns; // updateableFields ?
    }

    setData(data){
      const {index} = this;
      for (let i=0;i<data.length; i++){
        const [idx, key] = data[i];
        index[key] = idx;
      }

      this.rows = data;
    }

    async loadData(dataUrl){
        console.log(`import data from ${dataUrl}.js`);
        try {
            const {default: data} = await import(`${dataUrl}`);
            if (data) {
                this.setData(data);
            } 
        } catch(e){
            console.error(`failed to load data from path '${dataPath}'`, e);
        }
    }

    // async installDataGenerators({createPath, updatePath}){
    //     if (createPath){
    //         const {default:createGenerator} = await import(`${createPath}.mjs`);
    //         this.createRow = createGenerator;
    //     }
    //     if (updatePath){
    //         const {default: updateGenerator} = await import(`${updatePath}.mjs`);
    //         this.updateRow = updateGenerator;
    //     }
    // }

}

function createRange(from, to, pauseDuration=5, pauseFrequency=30){
  return {
    from,
    to,
    [Symbol.asyncIterator]() {
      return {
        current: this.from,
        last: this.to,
        async next() {
          if (this.current <= this.last) {
            if (this.current % pauseFrequency === 0){
              await new Promise(resolve => setTimeout(resolve, pauseDuration));
            }
            return { done: false, value: this.current++ };
          } else {
            return { done: true };
          }
        }
      };
    }
  };
}

// @ts-nocheck

const url = new URL(self.location);
const tableUrl = url.hash.slice(2);  
console.log(`tableUrl: ${tableUrl}`)
const loadTableConfiguration = async () => await import(/* webpackIgnore: true */ tableUrl);

let table;
let dataStore;

// loadTableConfiguration().then(async ({config}) => {
//     const {generateData} = await import(/* webpackIgnore: true */ config.dataUrl);
//     table = new Table$1(config);
//     table.setData(generateData());
//     dataStore = new DataStore(table, {columns: config.columns}, new UpdateQueue$1);
//     registerMessageHandlers();
//     postMessage({type: 'ready'});
// });

// update these to change the stress test parameters
var STRESS_TEST_MESSAGE_COUNT = 1000;
var STRESS_TEST_UPDATES_PER_MESSAGE = 100;

// update these to change the
var LOAD_TEST_UPDATES_PER_MESSAGE = 100;
var LOAD_TEST_MILLISECONDS_BETWEEN_MESSAGES = 100;

class UpdateQueue$1 extends EventEmitter {
    
    // just until we get typings sorted ...
    constructor(){
        super();
        this._queue = null;
        this.length = 0;
    }
    // not the right name
    update(updates, dataType = DataTypes.ROW_DATA) {
        if (updates.length === 0){
            debugger;
        }
        postMessage({dataType, updates});
    }

    // just until we get the typing sorted
    getCurrentBatch(){

    }

    resize(size) {
        console.log(`localUpdateQueue resize ${JSON.stringify(size)}`);
    }

    append(row, offset) {
        console.log(`localUpdateQueue append ${JSON.stringify(row)} offset ${offset}`);
    }

    replace(message) {
        console.log(`localUpdateQueue replace ${JSON.stringify(size)}`);
        // this.emit(DataTypes.ROW_DATA, message)
    }

    popAll() {
        console.log(`localUpdateQueue popAll`);
        return undefined; // for typescript, until we sort types for UpdateQueue
    }
}


// TODO we can only use this is we accumulate data here in the worker, else we're throwing away data
let renderInterval = 50;

const generateBulkUpdates = (table, updateCount) => {
    const {columnMap,rows, valueColumns} = table;
    const updates = [];
    const rowCount = rows.length;
    if (rowCount > 0){
        for (let k = 0; k<updateCount; k++) {
            const idx = Math.floor(Math.random()*rowCount);
            const field = valueColumns[Math.floor(Math.random() * valueColumns.length)];
            const colIdx = columnMap[field];
            updates.push([idx, colIdx, Math.floor(Math.random()*100000)]);
        }
        return updates;
    }
};

let loadTestRunning = false;
function sendMessagesWithThrottle() {
    var messageCount = null;

    postMessage({
        type: 'test-started',
        messageCount: messageCount,
        updateCount: LOAD_TEST_UPDATES_PER_MESSAGE,
        interval: LOAD_TEST_MILLISECONDS_BETWEEN_MESSAGES
    });

    var intervalId;
    const {_table: table} = dataStore;

    function intervalFunc() {

        const updates = generateBulkUpdates(table, LOAD_TEST_UPDATES_PER_MESSAGE);
        if (updates){
            table.bulkUpdate(updates);
        }

        if (!loadTestRunning) {
            clearInterval(intervalId);
        }
    }

    intervalId = setInterval(intervalFunc, LOAD_TEST_MILLISECONDS_BETWEEN_MESSAGES);
}


async function sendMessagesNoThrottle() {
    postMessage({
        type: 'test-started',
        messageCount: STRESS_TEST_MESSAGE_COUNT,
        updateCount: STRESS_TEST_UPDATES_PER_MESSAGE,
        interval: null
    });

    const range = createRange(1,STRESS_TEST_MESSAGE_COUNT);
    const {_table: table} = dataStore;
    for await (let value of range) {
        const doNotPublish = value !== range.from && value !== range.to && (value % renderInterval !== 0);
        const updates = generateBulkUpdates(table, STRESS_TEST_UPDATES_PER_MESSAGE);
        if (updates){
            table.bulkUpdate(updates, doNotPublish);
        }
    }

    postMessage({
        type: 'test-ended',
        messageCount: STRESS_TEST_MESSAGE_COUNT,
        updateCount: STRESS_TEST_UPDATES_PER_MESSAGE
    });
}

function registerMessageHandlers(){
    self.addEventListener('message', function({data: message}) {
        switch (message.type) {
            case 'subscribe': {
                const result = dataStore.setRange(message.range, true);
                console.log(`post back dataset to WorkerDataSource`);
                postMessage(result);
            }
            break;
            
            case 'setRange':{
                const result = dataStore.setRange(message.range);
                postMessage(result);
            }
            break;
    
            case 'groupBy':{
                const result = dataStore.groupBy(message.groupBy);
                postMessage(result);
            }
            break;
    
            case 'rate':
                if (message.value > 3){
                   renderInterval += 1;
                    // console.log(`current messages/render = ${message.value} increasing renderInterval to ${renderInterval}`);
                } else if (message.value < 2){
                    renderInterval -= 1;
                // console.log(`current messages/render = ${message.value} reducing renderInterval to ${renderInterval}`);
                }     
            break;
    
            case 'startStress':
                console.log('starting stress test');
                sendMessagesNoThrottle();
                break;
            case 'startLoad':
                loadTestRunning = true;
                console.log('starting load test');
                sendMessagesWithThrottle();
                break;
            case 'stopTest':
                console.log('stopping test');
                loadTestRunning = false;
                break;
            default:
                console.log('unknown message type ' + e.data);
                break;
        }
    });
    
}


}  
//# sourceMappingURL=worker.js.map
