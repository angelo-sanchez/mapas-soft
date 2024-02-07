// Import region
import maplibregl from "maplibre-gl";
import {buildColorOptions, setupScale, buildBaseMapDialog, buildDataLayerDialog, colorScale, getBase} from "./dialogs";
import {addSearchBox} from "./search";
import {setupLayers} from "./layers";
import config from "../config/config.json";
import style from "../config/style.json";
import layer from "../config/layer.json"; // The overlayer order determines how they overlap
import layerAction from "../config/layer_action.json";
// Import region end

const urlParams = new URLSearchParams(window.location.search);
maplibregl.accessToken = "pk.eyJ1IjoiYXp1bmlubyIsImEiOiJjand0czBvc24wZ2l5NDhucnc2Ym9zNXNiIn0.tAtTepUSFqApaOQygq_9iw";

let basemap = getBase(config.map);
let initialStyle = getStyleConfig(getStyle(basemap));
let hoveredAreaId = null;

buildColorOptions(config.layer);
buildBaseMapDialog(config.map);
buildDataLayerDialog(config.layer);
addToHomescreen({
    //            startDelay: 30
    autostart: true,
    autoHide: 0,
    mandatory: false,
    logging: true,
    customCriteria: true,
    onShow: function () {
        console.log("showing");
    },
    onInit: function () {
        console.log("initializing");
    },
    onAdd: function () {
        console.log("adding");
    },
    onInstall: function () {
        console.log("Installing");
    },
    onCancel: function () {
        console.log("Cancelling");
    },
});

if ("serviceWorker" in navigator) {
    const x = "sw.js";
    navigator.serviceWorker.register(x).then(function () {
        console.log("Service Worker Registered");
    });
}

function getStyle(name) {
    const stylePosition = config.map.item.findIndex((element) => element.name == name)
    const configStyle = config.map.item[stylePosition != -1 ? stylePosition : 0].style;
    return style[style.findIndex((element) => element.name == configStyle)];
}

function getStyleConfig(styleName) {
    if (styleName.import != "") {
        return styleName.import;
    } else {
        return styleName.style;
    }
}

function clearLayer(layer) {
    if (map.getLayer(layer)) {
        map.removeLayer(layer);
    }
}

function switchLayer(layer) {
    const layerId = layer;
    if (basemap == layerId) return;
    basemap = layerId;

    for (let i = 0; i < layer.length; i++) {
        clearLayer(layer[i].base)
    }
    map.setStyle(
        getStyleConfig(
            getStyle(config.map.item[config.map.item.findIndex((element) => element.name == layerId)].name)
        ),
        {diff: false}
    )
}

if (urlParams.has("basemap")) {
    basemap = urlParams.get("basemap");
    initialStyle = config.map.item.find((element) => element.value == urlParams.get("basemap")).style;
}

// Map config region
const map = new maplibregl.Map({
    container: "map", // container id
    //            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    style: initialStyle,
    bounds: [
        [-53.6374515, -21.781168],
        [-73.5605371, -55.1850761],
    ],
    //               center: [-64.1083015, -40.3211264], // starting position [lng, lat]
    //            center: [-62, -41], // starting position [lng, lat]
    //               zoom: 3.3, // starting zoom
    hash: false,
    pitchWithRotate: false,
    minzoom: 3.2,
    maxzoom: 17,
});

// Disable map rotation using right click + drag
map.dragRotate.disable();

// Disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

let fillStyle = 0;

map.on("style.load", function () {
    let paintProps = {
        icv: {"fill-color": setupScale(fillStyle)}
    };
    setupLayers(map, layer, paintProps);
    if (urlParams.has("raster")) {
        document.getElementById("icvRaster").checked = true;
        document.getElementById("icv").checked = false;
    }

    Array.prototype.forEach.call(
        document.querySelectorAll("#overlayForm input"),
        function (item, index) {
            const visibility = item.checked ? "visible" : "none";
            map.setLayoutProperty(item.value, "visibility", visibility);
        }
    );
});

map.addControl(
    new maplibregl.NavigationControl({
        showCompass: false,
        showZoom: true,
    })
);

