type ImagePlaceholderProps = {
  label?: string;
  className?: string;
};

export function ImagePlaceholder({
  label = "Место для изображения",
  className = "",
}: ImagePlaceholderProps) {
  return (
    <div className={`image-placeholder ${className}`.trim()} aria-hidden="true">
      <div className="image-placeholder__frame">
        <span>{label}</span>
      </div>
    </div>
  );
}
