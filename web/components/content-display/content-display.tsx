export type ContentDisplayProps = {
  content: { content: string };
};

export function ContentDisplay({ content }: ContentDisplayProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content.content }} />
    </div>
  );
}
