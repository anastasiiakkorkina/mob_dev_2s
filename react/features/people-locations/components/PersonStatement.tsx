interface PersonStatementProps {
  statement: string;
}

export default function PersonStatement({ statement }: PersonStatementProps) {
  // A missing statement needs no quote box or empty layout element.
  if (statement.trim() === "") return null;

  return <div className="person-statement">“{statement}”</div>;
}
