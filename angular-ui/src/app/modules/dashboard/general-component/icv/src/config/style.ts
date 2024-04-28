export default [
    {
        "name": "hereStyle",
        "import": "",
        "style": {
            "version": 8,
            "glyphs": "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
            "sources": {
                "raster-tiles": {
                    "type": "raster",
                    "tileSize": 512,
                    "attribution": "Map Tiles &copy $Date().getFullYear() <a href=\"http://developer.here.com\">HERE</a>",
                    "tiles": [
                        "https://1.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png?lg=spa&app_id=jejhBr3f7xuxzOjxs6Xr&app_code=vK_udKQVKFKI6elL-HrN2g",
                        "https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png?lg=spa&app_id=jejhBr3f7xuxzOjxs6Xr&app_code=vK_udKQVKFKI6elL-HrN2g",
                        "https://3.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png?lg=spa&app_id=jejhBr3f7xuxzOjxs6Xr&app_code=vK_udKQVKFKI6elL-HrN2g",
                        "https://4.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png?lg=spa&app_id=jejhBr3f7xuxzOjxs6Xr&app_code=vK_udKQVKFKI6elL-HrN2g"
                    ]
                }
            },
            "layers": [
                {
                    "id": "simple-tiles",
                    "type": "raster",
                    "source": "raster-tiles",
                    "minzoom": 0,
                    "maxzoom": 22
                }
            ]
        }
    },
    {
        "name": "esriStyle",
        "import": "https://icv.netlify.app/esri.json",
        "style": {
        }
    },
    {
        "name": "esriNightStyle",
        "import": "https://icv.netlify.app/esriNight.json",
        "style": {
        }
    },
    {
        "name": "esriDarkCanvas",
        "import": "https://icv.netlify.app/esriDarkCanvas.json",
        "style": {
        }
    },
    {
        "name": "esriLightCanvas",
        "import": "https://icv.netlify.app/esriLightCanvas.json",
        "style": {
        }
    }
]
