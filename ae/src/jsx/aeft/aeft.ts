import { getActiveComp } from "./aeft-utils";

export const helloWorld = () => {
  alert("Hello from After Effects!");
  app.project.activeItem;
};

export function getCurrentExpression() {
  const comp = getActiveComp();
  const property = comp.selectedProperties[0];

  if (property instanceof Property) {
    return property.expression;
  }

  return undefined;
}

export function setCurrentExpression(expressionText: string) {
  const comp = getActiveComp();
  const property = comp.selectedProperties[0];

  if (property instanceof Property && property.canSetExpression) {
    app.beginUndoGroup("Set expression");
    property.expression = expressionText;
    app.endUndoGroup();
  }
}
