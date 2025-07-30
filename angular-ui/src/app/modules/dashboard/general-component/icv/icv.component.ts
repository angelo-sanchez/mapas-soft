import { Component, Input, OnInit } from '@angular/core';
import maplibregl, { Map } from 'maplibre-gl';

import {
  buildColorOptions,
  setupScale,
  buildBaseMapDialog,
  buildDataLayerDialog,
  colorScale,
  getBase,
} from './scripts/dialogs';
import { setupLayers } from './scripts/layers';
import config from './src/config/config';
import style from './src/config/style';
import layerAction from './src/config/layer_action';
import { MapData } from '../../../models/map-data.model';

declare const bootstrap: any;

@Component({
  selector: 'app-icv',
  templateUrl: './icv.component.html',
  styleUrls: ['./icv.component.css'],
})
export class IcvComponent implements OnInit {
  @Input('map') mapData!: MapData;
  title = 'ICV';
  search: any;

  config: any;
  layer: any;

  constructor() {}

  async init(map: Map) {
    this.search = await import('./scripts/search');
    this.search.addSearchBox(map);
  }

  ngOnInit() {
    this.config = config(this.mapData.name);
    const urlParams = new URLSearchParams(window.location.search);

    let basemap = getBase(this.config.map);
    let initialStyle = this.getStyleConfig(this.getStyle(basemap));
    let hoveredAreaId: number | null = null;
    buildBaseMapDialog(this.config.map);
    buildColorOptions(this.config.layer);
    buildDataLayerDialog(this.config.layer);

    const clearLayer = (layer) => {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    };

    const switchLayer = (layer) => {
      const layerId = layer;
      if (basemap == layerId) return;
      basemap = layerId;

      for (const element of layer) {
        clearLayer(element.base);
      }
      map.setStyle(
        this.getStyleConfig(
          this.getStyle(
            this.config.map.item[
              this.config.map.item.findIndex(
                (element) => element.name == layerId
              )
            ].name
          )
        ),
        { diff: false }
      );
    };

    if (urlParams.has('basemap')) {
      basemap = urlParams.get('basemap');
      initialStyle = this.config.map.item.find(
        (element: any) => element.value == urlParams.get('basemap')
      ).style;
    }

    // Map config region
    const map = new maplibregl.Map({
      container: 'map', // container id
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
      minZoom: 3.2,
      maxZoom: 17,
    });

    // Disable map rotation using right click + drag
    map.dragRotate.disable();

    // Disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    let fillStyle = 0;

    map.on('style.load', async () => {
      let paintProps = {
        icv: { 'fill-color': setupScale(fillStyle) },
      };
      await setupLayers(map, this.mapData, paintProps);
      if (urlParams.has('raster')) {
        (document.getElementById('icvRaster') as HTMLInputElement).checked =
          true;
        (document.getElementById('icv') as HTMLInputElement).checked = false;
      }

      Array.prototype.forEach.call(
        document.querySelectorAll('#overlayForm input'),
        (item, index) => {
          const visibility = item.checked ? 'visible' : 'none';
          map.setLayoutProperty(item.value, 'visibility', visibility);
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
    document.getElementById('save').addEventListener('click', () => {
      let layer = '';
      Array.prototype.forEach.call(
        document.querySelectorAll('#basemapForm input'),
        (item, index) => {
          if (item.checked) {
            layer = item.value;
          }
        }
      );

      let color = 0;
      Array.prototype.forEach.call(
        document.querySelectorAll('#icvConfig input'),
        (item, index) => {
          if (item.checked) {
            color = item.value;
          }
        }
      );

      fillStyle = color;
      let fillColor = setupScale(color);

      // Reset overlayer
      Array.prototype.forEach.call(
        document.querySelectorAll('#overlayForm input'),
        (item, index) => {
          const visibility = item.checked ? 'visible' : 'none';
          map.setLayoutProperty(item.value, 'visibility', visibility);
        }
      );

      if (document.getElementById('icv') != null) {
        if ((document.getElementById('icv') as HTMLInputElement).checked) {
          // hide ICV info
          document.getElementById('icvLegend') && (document.getElementById('icvLegend').style.display = 'none');
          document.getElementById('icvInfo') && (document.getElementById('icvInfo').style.display = 'none');
        }
      }
      console.log(layer);
      switchLayer(layer);
    });

    const onMapDataClick = (layerActionElement) => {
      map.on(layerActionElement.action, layerActionElement.layer, (e) => {
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(eval(layerActionElement.html))
          .addTo(map);
      });
    };

    const onMapDataMouseEnter = (layerActionElement) => {
      map.on(layerActionElement.action, layerActionElement.layer, () => {
        map.getCanvas().style.cursor = layerActionElement.cursor;
      });
    };

    const onMapDataMouseLeave = (layerActionElement) => {
      map.on(layerActionElement.action, layerActionElement.layer, () => {
        // change cursor
        map.getCanvas().style.cursor = layerActionElement.cursor;
        // undo hoover area
        if (hoveredAreaId) {
          map.setFeatureState(
            {
              sourceLayer: layerActionElement.sourceLayer,
              source: layerActionElement.layer,
              id: hoveredAreaId,
            },
            { hover: false }
          );
          hoveredAreaId = null;
        }
      });
    };

    const onMapDataMouseMove = (layerActionElement) => {
      map.on(layerActionElement.action, layerActionElement.layer, (e) => {
        const info = document.getElementById(layerActionElement.source);
        if (e.features.length > 0) {
          if (hoveredAreaId) {
            map.setFeatureState(
              {
                sourceLayer: layerActionElement.sourceLayer,
                source: layerActionElement.layer,
                id: hoveredAreaId,
              },
              { hover: false }
            );
          }

          hoveredAreaId = e.features[0].id;

          map.setFeatureState(
            {
              sourceLayer: layerActionElement.sourceLayer,
              source: layerActionElement.layer,
              id: hoveredAreaId,
            },
            { hover: true }
          );

          const elementValue = eval(layerActionElement.value);
          const cScale = colorScale(0);
          let decile = cScale.findIndex(
            (element) => element[1] >= elementValue
          );
          decile = decile == -1 ? 10 : decile;
          info.textContent =
            layerActionElement.text_prefix +
            Math.floor(elementValue * 100) / 100 +
            ' ' +
            cScale[decile - 1][0];
          info.style.opacity = '1';
        } else {
          info.textContent = '';
          info.style.opacity = '0';
        }
      });
    };

    const setMapDataAction = () => {
      for (const element of layerAction) {
        switch (element.action) {
          case 'click':
            onMapDataClick(element);
            break;
          case 'mouseenter':
            onMapDataMouseEnter(element);
            break;
          case 'mouseleave':
            onMapDataMouseLeave(element);
            break;
          case 'mousemove':
            onMapDataMouseMove(element);
            break;
        }
      }
    };
    setMapDataAction();

    // esto es requerido por popper.js para mostrar tooltips
    document.addEventListener('DOMContentLoaded', () => {
      let tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.map((tooltipTriggerEl) => {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    });
    this.init(map);
    document.getElementById('icvLegend') && (document.getElementById('icvLegend').style.display = 'none');
    document.getElementById('icvInfo') && (document.getElementById('icvInfo').style.display = 'none');
  }

  getStyle(name: string) {
    const stylePosition = this.config.map.item.findIndex(
      (element) => element.name == name
    );
    const configStyle =
      this.config.map.item[stylePosition != -1 ? stylePosition : 0].style;
    return style[style.findIndex((element) => element.name == configStyle)];
  }

  getStyleConfig(styleName: any) {
    if (styleName.import != '') {
      return styleName.import;
    } else {
      return styleName.style;
    }
  }
}
