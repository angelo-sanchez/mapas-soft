# !/bin/sh
docker run -v ${1}:${2} --rm -i strikehawk/tippecanoe:latest tippecanoe --detect-shared-borders --generate-ids -P --extend-zooms-if-still-dropping -zg --coalesce --hilbert -o $3 $4