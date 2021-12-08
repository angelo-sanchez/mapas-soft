# !/bin/sh
cmd="docker run -v ${1}:${2} --rm -i strikehawk/tippecanoe:latest tippecanoe -o $3 $4 $5"

$cmd