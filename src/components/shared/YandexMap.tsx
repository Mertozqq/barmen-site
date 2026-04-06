import { useEffect, useRef, useState } from "react";

type YandexMapProps = {
  address: string;
  className?: string;
};

declare global {
  interface Window {
    ymaps?: {
      Map: new (
        element: HTMLElement,
        state: Record<string, unknown>,
        options?: Record<string, unknown>,
      ) => {
        destroy: () => void;
        geoObjects: {
          add: (object: unknown) => void;
        };
        setCenter: (coordinates: number[], zoom?: number) => void;
      };
      Placemark: new (
        coordinates: number[],
        properties?: Record<string, unknown>,
        options?: Record<string, unknown>,
      ) => unknown;
      geocode: (query: string) => Promise<{
        geoObjects: {
          get: (index: number) => {
            geometry: {
              getCoordinates: () => number[];
            };
            properties: {
              get: (key: string) => string | undefined;
            };
          } | null;
        };
      }>;
      ready: (callback: () => void) => void;
    };
    __yandexMapsLoader?: Promise<typeof window.ymaps>;
  }
}

type YandexMapInstance = {
  destroy: () => void;
  geoObjects: {
    add: (object: unknown) => void;
  };
  setCenter: (coordinates: number[], zoom?: number) => void;
};

const DEFAULT_CENTER = [55.751244, 37.618423];
const SCRIPT_ID = "yandex-maps-script";

function loadYandexMaps(apiKey?: string) {
  if (window.ymaps) {
    return Promise.resolve(window.ymaps);
  }

  if (window.__yandexMapsLoader) {
    return window.__yandexMapsLoader;
  }

  window.__yandexMapsLoader = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.ymaps), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Не удалось загрузить Яндекс Карты.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    const params = new URLSearchParams({ lang: "ru_RU" });

    if (apiKey) {
      params.set("apikey", apiKey);
    }

    script.id = SCRIPT_ID;
    script.src = `https://api-maps.yandex.ru/2.1/?${params.toString()}`;
    script.async = true;
    script.onload = () => resolve(window.ymaps);
    script.onerror = () => reject(new Error("Не удалось загрузить Яндекс Карты."));
    document.head.appendChild(script);
  });

  return window.__yandexMapsLoader;
}

export function YandexMap({ address, className = "" }: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let mapInstance: YandexMapInstance | null = null;
    const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

    loadYandexMaps(apiKey)
      .then(
        (ymaps) =>
          new Promise<typeof ymaps>((resolve) => {
            ymaps?.ready(() => resolve(ymaps));
          }),
      )
      .then(async (ymaps) => {
        if (!ymaps || !mapRef.current || isCancelled) {
          return;
        }

        mapInstance = new ymaps.Map(
          mapRef.current,
          {
            center: DEFAULT_CENTER,
            zoom: 14,
            controls: ["zoomControl", "fullscreenControl"],
          },
          {
            suppressMapOpenBlock: true,
          },
        );

        try {
          const result = await ymaps.geocode(address);
          const firstGeoObject = result.geoObjects.get(0);

          if (!firstGeoObject || isCancelled) {
            return;
          }

          const coordinates = firstGeoObject.geometry.getCoordinates();
          const balloonContent = firstGeoObject.properties.get("text") ?? address;
          const placemark = new ymaps.Placemark(
            coordinates,
            { balloonContent, hintContent: balloonContent },
            {
              preset: "islands#darkOrangeDotIcon",
            },
          );

          mapInstance.setCenter(coordinates, 16);
          mapInstance.geoObjects.add(placemark);
        } catch {
          const placemark = new ymaps.Placemark(
            DEFAULT_CENTER,
            { balloonContent: address, hintContent: address },
            { preset: "islands#darkOrangeDotIcon" },
          );

          mapInstance.geoObjects.add(placemark);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setHasError(true);
        }
      });

    return () => {
      isCancelled = true;
      mapInstance?.destroy();
    };
  }, [address]);

  if (hasError) {
    return (
      <div className={`contact-media-card ${className}`.trim()}>
        <div className="contact-media-card__fallback">
          <strong>Карта временно недоступна</strong>
          <span>{address}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`contact-media-card ${className}`.trim()}>
      <div className="contact-map" ref={mapRef} aria-label={`Карта по адресу ${address}`} />
    </div>
  );
}
