export default (mapName: string) => ({
    "map": {
        "base": "esri",
        "item": [
            {
                "style": "hereStyle",
                "name": "here",
                "description": "HERE"
            },
            {
                "style": "esriStyle",
                "name": "esri",
                "description": "Esri"
            },
            {
                "style": "esriNightStyle",
                "name": "esriNight",
                "description": "Esri Oscuro"
            },
            {
                "style": "esriDarkCanvas",
                "name": "esriDarkCanvas",
                "description": "Esri Mínimo Oscuro"
            },
            {
                "style": "esriLightCanvas",
                "name": "esriLightCanvas",
                "description": "Esri Mínimo Claro"
            }
        ]
    },
    "layer": {
        "base": "barrios",
        "item": [
            {
                "name": "icv",
                "description": "Índice de calidad de Vida (ICV)",
                "config": "colorScales"
            },
            {
                "name": "barrios",
                "config": "colorScales",
                "description": mapName
            }
        ]
    }
})
