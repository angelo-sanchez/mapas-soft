export function setupLayers(map, dataLayers, paintProps) {

    dataLayers.forEach(layer => {
        const props = paintProps[layer.name];
        if (props) {
            const key = Object.keys(props)[0];
            layer.layer["paint"][key] = props[key];
        }

        map.addSource(layer.name, layer.source);
        map.addLayer(layer.layer);
    });
}

