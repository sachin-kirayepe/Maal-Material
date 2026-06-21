export const Table = ({ children, className }: any) => (
  <div className="w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className || ""}`}>{children}</table>
  </div>
);
export const TableHeader = ({ children, className }: any) => (
  <thead className={`[&_tr]:border-b ${className || ""}`}>{children}</thead>
);
export const TableBody = ({ children, className }: any) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className || ""}`}>{children}</tbody>
);
export const TableRow = ({ children, className }: any) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className || ""}`}
  >
    {children}
  </tr>
);
export const TableHead = ({ children, className }: any) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${className || ""}`}
  >
    {children}
  </th>
);
export const TableCell = ({ children, className }: any) => (
  <td className={`p-4 align-middle ${className || ""}`}>{children}</td>
);
