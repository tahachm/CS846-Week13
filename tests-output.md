# Test Outputs

## Jest (npm test)

```
Note: The tool simplified the command to ` cd /Users/tahacheema/Documents/CS846-se/week13-vibe-coding/CS846-Week13/app && npm test`, and this is the output of running that command instead:

> app@0.1.0 test
> jest

 FAIL  src/integration/posts.integration.test.ts
  ● posts + likes + replies integration › registers a user, creates a post, and
sees it in the global feed
    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its depende
ncies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.
    Out of the box Jest supports Babel, which will be used to transform your fil
es into valid JS based on your Babel configuration.
    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/e
cmascript-modules for how to enable it.                                              • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-s
tarted#using-typescript                                                              • To have some of your "node_modules" files transformed, you can specify a
custom "transformIgnorePatterns" in your config.                                     • If you need a custom transformation, specify a "transform" option in your
 config.                                                                             • If you simply want to mock your non-JS modules (e.g. binary assets) you c
an stub them out with the "moduleNameMapper" config option.
    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /Users/tahacheema/Documents/CS846-se/week13-vibe-coding/CS846-Week13/app/nod
e_modules/@prisma/client/runtime/query_compiler_fast_bg.sqlite.mjs:2                ${e.stack}`:_}function M(e,t){return e=e>>>0,a().subarray(e/1,e/1+t)}functio
n w(e){const t=o.__wbindgen_externrefs.get(e);return o.__externref_table_dealloc(e),t}const I=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>o.__wbg_querycompiler_free(e>>>0,1));class F{__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,I.unregister(this),t}free(){const t=this.__destroy_into_raw();o.__wbg_querycompiler_free(t,0)}compileBatch(t){const n=l(t,o.__wbindgen_malloc,o.__wbindgen_realloc),_=f,r=o.querycompiler_compileBatch(this.__wbg_ptr,n,_);if(r[2])throw w(r[1]);return w(r[0])}constructor(t){const n=o.querycompiler_new(t);if(n[2])throw w(n[1]);return this.__wbg_ptr=n[0]>>>0,I.register(this,this.__wbg_ptr,this),this}compile(t){const n=l(t,o.__wbindgen_malloc,o.__wbindgen_realloc),_=f,r=o.querycompiler_compile(this.__wbg_ptr,n,_);if(r[2])throw w(r[1]);return w(r[0])}}Symbol.dispose&&(F.prototype[Symbol.dispose]=F.prototype.free);function O(e,t){return Error(m(e,t))}function B(e){return Number(e)}function N(e,t){const n=String(t),_=l(n,o.__wbindgen_malloc,o.__wbindgen_realloc),r=f;u().setInt32(e+4*1,r,!0),u().setInt32(e+4*0,_,!0)}function U(e){const t=e,n=typeof t=="boolean"?t:void 0;return x(n)?16777215:n?1:0}function R(e,t){const n=S(t),_=l(n,o.__wbindgen_malloc,o.__wbindgen_realloc),r=f;u().setInt32(e+4*1,r,!0),u().setInt32(e+4*0,_,!0)}function $(e,t){return e in t}function q(e){const t=e;return typeof t=="object"&&t!==null}function C(e){return typeof e=="string"}function k(e){return e===void 0}function W(e,t){return e==t}function V(e,t){const n=t,_=typeof n=="number"?n:void 0;u().setFloat64(e+8*1,x(_)?0:_,!0),u().setInt32(e+4*0,!x(_),!0)}function z(e,t){const n=t,_=typeof n=="string"?n:void 0;var r=x(_)?0:l(_,o.__wbindgen_malloc,o.__wbindgen_realloc),s=f;u().setInt32(e+4*1,s,!0),u().setInt32(e+4*0,r,!0)}function L(e,t){throw new Error(m(e,t))}function P(e){return Object.entries(e)}function Q(e){return e.getTime()}function Y(e,t){return e[t>>>0]}function G(e,t){return e[t]}function J(e){let t;try{t=e instanceof ArrayBuffer}catch{t:!1}return t}function X(e){let t;try{t=e instanceof Uint8Array}catch{t:!1}return t}function H(e){return Number.isSafeInteger(e)}function K(e){return e.length}function Z(e){return e.length}function v(){return new Date}function ee(){return new Object}function te(e){return new Uint8Array(e)}function ne(){return new Map}function re(){return new Array}function _e(e,t,n){Uint8Array.prototype.set.call(M(e,t),n)}function oe(e,t,n){e[t]=n}function ce(e,t,n){return e.set(t,n)}function ie(e,t,n){e[t>>>0]=n}function se(e,t){global.PRISMA_WASM_PANIC_REGISTRY.set_message(m(e,t))}function ue(e,t){return m(e,t)}function fe(e){return BigInt.asUintN(64,e)}function be(e){return e}function de(e){return e}function ae(){const e=o.__wbindgen_externrefs,t=e.grow(4);e.set(0,void 0),e.set(t+0,void 0),e.set(t+1,null),e.set(t+2,!0),e.set(t+3,!1)}export{F as QueryCompiler,O as __wbg_Error_e83987f665cf5504,B as __wbg_Number_bb48ca12f395cd08,N as __wbg_String_8f0eb39a4a4c2f66,U as __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68,R as __wbg___wbindgen_debug_string_df47ffb5e35e6763,$ as __wbg___wbindgen_in_bb933bd9e1b3bc0f,q as __wbg___wbindgen_is_object_c818261d21f283a4,C as __wbg___wbindgen_is_string_fbb76cb2940daafd,k as __wbg___wbindgen_is_undefined_2d472862bd29a478,W as __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147,V as __wbg___wbindgen_number_get_a20bf9b85341449d,z as __wbg___wbindgen_string_get_e4f06c90489ad01b,L as __wbg___wbindgen_throw_b855445ff6a94295,P as __wbg_entries_e171b586f8f6bdbf,Q as __wbg_getTime_14776bfb48a1bff9,Y as __wbg_get_7bed016f185add81,G as __wbg_get_with_ref_key_1dc361bd10053bfe,J as __wbg_instanceof_ArrayBuffer_70beb1189ca63b38,X as __wbg_instanceof_Uint8Array_20c8e73002f7af98,H as __wbg_isSafeInteger_d216eda7911dde36,K as __wbg_length_69bca3cb64fc8748,Z as __wbg_length_cdd215e10d9dd507,v as __wbg_new_0_f9740686d739025c,ee as __wbg_new_1acc0b6eea89d040,te as __wbg_new_5a79be3ab53b8aa5,ne as __wbg_new_68651c719dcda04e,re as __wbg_new_e17d9f43105b08be,_e as __wbg_prototypesetcall_2a6620b6922694b2,oe as __wbg_set_3f1d0b984ed272ed,ce as __wbg_set_907fb406c34a251d,ie as __wbg_set_c213c871859d6500,se as __wbg_set_message_82ae475bb413aa5c,D as __wbg_set_wasm,ue as __wbindgen_cast_2241b6af4c4b2941,fe as __wbindgen_cast_4625c577ab2ec9ee,be as __wbindgen_cast_9ae0607507abb057,de as __wbindgen_cast_d6cd19b81560fd6e,ae as __wbindgen_init_externref_table};

[... Jest output truncated for brevity in this snippet ...]

PASS  src/lib/logger.test.ts
PASS  src/lib/validation.test.ts

Test Suites: 1 failed, 2 passed, 3 total
Tests:       5 failed, 11 passed, 16 total
Snapshots:   0 total
Time:        0.317 s, estimated 1 s
Ran all test suites.
```

## Playwright E2E (npm run test:e2e)

```
> app@0.1.0 test:e2e
> playwright test


Running 3 tests using 3 workers

  ✓  1 …gin-flow.spec.ts:8:5 › seeded user can log in and see global feed (2.5s)
  ✓  2 … › character counter reflects limits and disables when over limit (2.6s)
  ✓  3 …e/basic-flow.spec.ts:20:5 › login and create post appears in feed (2.6s)

  3 passed (6.3s)
```
