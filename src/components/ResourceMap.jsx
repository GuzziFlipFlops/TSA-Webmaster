import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { defaultCommunityLocation } from "../services/locationUtils";
import { getCategory, titleCase } from "../utils/resourceUtils";
import { Badge } from "./UI.jsx";

function MapController({ selectedResource, center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (selectedResource?.coordinates) {
      map.flyTo(selectedResource.coordinates, Math.max(zoom, 12), { duration: 0.45 });
      return;
    }
    if (center?.length) map.setView(center, zoom);
  }, [center, map, selectedResource, zoom]);
  return null;
}

function markerIcon(resource, selected) {
  const category = getCategory(resource.categoryId);
  return L.divIcon({
    className: `community-pin ${selected ? "community-pin-selected" : ""}`,
    html: `<span style="display:block;width:100%;height:100%;border-radius:999px;background:${category.color}"></span>`,
    iconSize: selected ? [28, 28] : [23, 23],
    iconAnchor: selected ? [14, 14] : [11, 11]
  });
}

export default function ResourceMap({ resources, selectedId, onSelect, center = defaultCommunityLocation.coordinates, zoom = 12 }) {
  const selectedResource = resources.find((resource) => resource.id === selectedId);
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="z-0 rounded-lg">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController selectedResource={selectedResource} center={center} zoom={zoom} />
      {resources.map((resource) => {
        const category = getCategory(resource.categoryId);
        return (
          <Marker
            key={resource.id}
            position={resource.coordinates}
            icon={markerIcon(resource, selectedId === resource.id)}
            eventHandlers={{ click: () => onSelect(resource.id) }}
          >
            <Popup>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Badge color="teal">{category.name}</Badge>
                  <Badge color={resource.cost === "free" ? "green" : "amber"}>{titleCase(resource.cost)}</Badge>
                </div>
                <h3 className="mt-2 text-base font-black">{resource.name}</h3>
                <p className="mt-1 text-sm leading-6 text-ink/70">{resource.description}</p>
                <p className="mt-2 text-xs font-bold text-ink/60">{resource.address}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resource.website ? (
                    <a className="rounded-full bg-ink px-3 py-1.5 text-xs font-black text-white" href={resource.website} target="_blank" rel="noreferrer">
                      Website
                    </a>
                  ) : null}
                  {resource.phone ? (
                    <a className="rounded-full border border-slateLine px-3 py-1.5 text-xs font-black text-ink" href={`tel:${resource.phone}`}>
                      Call
                    </a>
                  ) : null}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
