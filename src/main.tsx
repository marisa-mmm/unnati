import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Prevent React from crashing when Google Translate modifies the DOM
if (typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child: Node) {
    if (child.parentNode !== this) {
      if (console) {
        console.warn("Cannot remove a child from a different parent", child, this);
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments as any);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode: Node, referenceNode: Node | null) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) {
        console.warn("Cannot insert before a reference node from a different parent", referenceNode, this);
      }
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments as any);
  };
}

createRoot(document.getElementById("root")!).render(<App />);