// Add geolocate control to the map.
map.addControl(
    new maplibregl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true,
        },
        trackUserLocation: true,
    })
);

// Map controller region end
document.getElementById("save").addEventListener("click", function () {

    let layer = "";
    Array.prototype.forEach.call(
        document.querySelectorAll("#basemapForm input"),
        function (item, index) {
            if (item.checked) {
                layer = item.value;
            }
        }
    );

    let color = 0;
    Array.prototype.forEach.call(
        document.querySelectorAll("#icvConfig input"),
        function (item, index) {
            if (item.checked) {
                color = item.value;
            }
        }
    );

    fillStyle = color;
    let fillColor = setupScale(color);

    // Reset overlayer
    Array.prototype.forEach.call(
        document.querySelectorAll("#overlayForm input"),
        function (item, index) {
            const visibility = item.checked ? "visible" : "none";
            map.setLayoutProperty(item.value, "visibility", visibility);
        }
    );

    if (document.getElementById("icv") != null) {
        if (document.getElementById("icv").checked) {
            //show ICV info
            document.getElementById("icvLegend").style.display = "";
            document.getElementById("icvInfo").style.display = "";
            map.setPaintProperty("icv", "fill-color", fillColor);
        } else {
            // hide ICV info
            document.getElementById("icvLegend").style.display = "none";
            document.getElementById("icvInfo").style.display = "none";
        }
    }
    console.log(layer)
    switchLayer(layer);
});

function onMapDataClick(layerActionElement) {
    map.on(layerActionElement.action, layerActionElement.layer, function (e) {
        new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(eval(layerActionElement.html))
            .addTo(map);
    });
}

function onMapDataMouseEnter(layerActionElement) {
    map.on(layerActionElement.action, layerActionElement.layer, function () {
        map.getCanvas().style.cursor = layerActionElement.cursor;
    });
}

function onMapDataMouseLeave(layerActionElement) {
    map.on(layerActionElement.action, layerActionElement.layer, function () {
        // change cursor
        map.getCanvas().style.cursor = layerActionElement.cursor;
        // undo hoover area
        if (hoveredAreaId) {
            map.setFeatureState(
                {sourceLayer: layerActionElement.sourceLayer, source: layerActionElement.layer, id: hoveredAreaId},
                {hover: false}
            );
            hoveredAreaId = null;
        }
    });
}

function onMapDataMouseMove(layerActionElement) {
    map.on(layerActionElement.action, layerActionElement.layer, function (e) {
        const info = document.getElementById(layerActionElement.source);
        if (e.features.length > 0) {

            if (hoveredAreaId) {
                map.setFeatureState(
                    {sourceLayer: layerActionElement.sourceLayer, source: layerActionElement.layer, id: hoveredAreaId},
                    {hover: false}
                );
            }

            hoveredAreaId = e.features[0].id;

            map.setFeatureState(
                {sourceLayer: layerActionElement.sourceLayer, source: layerActionElement.layer, id: hoveredAreaId},
                {hover: true}
            );

            const elementValue = eval(layerActionElement.value);
            const cScale = colorScale(0);
            let decile = cScale.findIndex(element => element[1] >= elementValue);
            decile = decile == -1 ? 10 : decile;
            info.textContent = layerActionElement.text_prefix + Math.floor(elementValue * 100) / 100 + " " + cScale[decile - 1][0];
            info.style.opacity = 1;
        } else {
            info.textContent = "";
            info.style.opacity = 0;
        }
    });
}

function setMapDataAction() {
    for (let i = 0; i < layerAction.length; i++) {
        switch (layerAction[i].action) {
            case "click":
                onMapDataClick(layerAction[i]);
                break;
            case "mouseenter":
                onMapDataMouseEnter(layerAction[i]);
                break;
            case "mouseleave":
                onMapDataMouseLeave(layerAction[i]);
                break;
            case "mousemove":
                onMapDataMouseMove(layerAction[i])
                break;
        }
    }
}

setMapDataAction()

// esto es requerido por popper.js para mostrar tooltips
document.addEventListener("DOMContentLoaded", function () {
    let tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

addSearchBox(map);
