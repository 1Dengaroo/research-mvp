import { type ComponentProps, type ElementType } from 'react';

/**
 * NOT CURRENTLY USED — kept as a utility for future use.
 *
 * Polymorphic wrapper that makes any element focusable via Tab key.
 * Renders as a <span> by default (no layout side-effects).
 * Shows a visible focus ring only on keyboard navigation (focus-visible).
 *
 * Note: not appropriate for static content like headings — Tab should be
 * reserved for interactive elements (links, buttons, inputs). Screen readers
 * already navigate headings natively (e.g. H key in NVDA, VO+Cmd+H in VoiceOver).
 */
export function Focusable<T extends ElementType = 'span'>({
  as,
  className = '',
  ...props
}: { as?: T } & Omit<ComponentProps<T>, 'as'>) {
  const Tag = as ?? 'span';
  return (
    <Tag
      tabIndex={0}
      className={`focus-visible:ring-ring/50 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${className}`}
      {...props}
    />
  );
}
