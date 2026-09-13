/**
 * Keeps page translation from crashing React.
 *
 * Google Translate (the portal's multilingual layer) and browser "Translate
 * this page" features replace text nodes with their own <font> elements.
 * React still holds the original nodes, so when it later removes one, or
 * inserts next to one, the browser throws "The node to be removed is not a
 * child of this node" and the page falls over. The ops are patched to cope
 * with nodes a translator has moved instead of throwing.
 * See https://github.com/facebook/react/issues/11538.
 */

let installed = false;

const warnInDevelopment = (message: string, node: Node) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[translation-dom-guard] ${message}`, node);
  }
};

export function installTranslationDomGuard(): void {
  if (installed || typeof Node === 'undefined') return;
  installed = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function removeChild<T extends Node>(this: Node, child: T): T {
    if (child.parentNode === this) {
      return originalRemoveChild.call(this, child) as T;
    }
    warnInDevelopment('removeChild on a node that is no longer a child; a translator likely replaced it.', child);
    // Detached by the translator: already out of the page, nothing to remove.
    // Re-parented (e.g. wrapped): remove it from where it now lives.
    return child.parentNode
      ? (originalRemoveChild.call(child.parentNode, child) as T)
      : child;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function insertBefore<T extends Node>(
    this: Node,
    node: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      warnInDevelopment('insertBefore with a reference node that is no longer a child; appending instead.', referenceNode);
      // The anchor's position is gone; appending keeps the new content on the
      // page, which is better than dropping it or throwing.
      return originalInsertBefore.call(this, node, null) as T;
    }
    return originalInsertBefore.call(this, node, referenceNode) as T;
  };
}
