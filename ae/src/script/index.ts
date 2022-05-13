// @include './lib/json2.js'

import { ns } from "../shared/shared";

import * as aeft from "./src/aeft";

//@ts-ignore
const host = typeof $ !== "undefined" ? $ : window;
host[ns] = aeft;
