type ContentImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ContentImage({ src, alt, className = "" }: ContentImageProps) {
  return (
    <div className={`content-image ${className}`.trim()}>
      <img className="content-image__img" src={src} alt={alt} />
    </div>
  );
}
