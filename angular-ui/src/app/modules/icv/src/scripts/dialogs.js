const colorScales = [
    ['red', 'orange', 'yellow', 'lime'],
    chroma.brewer.YlGn,
    chroma.brewer.RdYlGn,
    chroma.brewer.Spectral,
    chroma.brewer.RdYlBu,
    chroma.brewer.RdBu,
    chroma.brewer.PiYG
];

function getLayersWithColors(layers) {
    let list = [];
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].config) {
            list.push(layers[i]);
        }
    }
    return list;
}

export function buildColorOptions(layer) {
    const colorOptions = document.getElementById("colorOptions");
    for (let i = 0; i < colorScales.length; i++) {

        const checkElement = document.createElement("div");
        checkElement.className = "form-check form-check-inline";

        const radioElement = document.createElement("input");
        radioElement.setAttribute("type", "radio");
        radioElement.className = "form-check-input";
        radioElement.name = "gridChecks";
        radioElement.id = "colorRadio" + i;
        radioElement.setAttribute("value", i);
        if (i == 0) {
            radioElement.checked = true;
        }

        const labelElement = document.createElement("label");
        labelElement.className = "form-check-label";
        labelElement.htmlFor = "colorRadio" + i;

        const gradient = document.createElement("div");
        gradient.style.height = "15px";
        gradient.style.width = "5rem";
        gradient.style.backgroundImage = "linear-gradient(to right, " + colorScales[i] + ")";

        labelElement.appendChild(gradient);
        checkElement.appendChild(radioElement);
        checkElement.appendChild(labelElement);
        colorOptions.appendChild(checkElement);

        showColors(getLayersWithColors(layer.item).filter(f => f.name == layer.base).length > 0)
    }
}

const deciles = [0, 5.735946, 6.161794, 6.458379, 6.737333, 6.929084, 7.151279, 7.372851, 7.655340, 8.134889];

export function colorScale(colorIdx) {
    const colorScale = chroma.scale(colorScales[colorIdx]).domain([1, 10]);
    return deciles.map(function (decile, index) {
        return ["D" + (10 - index), decile, colorScale(index + 1).hex()];
    });
}

export function icvFillColor(colorIdx) {
    const scale = colorScale(colorIdx);
    const fillColor = ["interpolate", ["linear"], ["get", "ICV2010"]];

    let colorFN = Array();
    scale.forEach(element => {
        colorFN = colorFN.concat([element[1], element[2]]);
    });

    return fillColor.concat(colorFN);
}

export function setupScale(colorIdx) {
    const scale = colorScale(colorIdx);
    const legend = document.getElementById("icvLegend");
    legend.textContent = '';
    const h4 = document.createElement("h4");
    const legendTitle = document.createTextNode("ICV");
    h4.appendChild(legendTitle);
    legend.appendChild(h4);

    for (let i = scale.length - 1; i >= 0; i--) {
        const legendElement = document.createElement("div");
        const spanElement = document.createElement("span");
        spanElement.style.backgroundColor = scale[i][2];
        const elementText = document.createTextNode(scale[i][0]);
        legendElement.appendChild(spanElement);
        legendElement.appendChild(elementText);
        legend.appendChild(legendElement);
    }
    return icvFillColor(colorIdx);
}

function showColors(show) {
    const colorOptions = document.getElementById("icvConfig")
    if (show) {
        colorOptions.style.visibility = 'visible';
        colorOptions.style.height = '75px';
    } else {
        colorOptions.style.visibility = 'collapse';
        colorOptions.style.height = '0px';
    }
}

// Start of Dialog elements section
export function getBase(baseMaps) {
    if (baseMaps.item.filter(f => f.name == baseMaps.base).length > 0) {
        return baseMaps.base;
    } else {
        return baseMaps.item[0].name
    }
}

// Start of Data Layer Dialog
function getDataLayersCheckElement(dataLayers, name, i) {
    const radioElement = document.createElement("input");
    radioElement.setAttribute("type", "checkbox");
    radioElement.className = "form-check-input";
    radioElement.name = "gridChecks";
    radioElement.id = dataLayers[i].name;
    radioElement.setAttribute("value", dataLayers[i].name);
    if (dataLayers[i].name == name) {
        radioElement.checked = true;
    }
    if (dataLayers[i].config == "colorScales") {
        radioElement.addEventListener('change', function () {
            showColors(this.checked)
        });
    }
    return radioElement;
}

function getDataLayersLabelElement(dataLayers, i) {
    const labelElement = document.createElement("label");
    labelElement.className = "form-check-label";
    labelElement.htmlFor = dataLayers[i].name;
    labelElement.textContent = dataLayers[i].description;
    return labelElement
}

function getDataLayersElement(dataLayers, base, i) {
    const checkElement = document.createElement("div");
    checkElement.className = "form-check form-check-inline";

    checkElement.appendChild(getDataLayersCheckElement(dataLayers.item, base, i));
    checkElement.appendChild(getDataLayersLabelElement(dataLayers.item, i));
    return checkElement;
}

export function buildDataLayerDialog(dataLayers) {
    const dataLayersDialog = document.getElementById("dataLayers");

    for (let i = 0; i < dataLayers.item.length; i++) {
        dataLayersDialog.appendChild(getDataLayersElement(dataLayers, getBase(dataLayers), i));
    }
}
// End of Layer Data Dialog

// Start of Build Map Dialog
function getBaseMapRadioElement(baseMaps, defaultMap, i) {
    const radioElement = document.createElement("input");
    radioElement.setAttribute("type", "radio");
    radioElement.className = "form-check-input";
    radioElement.name = "gridRadios";
    radioElement.id = baseMaps[i].name;
    radioElement.setAttribute("value", baseMaps[i].name);
    if (baseMaps[i].name == defaultMap) {
        radioElement.checked = true;
    }
    return radioElement;
}

function getBaseMapLabelElement(baseMaps, i) {
    const labelElement = document.createElement("label");
    labelElement.className = "form-check-label";
    labelElement.htmlFor = baseMaps[i].name;
    labelElement.textContent = baseMaps[i].description;
    return labelElement;
}

function getBaseMapCheckElement(baseMaps, base, i) {
    const checkElement = document.createElement("div");
    checkElement.className = "form-check form-check-inline";
    checkElement.appendChild(getBaseMapRadioElement(baseMaps.item, base, i));
    checkElement.appendChild(getBaseMapLabelElement(baseMaps.item, i));
    return checkElement;
}

export function buildBaseMapDialog(baseMaps) {
    const baseOptionsDialog = document.getElementById("baseOptions");

    for (let i = 0; i < baseMaps.item.length; i++) {
        baseOptionsDialog.appendChild(getBaseMapCheckElement(baseMaps, getBase(baseMaps), i));
    }
}
// End of Build Map Dialog

// End of Dialog elements section
