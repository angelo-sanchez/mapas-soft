
$local_dir=$args[0]
$container_dir=$args[1]
$out=$args[2]
$in=$args[3]

docker run -v ${local_dir}:${container_dir} --rm -i strikehawk/tippecanoe:latest tippecanoe --detect-shared-borders --generate-ids -P --extend-zooms-if-still-dropping -zg --coalesce --hilbert -o $out $in