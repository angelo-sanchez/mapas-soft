import autocomplete from "autocompleter";
//        const openCageUrl = 'https://api.opencagedata.com/geocode/v1/json'
const locationIQCode = "0e7dd68b4a8a12";
//        openCageID = "b005488f173e4ea799cfe369efa2f56d";

const locationParentElement = document.getElementById("location").parentNode;

export function addSearchBox(map) {
    const animSearch = new URLSearchParams(window.location.search).has("anim")
        ? 1
        : 0;

    const input = document.getElementById("search");

    autocomplete({
        input: input,
        minLength: 5,
        debounceWaitMs: 300,
        fetch: function(text, update) {
            text = text.toLowerCase();
            const request_url = `https://us1.locationiq.com/v1/search.php?format=json&key=${locationIQCode}&q=${encodeURIComponent(
                text
            )}&countrycodes=AR&accept-language=es&no_annotations=0`;
            const request = fetch(request_url);
            request
                .then((response) => response.text())
                .then((data) => {
                    // location is a flag to ease debugging
                    let element = document.getElementById("location");
                    if (element != null) element.parentNode.removeChild(element);
                    // console.log("response:" + data);
                    update(
                        JSON.parse(data).map(function(value, key) {
                            return {
                                label: value.display_name,
                                value: value.boundingbox,
                            };
                        })
                    );
                });
        },
        onSelect: function(item) {
            input.value = item.label;
            const bbox = item.value;
            //                console.log("Selected: " + item.value);
            if (animSearch) {
                map.fitBounds(
                    [
                        [bbox[3], bbox[1]],
                        [bbox[2], bbox[0]],
                    ],
                    { duration: 1500 }
                );
            } else {
                map.fitBounds(
                    [
                        [bbox[3], bbox[1]],
                        [bbox[2], bbox[0]],
                    ],
                    { duration: 0 }
                );
            }
            map.once("idle", (e) => {
                console.log("rendercomplete");
                //location.textContent
                //<div id="location" style="display: none;"></div>
                const newElement = document.createElement("div");
                newElement.setAttribute("id", "location");
                newElement.style.display = "none";
                locationParentElement.appendChild(newElement);
                document.title = item.label;
            });
        },
    });

    /*                map.fitBounds([[
                          bbox.northeast.lng,
                          bbox.northeast.lat
                      ], [
                          bbox.southwest.lng,
                          bbox.southwest.lat
                      ]]);*/
}
