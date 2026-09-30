'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { Pencil, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { imgSrc } from '@/lib/media';

export type EditKind = 'text' | 'textarea' | 'image';

export interface EditRequest {
  field: string;
  label: string;
  value: string;
  kind?: EditKind;
}

interface EditorContextValue {
  editable: boolean;
  edit: (req: EditRequest) => void;
}

const EditorContext = createContext<EditorContextValue>({
  editable: false,
  edit: () => {},
});

export function EditorProvider({
  editable,
  edit,
  children,
}: {
  editable: boolean;
  edit: (req: EditRequest) => void;
  children: ReactNode;
}) {
  return (
    <EditorContext.Provider value={{ editable, edit }}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}

function PencilBadge({ onClick, title }: { onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      title={title ?? '编辑'}
      className="pointer-events-auto absolute right-2 top-2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white opacity-70 shadow-lg shadow-primary/40 ring-2 ring-white/70 transition-all hover:scale-110 hover:opacity-100 group-hover/editable:opacity-100"
    >
      <Pencil className="h-3.5 w-3.5" />
    </button>
  );
}

interface EditableTextProps {
  field: string;
  label: string;
  value: string;
  kind?: 'text' | 'textarea';
  className?: string;
  wrapperClassName?: string;
  children: ReactNode;
}

export function EditableText({
  field,
  label,
  value,
  kind = 'text',
  className,
  wrapperClassName,
  children,
}: EditableTextProps) {
  const { editable, edit } = useEditor();
  if (!editable) return <>{children}</>;

  return (
    <div className={cn('group/editable relative rounded-lg outline-dashed outline-1 outline-primary/20 transition-all hover:outline-primary/50', className, wrapperClassName)}>
      {children}
      <PencilBadge
        onClick={() => edit({ field, label, value, kind })}
      />
    </div>
  );
}

interface EditableImageProps {
  field: string;
  label: string;
  value: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
}

export function EditableImage({
  field,
  label,
  value,
  alt = '',
  className,
  imgClassName,
}: EditableImageProps) {
  const { editable, edit } = useEditor();
  const src = imgSrc(value);

  if (!editable) {
    if (!src) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={imgClassName} />;
  }

  return (
    <div className={cn('group/editable relative', className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={imgClassName} />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center bg-white/40 text-slate-400',
            imgClassName,
          )}
        >
          <ImagePlus className="h-6 w-6" />
        </div>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          edit({ field, label, value, kind: 'image' });
        }}
        className="pointer-events-auto absolute right-2 top-2 z-20 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white opacity-80 shadow-lg shadow-primary/40 ring-2 ring-white/70 transition-all hover:scale-105 hover:opacity-100 group-hover/editable:opacity-100"
      >
        <ImagePlus className="h-3.5 w-3.5" />
        更换图片
      </button>
    </div>
  );
}