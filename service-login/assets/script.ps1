$local_dir = $args[0]
$container_dir = $args[1]
$out = $args[2]
$in = $args[3]
$opts = $args[4..($args.length-1)]

$command = "docker run -v ${local_dir}:${container_dir} --rm -i strikehawk/tippecanoe:latest tippecanoe -o $out $opts $in"

Invoke-Expression $command