import { Map } from 'maplibre-gl';
import { MapData } from '../../../../models/map-data.model';
import layer from '../src/config/layer';
export const setupLayers = async (map: Map, mapData: MapData, paintProps) => {
  const data = await fetch(mapData.urlPreview + '.json').then((res) =>
    res.json()
  );
  const maxZoom = parseInt(data.maxzoom, 10);
  const dataLayers: any = layer(
    mapData.name,
    data.tiles[0],
    data.vector_layers[0].id,
    data.tilestats.layers[0].geometry,
    isNaN(maxZoom) || maxZoom > 12 ? 12 : maxZoom
  );
  if(dataLayers[1].layer.type === 'fill') {
    dataLayers[1].layer.paint = {
      "fill-outline-color": "rgba(57, 57, 57, .5)",
      "fill-color": [
        "step",
        ["%", ["to-number", ["get", "id"]], 4],
        "rgba(214, 131, 131, 0.5)",
        1,
        "rgba(142, 175, 33, 0.5)",
        2,
        "rgba(57, 230, 230, 0.5)",
        3,
        "rgba(199, 56, 144, 0.5)",
      ]
    }
  }
  dataLayers.forEach((layer) => {
    const props = paintProps[layer.name];
    if (props) {
      const key = Object.keys(props)[0];
      layer.layer['paint'][key] = props[key];
    }
    if(!map.getSource(layer.name)) {
      map.addSource(layer.name, layer.source as any);
      map.addLayer(layer.layer as any);
    }
  });
};
