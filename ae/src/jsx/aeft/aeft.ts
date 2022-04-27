import { getActiveComp } from "./aeft-utils";
import { filter } from "../utils/utils";

export const helloWorld = () => {
  alert("Hello from After Effects!");
  app.project.activeItem;
};

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
  const property = filter(
    comp.selectedProperties,
    (prop) => prop instanceof Property && prop.canSetExpression
  )[0];

  if (property instanceof Property && property.canSetExpression) {
    app.beginUndoGroup("Set expression");
    property.expression = expressionText;
    app.endUndoGroup();
  }
}
