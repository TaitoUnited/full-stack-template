export function DocumentTitle({ title }: { title: string }) {
  /**
   * NOTE: the value inside <title> tag MUST BE a string!
   * See: https://react.dev/reference/react-dom/components/title#use-variables-in-the-title
   */
  const fullTitle = `${title}`;
  return <title>{fullTitle}</title>;
}
