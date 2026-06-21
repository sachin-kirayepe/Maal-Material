export const Card = ({ children, className }: any) => (
  <div className={`border rounded-lg shadow-sm ${className || ""}`}>{children}</div>
);
export const CardHeader = ({ children, className }: any) => (
  <div className={`p-6 pb-4 ${className || ""}`}>{children}</div>
);
export const CardTitle = ({ children, className }: any) => (
  <h3 className={`font-semibold tracking-tight ${className || ""}`}>{children}</h3>
);
export const CardContent = ({ children, className }: any) => (
  <div className={`p-6 pt-0 ${className || ""}`}>{children}</div>
);
