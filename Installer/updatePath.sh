
#!/bin/bash


file="/etc/environment"
newfile=""
while IFS= read -r line
do
    newfile+="${line}"
done <"$file"
data=$(sed -n 's/^.*"\(.*\)".*$/\1/ p' <<< ${newfile})
if [ `echo $data | grep -c ":/snap/bin" ` -gt 0 ]
then
  echo "Success"
else
  #echo "fail"
  data+=":/snap/bin"
fi
#echo $data
data1="PATH=\"$data\""
#echo $data1
echo $data1 > /etc/environment
source /etc/environment;