import { Map } from 'maplibre-gl';
import { MapData } from '../../../../models/map-data.model';
import layer from '../src/config/layer';
export const setupLayers = async (map: Map, mapData: MapData, paintProps) => {
  const data = await fetch(mapData.urlPreview + '.json').then((res) =>
    res.json()
  );
  const dataLayers = layer(
    mapData.name,
    data.tiles[0],
    data.vector_layers[0].id,
    data.tilestats.layers[0].geometry
  );

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
