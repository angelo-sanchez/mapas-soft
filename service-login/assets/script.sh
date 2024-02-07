# !/bin/sh
src=$1
dst=$2
output=$3
input=$4
shift 4
opts=$@

cmd="docker run -v $src:$dst --rm -i strikehawk/tippecanoe:latest tippecanoe -o $output $opts $input"

$cmd