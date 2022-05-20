import type { Rule } from "eslint";
import { FunctionDeclaration, VariableDeclaration } from "estree";

type NodeType = (FunctionDeclaration | VariableDeclaration) &
  Rule.NodeParentExtension;
const isLastNode = (node: NodeType) =>
  node.parent.type === "Program" &&
  node.parent.body[node.parent.body.length - 1].range === node.range;

// https://eslint.org/docs/developer-guide/working-with-rules - working with custom rules
const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Expressions can't end with a function declaration.",
      category: "Possible Errors",
      url: "",
    },
  },

  create(context) {
    return {
      FunctionDeclaration(node) {
        if (isLastNode(node)) {
          context.report({
            message: "Expressions cannot end in a function declaration.",
            node,
            suggest: null,
          });
        }
      },
    };
  },
};

export default rule;
