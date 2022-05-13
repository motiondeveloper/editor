import { getActiveComp } from "../utils/aeft-utils";
import { filter, forEach } from "../utils/utils";

export * from "./getPropertyPath";

export function getCurrentExpression() {
  const comp = getActiveComp();
  const property = filter(
    comp.selectedProperties,
    (prop) => prop instanceof Property && prop.canSetExpression
  )[0];

  if (property instanceof Property) {
    return property.expression;
  }

  return undefined;
}

export function setCurrentExpression(expressionText: string) {
  const comp = getActiveComp();
  const properties = filter(
    comp.selectedProperties,
    (prop) => prop instanceof Property && prop.canSetExpression
  );

  if (properties.length < 1) return;

  app.beginUndoGroup("Set expression");

  forEach(properties, (prop) => (prop.expression = expressionText));

  app.endUndoGroup();
}
