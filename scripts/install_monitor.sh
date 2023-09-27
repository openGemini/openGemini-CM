#!/usr/bin/env bash

ps -ef | grep -v grep | grep ts-monitor | grep $USER > /dev/null
if [ $? == 0 ];then
	killall -9 -w ts-monitor
fi

rm -rf /tmp/openGemini/logs/monitor*
mkdir -p /tmp/openGemini/logs

cp etc/monitor.conf etc/monitor-1.conf
sed -i "s/{{addr}}/127.0.0.1/g" etc/monitor-1.conf
sed -i "s/{{report_addr}}/127.0.0.1/g" etc/monitor-1.conf
sed -i "s/{{query_addr}}/127.0.0.1/g" etc/monitor-1.conf

nohup usr/bin/ts-monitor -config=etc/monitor-1.conf > /tmp/openGemini/logs/monitor_extra.log 2>&1 &