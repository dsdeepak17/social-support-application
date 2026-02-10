/**
 * Container for each wizard step. Provides consistent padding and semantics.
 */
export function StepContainer({ children, titleId, ...props }) {
  return (
    <section
      aria-labelledby={titleId}
      role="region"
      className="step-container"
      {...props}
    >
      {children}
    </section>
  );
}

export default StepContainer;
