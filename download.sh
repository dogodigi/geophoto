array=( "13413821@N02" "144159106@N05" "142633574@N03" "141719413@N05" "143426655@N08" "144295695@N07" "141736837@N03" "141736807@N03" "141720888@N03" "131154663@N03" "156974405@N07" "143561301@N05")
for i in "${array[@]}"
do
  node download.js $i
done
