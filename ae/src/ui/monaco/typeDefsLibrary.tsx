import expressionTypes from "expression-globals-typescript/dist/index.d.ts?raw";
import {
  Layer,
  NumericValue,
  Property,
  Vector,
} from "expression-globals-typescript";

const thisLayer = new Layer();
const thisProperty = new Property<NumericValue>([0, 0]);

const layerProperties = [
  ...Object.getOwnPropertyNames(thisLayer),
  ...Object.getOwnPropertyNames(Object.getPrototypeOf(thisLayer)),
];

const propertyProperties = [
  ...Object.getOwnPropertyNames(thisProperty),
  ...Object.getOwnPropertyNames(Object.getPrototypeOf(thisProperty)),
];

const preprocessLayers = layerProperties
  .map((name) => `const ${name} = thisLayer['${name}']`)
  .join("\n");

const preprocessProperties = propertyProperties
  .map((name) => `const ${name} = thisProperty['${name}']`)
  .join("\n");

const libCode = expressionTypes.replace(/export /g, "");

export const typeDefsLib = (preprocess = true) => `${libCode}
const thisComp = new Comp();
const thisProperty = new Property<NumericValue>([0, 0]);
const thisLayer = new Layer();

${preprocess && preprocessLayers}
${preprocess && preprocessProperties}`;
