export default [
    {
        "layer": "barrios",
        "action": "click",
        "lng": "e.lngLat",
        "html":  "Object.entries(e.features[0].properties).map(p => `<p><b>${p[0]}:</b> ${p[1]}</p>`).join('\\n')",
    },
    {
        "layer": "barrios",
        "action": "mouseenter",
        "cursor": "pointer"
    },
    {
        "layer": "barrios",
        "action": "mouseleave",
        "cursor": ""
    },
    {
        "layer": "icv",
        "action" : "mousemove",
        "source": "icvInfo",
        "sourceLayer": "Arg_RRFF_ICV_2010",
        "text_prefix": "ICV: ",
        "value": "e.features[0].properties.ICV2010"
    },
    {
        "layer": "icv",
        "action" : "mouseleave",
        "sourceLayer": "Arg_RRFF_ICV_2010"
    }
]
