interface EducationalFooterProps {
  description: string;
}

export function EducationalFooter({ description }: EducationalFooterProps) {
  return (
    <footer className="py-6 px-6 mt-auto text-center border-t border-border bg-card">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
        <p className="text-sm text-foreground/70 font-medium">
          {description}
        </p>
        <p className="text-xs text-foreground/50">
          &copy; {new Date().getFullYear()} Dono da Oficina. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}