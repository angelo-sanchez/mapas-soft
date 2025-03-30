export default (mapName: string, mapUrl: string, sourceLayer: string, geometry: string, maxZoom) => [
    {
        "description": "Índice de calidad de Vida (ICV)",
        "name": "icv",
        "config": "colorScales",
        "source": {
            "type": "vector",
            "tiles": [
                "https://icv.conicet.gov.ar/tileserver-php/icv/{z}/{x}/{y}.pbf"
            ],
            "maxzoom": 12,
            "attribution": "Mapas ICV por <a href='https://igehcs.conicet.gov.ar/'>IGEHCS</a>. Desarrollo App por <a href='http://www.isistan.unicen.edu.ar/'>ISISTAN</a>. © <a href='http://www.conicet.gob.ar'>CONICET</a> & <a href='http://www.unicen.edu.ar'>UNCPBA</a>"
        },
        "layer": {
            "id": "icv",
            "type": "fill",
            "source": "icv",
            "source-layer": "Arg_RRFF_ICV_2010",
            "layout": {
                "visibility": "none"
            },
            "paint": {
                "fill-outline-color": [
                    "case",
                    [
                        "boolean",
                        [
                            "feature-state",
                            "hover"
                        ],
                        false
                    ],
                    "rgba(0, 0, 0, 1)",
                    "rgba(0, 0, 0, .1)"
                ],
                "fill-opacity": [
                    "case",
                    [
                        "boolean",
                        [
                            "feature-state",
                            "hover"
                        ],
                        false
                    ],
                    0.9,
                    0.6
                ],
                "fill-color": "icvFillColor(0)"
            }
        }
    },
    {
        "description": mapName,
        "name": "barrios",
        "source": {
            "type": "vector",
            "maxzoom": maxZoom ? maxZoom : 12,
            "tiles": [
                mapUrl
            ]
        },
        "layer": {
            "type": layerTypes[geometry],
            "id": "barrios",
            "source": "barrios",
            "source-layer": sourceLayer,
        },
    }
]


const layerTypes = {
  "Point": "circle",
  "MultiPoint": "circle",
  "LineString": "line",
  "MultiLineString": "line",
  "Polygon": "fill",
  "MultiPolygon": "fill"
}
