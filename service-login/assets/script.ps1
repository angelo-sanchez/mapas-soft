
$local_dir=$args[0]
$container_dir=$args[1]
$out=$args[2]
$in=$args[3]
$command="docker run -v ${local_dir}:${container_dir} --rm -i strikehawk/tippecanoe:latest tippecanoe -o $out $in " + $args[4]

powershell $command