import { BindIdManager } from '@/utils/BindIdManager';

// Inteface du composant
export interface TemplateFormType {
  id: string;
  title?: string;
  label?: string;
  displayRequire?: boolean;
  idInput: string;
  child: JSX.Element;
  className?: string;
}

/**
 * Template standard d'un formulaire
 * @param template Interface avec le contenu du formulaire
 * @returns Renvoie un composant
 */
export function TemplateForm(template: TemplateFormType): React.JSX.Element {
  // --- ID ---
  const bindId: BindIdManager = new BindIdManager(
    template.id + '-TemplateForm'
  );

  // --- TITLE ---
  let title: JSX.Element | undefined = undefined;
  if (template.title) {
    title = <h3 className="text-xl font-bold">{template.title}</h3>;
  }

  // --- LABEL ---
  let label: JSX.Element | undefined = undefined;
  if (template.label) {
    if (template.displayRequire) {
      label = (
        <p className="text-base">
          <label htmlFor={template.idInput}>
            <span className="text-[#f00]">* </span>
            <span className="text-bold">{template.label}</span>
          </label>
        </p>
      );
    } else {
      label = (
        <p className="text-base text-bold">
          <label htmlFor={template.idInput}>{template.label}</label>
        </p>
      );
    }
  }

  // --- COMPONENT ---
  return (
    <div
      id={bindId.bindId(1, 'TemplateContainer')}
      className={'flex flex-col gap-3 ' + template.className}
    >
      {title}
      {label}
      {template.child}
    </div>
  );
}
