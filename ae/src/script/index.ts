// @include './lib/json2.js'

import { ns } from "../shared/shared";
import {
  getCurrentExpression,
  getPropertyPath,
  setCurrentExpression,
} from "./src/aeft";
import { dispatchTS } from "../ui/lib/utils/bolt";

const scripts = { getCurrentExpression, getPropertyPath, setCurrentExpression };

//@ts-ignore
const host = typeof $ !== "undefined" ? $ : window;
host[ns] = scripts;

export type Scripts = typeof scripts;
